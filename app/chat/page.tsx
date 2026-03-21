"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { TopNavBar } from '@/components/layout/TopNavBar';
import Image from 'next/image';
import Pusher from 'pusher-js';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Initialize Pusher Client
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Dummy ids for demonstration
  const currentUserId = "user_me";
  const activeChatId = "chat_123";

  useEffect(() => {
    // Subscribe to Pusher channel
    const channel = pusher.subscribe(activeChatId);

    channel.bind('receive_message', (data: { message: string, senderId: string, timestamp: string }) => {
      // Avoid duplicates if we sent it ourselves and it's being broadcast
      // This depends on the Pusher configuration (exclude_sender)
      setMessages(prev => {
        // Simple check to avoid double adding locally sent messages if they come back from Pusher
        if (data.senderId === currentUserId) return prev;
        
        return [...prev, {
          id: Math.random().toString(),
          senderId: data.senderId,
          message: data.message,
          timestamp: data.timestamp
        }];
      });
    });

    return () => {
      pusher.unsubscribe(activeChatId);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Math.random().toString(),
      senderId: currentUserId,
      message: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    // Optimistic UI update
    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Send to server via API
    try {
      await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: activeChatId,
          message: newMessage.message,
          senderId: currentUserId
        }),
      });
    } catch (err) {
      console.error("Failed to send message via Pusher API:", err);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <SideNavBar />
      <TopNavBar />

      <main className="ml-64 mt-16 p-8 h-[calc(100vh-4rem)] flex gap-6 w-full max-w-7xl mx-auto">
        
        {/* Chat List Sidebar */}
        <aside className="w-80 bg-surface-container-low rounded-xl border border-outline-variant/10 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10">
            <h2 className="font-headline font-bold text-xl text-on-surface flex items-center justify-between">
              Messages
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-on-surface">edit_square</span>
            </h2>
            <div className="mt-4 relative bg-surface-container-highest rounded-lg overflow-hidden">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-sm">search</span>
              <input type="text" placeholder="Search conversations..." className="w-full bg-transparent border-none py-2 pl-9 pr-4 text-xs font-body focus:ring-1 focus:ring-primary/50 text-on-surface placeholder:text-outline/40" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto w-full">
            {/* Active Thread */}
            <div className="flex items-center gap-3 p-4 bg-surface-container-high border-l-2 border-primary cursor-pointer transition-colors">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHAlaRdiimN0kwhN49DkYsCYawwy-MT7hiqRvoMlNcg31IOixdrxh4oKSluhuLjEDfNjDID8uOXye-GJ3OtCE_YFobKYjWbEwf8IUNvTKHxi9RdZqpSwLS7HcRWFAVFk9iuvLP55v-99cqVgFtS0Kv5LToYVvDdwoaDV9Jk5GgZDt4NagagCUXphoMUvOwjSNvH-Fbi5gjpd9YnSoOjsSAXzU42F1fdCapbPGKvjfraxfi4er3r4oCSx5bQiuYePECUbOn1xTqtd90" alt="Avatar" fill className="object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-surface-container-high"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-headline font-bold text-sm text-on-surface truncate">Sienna Velour</h4>
                  <span className="text-[9px] font-label uppercase text-outline tracking-wider">Now</span>
                </div>
                <p className="text-xs text-on-surface-variant truncate">Thank you for unlocking the tier!</p>
              </div>
            </div>

            {/* Inactive Thread */}
            <div className="flex items-center gap-3 p-4 hover:bg-surface-container-high/50 border-l-2 border-transparent cursor-pointer transition-colors opacity-70 hover:opacity-100">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLRBUcN4Mia_YWqLd1aDEyvpQbDDZv1KSUaJSVT5kf1FSHZKOZ-ayiMdR0FQOPBJsmvE597jKEHx-PecQXXNpvZuz-TDBEgnqxcJ-5oiCBtIftYSFoFtYi3AlM90NVFB2E4kzXFlDiWnNaPuPc_vEXqF0eo0O-d4hzg7ZCbgqukklXN-THDchgsjPQhXLcQN35_-WIaQ_k8ZpKTypzSwO-_mEJDaUXBoWbu4VLZfEn0mHYp97s-J091dhzo8-ODf4Rto9KM0DlyjCC" alt="Avatar" fill className="object-cover grayscale" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-headline font-bold text-sm text-on-surface truncate">Archive Project</h4>
                  <span className="text-[9px] font-label uppercase text-outline tracking-wider">Yesterday</span>
                </div>
                <p className="text-xs text-outline truncate">We will restock the prints on Friday.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Active Chat Window */}
        <section className="flex-1 bg-surface-container-low rounded-xl border border-outline-variant/10 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none opacity-50 z-0"></div>
          
          {/* Chat Header */}
          <header className="p-6 border-b border-outline-variant/10 flex justify-between items-center relative z-10 bg-surface-container-low/80 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden relative border border-outline-variant/20">
                 <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHAlaRdiimN0kwhN49DkYsCYawwy-MT7hiqRvoMlNcg31IOixdrxh4oKSluhuLjEDfNjDID8uOXye-GJ3OtCE_YFobKYjWbEwf8IUNvTKHxi9RdZqpSwLS7HcRWFAVFk9iuvLP55v-99cqVgFtS0Kv5LToYVvDdwoaDV9Jk5GgZDt4NagagCUXphoMUvOwjSNvH-Fbi5gjpd9YnSoOjsSAXzU42F1fdCapbPGKvjfraxfi4er3r4oCSx5bQiuYePECUbOn1xTqtd90" alt="Avatar" fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface">Sienna Velour <span className="material-symbols-outlined text-[12px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span></h3>
                <p className="text-[10px] text-emerald-400 font-label uppercase tracking-widest mt-0.5">Online Now</p>
              </div>
            </div>
            <div className="flex gap-2 text-outline">
              <button className="p-2 hover:text-on-surface rounded-full hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined">call</span></button>
              <button className="p-2 hover:text-on-surface rounded-full hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined">videocam</span></button>
              <button className="p-2 hover:text-on-surface rounded-full hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined">info</span></button>
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scroll-smooth">
            <div className="text-center py-4">
              <span className="text-[10px] font-label uppercase tracking-widest bg-surface-container-high px-3 py-1 rounded-full text-outline border border-outline-variant/10">Today, 2:40 PM</span>
            </div>

            {/* Bubble Received */}
            <div className="flex gap-4 max-w-lg">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 relative pt-1">
                 <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHAlaRdiimN0kwhN49DkYsCYawwy-MT7hiqRvoMlNcg31IOixdrxh4oKSluhuLjEDfNjDID8uOXye-GJ3OtCE_YFobKYjWbEwf8IUNvTKHxi9RdZqpSwLS7HcRWFAVFk9iuvLP55v-99cqVgFtS0Kv5LToYVvDdwoaDV9Jk5GgZDt4NagagCUXphoMUvOwjSNvH-Fbi5gjpd9YnSoOjsSAXzU42F1fdCapbPGKvjfraxfi4er3r4oCSx5bQiuYePECUbOn1xTqtd90" alt="Avatar" fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-1 items-start">
                <div className="bg-surface-container-highest text-on-surface px-5 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed border border-outline-variant/5">
                  Thank you so much for unlocking the Platinum tier! Let me know if you want early access to the new editorial shoot.
                </div>
                <span className="text-[10px] text-outline ml-1">2:42 PM</span>
              </div>
            </div>

            {/* Dynamic Real-time Messages */}
            {messages.map((msg) => {
              const isMine = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={cn("flex gap-4 max-w-lg", isMine ? "ml-auto flex-row-reverse" : "")}>
                  {!isMine && (
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 relative pt-1">
                       <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHAlaRdiimN0kwhN49DkYsCYawwy-MT7hiqRvoMlNcg31IOixdrxh4oKSluhuLjEDfNjDID8uOXye-GJ3OtCE_YFobKYjWbEwf8IUNvTKHxi9RdZqpSwLS7HcRWFAVFk9iuvLP55v-99cqVgFtS0Kv5LToYVvDdwoaDV9Jk5GgZDt4NagagCUXphoMUvOwjSNvH-Fbi5gjpd9YnSoOjsSAXzU42F1fdCapbPGKvjfraxfi4er3r4oCSx5bQiuYePECUbOn1xTqtd90" alt="Avatar" fill className="object-cover" />
                    </div>
                  )}
                  <div className={cn("flex flex-col gap-1", isMine ? "items-end" : "items-start")}>
                    <div className={cn(
                      "px-5 py-3 text-sm leading-relaxed shadow-md",
                      isMine 
                        ? "bg-primary-container text-on-primary-container rounded-2xl rounded-tr-sm" 
                        : "bg-surface-container-highest text-on-surface rounded-2xl rounded-tl-sm border border-outline-variant/5"
                    )}>
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-outline mx-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-surface-container-high/60 backdrop-blur-xl border-t border-outline-variant/10 relative z-10 w-full">
            <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-2 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
              <button type="button" className="p-2 text-outline hover:text-primary transition-colors mb-0.5 rounded-full hover:bg-surface-container-high">
                <span className="material-symbols-outlined text-xl">attach_file</span>
              </button>
              
              <textarea 
                rows={1}
                placeholder="Message Sienna..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                className="flex-1 bg-transparent max-h-32 min-h-[40px] resize-none outline-none text-sm text-on-surface py-2.5 font-body placeholder:text-outline/50"
              />
              
              <div className="flex gap-1 mb-0.5">
                <button type="button" className="p-2 text-primary transition-colors hover:bg-primary/10 rounded-full">
                   <span className="material-symbols-outlined text-xl text-tertiary">monetization_on</span>
                </button>
                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  className="p-2 bg-primary-container text-on-primary-container transition-colors hover:brightness-110 active:scale-95 rounded-full disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                </button>
              </div>
            </form>
            <div className="text-center mt-2 opacity-50">
              <span className="text-[9px] font-label uppercase tracking-widest text-outline flex justify-center gap-1">
                <span className="material-symbols-outlined text-[11px]">lock</span>
                End-to-End Encrypted Void
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
