"use client";

import React, { useState, useEffect } from 'react';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { useSession } from 'next-auth/react';
import LiveVideo from '@/components/video/LiveVideo';
import Pusher from 'pusher-js';

// Initialize Pusher Client safely for SSR
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || '';
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2';

interface LiveMessage {
  user: string;
  text: string;
  color: string;
}

export default function LiveStreamPage() {
  const { data: session } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [room, setRoom] = useState<string>("main-broadcast"); // Default room
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>([]);
  const [inputText, setInputText] = useState("");
  
  const currentUserId = (session?.user as any)?.id;

  // Fetch LiveKit Token
  useEffect(() => {
    if (!session) return;

    const fetchToken = async () => {
      try {
        const res = await fetch(`/api/livekit/token?room=${room}`);
        const data = await res.json() as { token: string };
        setToken(data.token);
      } catch (err) {
        console.error("Failed to fetch LiveKit token:", err);
      }
    };

    fetchToken();
  }, [session, room]);

  // Pusher Live Chat Integration
  useEffect(() => {
    if (!pusherKey || !room) return;

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      authEndpoint: '/api/pusher/auth',
    });

    const channel = pusher.subscribe(`presence-live-${room}`);

    channel.bind('receive_message', (data: any) => {
      setLiveMessages(prev => [...prev, {
        user: data.user,
        text: data.text,
        color: data.color || "text-on-surface"
      }]);
    });

    return () => {
      pusher.unsubscribe(`presence-live-${room}`);
      pusher.disconnect();
    };
  }, [room]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // In a real app, this would be an API call that triggers Pusher
    // For now, we'll simulate the local addition or call a generic trigger
    // Since we've already set up Pusher for chat, we could reuse that logic
    setLiveMessages(prev => [...prev, {
      user: session?.user?.name || "Me",
      text: inputText.trim(),
      color: "text-primary"
    }]);
    
    setInputText("");
  };

  return (
    <div className="bg-surface text-on-surface h-screen overflow-hidden flex flex-col">
      <TopNavBar />
      <SideNavBar />
      
      <main className="ml-64 mt-16 flex-1 flex">
        {/* Stream Area */}
        <section className="flex-1 p-6 flex flex-col">
          <div className="w-full flex-1 bg-surface-container-highest rounded-2xl border border-outline-variant/20 overflow-hidden relative shadow-2xl flex flex-col group">
            
            {token ? (
              <LiveVideo room={room} token={token} />
            ) : (
              <div className="absolute inset-0 bg-surface-container-lowest flex flex-col items-center justify-center">
                 <div className="w-24 h-24 rounded-full bg-primary-container/20 border border-primary/30 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-4xl text-primary animate-bounce">sensors</span>
                 </div>
                 <h2 className="font-headline text-2xl font-bold tracking-tight">Initializing Stream...</h2>
                 <p className="text-outline text-sm mt-2 font-body">Establishing secure connection to the broadcast node.</p>
              </div>
            )}

            {/* Video Overlays */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between p-6 pointer-events-none">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-error text-error-container px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase font-label">
                  <span className="w-2 h-2 rounded-full bg-error-container animate-pulse"></span>
                  LIVE
                </div>
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold text-white">
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  1,242
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="flex flex-col">
              <h1 className="font-headline text-2xl font-bold tracking-tight uppercase">Midnight Editorial Shoot: Behind the Scenes</h1>
              <p className="text-sm text-outline mt-1 font-label uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">lock</span>
                Exclusive to Midnight Elite Tier
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-outline-variant/20 bg-surface-container hover:bg-surface-container-highest transition-colors font-bold text-sm">
                 <span className="material-symbols-outlined text-lg">share</span>
                 Share
              </button>
              <button className="flex items-center gap-2 px-6 py-2 rounded-full brand-gradient text-on-primary-container shadow-lg shadow-primary-container/20 font-bold text-sm">
                 <span className="material-symbols-outlined text-lg">payments</span>
                 Send Tip
              </button>
            </div>
          </div>
        </section>

        {/* Live Chat Sidebar */}
        <aside className="w-96 border-l border-outline-variant/10 bg-surface-container-low flex flex-col h-full relative z-20">
           <header className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface w-full">
             <h3 className="font-headline font-bold uppercase tracking-widest text-sm">Live Chat</h3>
             <span className="material-symbols-outlined text-outline">more_horiz</span>
           </header>

           <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {liveMessages.length === 0 && (
                <div className="text-center py-10 opacity-30">
                  <span className="material-symbols-outlined text-4xl mb-2">forum</span>
                  <p className="text-xs uppercase tracking-widest">Chat is empty</p>
                </div>
              )}
              {liveMessages.map((msg, i) => (
                <div key={i} className="text-sm font-body leading-snug animate-in fade-in slide-in-from-bottom-1 duration-300">
                  <span className={`font-bold mr-2 ${msg.color}`}>{msg.user}</span>
                  <span className="text-on-surface-variant">{msg.text}</span>
                </div>
              ))}
              
              <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
           </div>

           <footer className="p-4 bg-surface w-full border-t border-outline-variant/10">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Send a message..." 
                  className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-full px-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button type="submit" className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0 hover:bg-primary transition-colors disabled:opacity-50" disabled={!inputText.trim()}>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
              <div className="mt-3 flex justify-between items-center text-xs text-outline px-2">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">sentiment_satisfied</span></span>
                <span className="uppercase tracking-widest text-[9px]">Chat rules apply</span>
              </div>
           </footer>
        </aside>
      </main>
    </div>
  );
}
