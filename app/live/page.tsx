"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Message = {
  id: string;
  content: string;
  sender: {
    username: string;
    profile?: { displayName?: string | null };
  };
};

export default function LivePage() {
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const socketUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${window.location.host}/ws`;
  }, []);

  useEffect(() => {
    fetch("/api/chat/conversations")
      .then((res) => res.json())
      .then((data) => {
        if (data.conversation?.id) {
          setConversationId(data.conversation.id);
          setMessages(data.conversation.messages || []);
        }
      });
  }, []);

  useEffect(() => {
    if (!socketUrl || !conversationId) return;
    const socket = new WebSocket(socketUrl);
    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({ type: "join", conversationId }));
    });
    socket.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === "message") {
        setMessages((current) => [...current, payload.payload]);
      }
    });
    return () => socket.close();
  }, [socketUrl, conversationId]);

  async function sendMessage() {
    if (!content.trim() || !conversationId) return;
    const socket = new WebSocket(socketUrl);
    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({ type: "join", conversationId }));
      socket.send(JSON.stringify({ type: "message", conversationId, content }));
      socket.close();
    });
    setContent("");
  }

  return (
    <DashboardShell>
      <Card>
        <h1 className="text-3xl font-bold">Real-time chat</h1>
        <div className="mt-6 space-y-4">
          <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-3xl border border-white/10 bg-black/20 p-4">
            {messages.map((message) => (
              <div key={message.id} className="rounded-2xl bg-white/5 p-4">
                <p className="font-semibold">{message.sender.profile?.displayName || message.sender.username}</p>
                <p className="mt-1 text-sm text-slate-300">{message.content}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Send a message"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
            />
            <Button onClick={sendMessage} type="button">
              Send
            </Button>
          </div>
        </div>
      </Card>
    </DashboardShell>
  );
}
