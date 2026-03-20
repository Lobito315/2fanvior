const { createServer } = require("http");
const next = require("next");
const { WebSocketServer } = require("ws");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const dev = process.env.NODE_ENV !== "production";
const host = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev, hostname: host, port });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

function parseCookies(raw = "") {
  return raw.split(";").reduce((acc, current) => {
    const [key, ...rest] = current.trim().split("=");
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

function getUserIdFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies.fanvior_token;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "fanvior-dev-secret");
    return payload.sub;
  } catch {
    return null;
  }
}

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));
  const wss = new WebSocketServer({ server, path: "/ws" });
  const rooms = new Map();

  wss.on("connection", (socket, request) => {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      socket.close(4001, "Unauthorized");
      return;
    }

    socket.on("message", async (raw) => {
      try {
        const event = JSON.parse(raw.toString());
        if (event.type === "join") {
          socket.conversationId = event.conversationId;
          const room = rooms.get(event.conversationId) || new Set();
          room.add(socket);
          rooms.set(event.conversationId, room);
        }

        if (event.type === "message") {
          const conversationId = event.conversationId;
          const content = String(event.content || "").trim();
          if (!conversationId || !content) return;

          const message = await prisma.message.create({
            data: {
              content,
              senderId: userId,
              conversationId
            },
            include: {
              sender: {
                include: { profile: true }
              }
            }
          });

          const peers = rooms.get(conversationId) || new Set();
          for (const peer of peers) {
            if (peer.readyState === 1) {
              peer.send(JSON.stringify({ type: "message", payload: message }));
            }
          }
        }
      } catch {
        socket.send(JSON.stringify({ type: "error", payload: "Invalid websocket payload" }));
      }
    });

    socket.on("close", () => {
      if (!socket.conversationId) return;
      const room = rooms.get(socket.conversationId);
      if (!room) return;
      room.delete(socket);
      if (!room.size) rooms.delete(socket.conversationId);
    });
  });

  server.listen(port, host, () => {
    console.log(`Fanvior running on http://${host}:${port}`);
  });
});
