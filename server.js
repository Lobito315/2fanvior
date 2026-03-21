const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3001;

const app = next({ dev, hostname, port, turbo: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('🔗 Client Connected:', socket.id);

    // Join a specific chat room (e.g., between user A and B)
    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    // Send a message
    socket.on('send_message', (data) => {
      const { chatId, message, senderId } = data;
      // Broadcast to everyone in the room except the sender
      socket.to(chatId).emit('receive_message', { 
        message, 
        senderId, 
        timestamp: new Date().toISOString() 
      });
    });

    socket.on('disconnect', () => {
      console.log('Client Disconnected:', socket.id);
    });
  });

  server.once('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`> 🚀 Ready on http://${hostname}:${port}`);
    console.log(`> 🔌 WebSocket Server listening for connections`);
  });
});
