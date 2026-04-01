"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { TopNavBar } from '@/components/layout/TopNavBar';
import Image from 'next/image';
import Pusher from 'pusher-js';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import VideoCallModal from '@/components/modals/VideoCallModal';

// Initialize Pusher Client safely for SSR
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || '';
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2';

interface Participant {
  id: string;
  name: string;
  avatar: string | null;
  handle: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  sender?: {
    name: string;
    avatar: string | null;
  };
}

interface Conversation {
  id: string;
  participants: Participant[];
  messages: any[];
  lastMessageAt: string;
}

export default function ChatPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pusherRef = useRef<Pusher | null>(null);
  
  const currentUserId = (session?.user as any)?.id;

  // Initialize Pusher once
  useEffect(() => {
    if (!pusherKey) return;
    
    pusherRef.current = new Pusher(pusherKey, {
      cluster: pusherCluster,
      authEndpoint: '/api/pusher/auth',
    });

    return () => {
      pusherRef.current?.disconnect();
    };
  }, []);

  // Fetch conversations on load
  useEffect(() => {
    if (!session) return;
    
    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/conversations');
        const data = await res.json() as Conversation[];
        setConversations(data);
        if (data.length > 0 && !activeConversation) {
          setActiveConversation(data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [session]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?conversationId=${activeConversation.id}`);
        const data = await res.json() as any[];
        setMessages(data.map((m: any) => ({
          id: m.id,
          senderId: m.senderId,
          content: m.content,
          timestamp: m.createdAt,
          sender: m.sender
        })));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();

    // Subscribe to the private channel for this conversation
    if (pusherRef.current) {
      const channelName = `private-chat-${activeConversation.id}`;
      const channel = pusherRef.current.subscribe(channelName);

      channel.bind('receive_message', (data: any) => {
        setMessages(prev => {
          // Avoid duplicates if we sent it ourselves and it's being broadcast
          if (prev.some(m => m.id === data.id)) return prev;
          
          return [...prev, {
            id: data.id,
            senderId: data.senderId,
            content: data.content,
            timestamp: data.timestamp,
            sender: data.sender
          }];
        });
      });

      return () => {
        pusherRef.current?.unsubscribe(channelName);
      };
    }
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation || !currentUserId) return;

    const tempId = Math.random().toString();
    const newMessageContent = inputText.trim();
    
    // Optimistic UI update
    const optimisticMessage: Message = {
      id: tempId,
      senderId: currentUserId,
      content: newMessageContent,
      timestamp: new Date().toISOString(),
      sender: {
        name: session?.user?.name || '',
        avatar: (session?.user as any)?.avatar || null
      }
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setInputText('');

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          content: newMessageContent
        }),
      });
      
      const savedMessage = await res.json() as any;
      
      // Replace optimistic message with real message
      setMessages(prev => prev.map(m => m.id === tempId ? {
        id: savedMessage.id,
        senderId: savedMessage.senderId,
        content: savedMessage.content,
        timestamp: savedMessage.createdAt,
        sender: savedMessage.sender
      } : m));

    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const otherParticipant = activeConversation?.participants.find(p => p.id !== currentUserId);

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
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-on-surface text-lg">edit_square</span>
            </h2>
            <div className="mt-4 relative bg-surface-container-highest rounded-lg overflow-hidden">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-sm">search</span>
              <input type="text" placeholder="Search conversations..." className="w-full bg-transparent border-none py-2.5 pl-9 pr-4 text-xs font-body focus:ring-1 focus:ring-primary/50 text-on-surface placeholder:text-outline/40" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto w-full">
            {isLoading ? (
              <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-outline text-xs">No conversations yet.</div>
            ) : (
              conversations.map((conv) => {
                const partner = conv.participants.find(p => p.id !== currentUserId);
                const isActive = activeConversation?.id === conv.id;
                const lastMsg = conv.messages[0];

                return (
                  <div 
                    key={conv.id} 
                    onClick={() => setActiveConversation(conv)}
                    className={cn(
                      "flex items-center gap-3 p-4 border-l-2 cursor-pointer transition-all",
                      isActive 
                        ? "bg-surface-container-high border-primary" 
                        : "border-transparent hover:bg-surface-container-high/40"
                    )}
                  >
                    <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-outline-variant/10">
                      <Image 
                        src={partner?.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                        alt={partner?.name || "User"} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="font-headline font-bold text-sm text-on-surface truncate">{partner?.name}</h4>
                        <span className="text-[8px] font-label uppercase text-outline tracking-wider">
                          {conv.lastMessageAt ? format(new Date(conv.lastMessageAt), 'p') : ''}
                        </span>
                      </div>
                      <p className={cn("text-[11px] truncate", isActive ? "text-on-surface-variant" : "text-outline")}>
                        {lastMsg?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Active Chat Window */}
        <section className="flex-1 bg-surface-container-low rounded-xl border border-outline-variant/10 flex flex-col relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.03] to-transparent pointer-events-none z-0"></div>
          
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <header className="p-5 border-b border-outline-variant/10 flex justify-between items-center relative z-10 bg-surface-container-low/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full overflow-hidden relative border border-outline-variant/20 shadow-sm">
                     <Image 
                        src={otherParticipant?.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                        alt="Avatar" 
                        fill 
                        className="object-cover" 
                      />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface flex items-center gap-1.5">
                      {otherParticipant?.name} 
                      <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </h3>
                    <p className="text-[10px] text-emerald-400 font-label uppercase tracking-widest mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Online Now
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5 text-outline">
                  <button 
                    onClick={() => setIsCallModalOpen(true)}
                    title="Voice Call" 
                    className="p-2.5 hover:text-on-surface rounded-full hover:bg-surface-container-high transition-all active:scale-90"
                  >
                    <span className="material-symbols-outlined text-xl">call</span>
                  </button>
                  <button 
                    onClick={() => setIsCallModalOpen(true)}
                    title="Video Call" 
                    className="p-2.5 hover:text-on-surface rounded-full hover:bg-surface-container-high transition-all active:scale-90"
                  >
                    <span className="material-symbols-outlined text-xl">videocam</span>
                  </button>
                  <button title="Info" className="p-2.5 hover:text-on-surface rounded-full hover:bg-surface-container-high transition-all active:scale-90"><span className="material-symbols-outlined text-xl">info</span></button>
                </div>
              </header>

              <VideoCallModal 
                isOpen={isCallModalOpen}
                onClose={() => setIsCallModalOpen(false)}
                room={activeConversation.id}
                recipientName={otherParticipant?.name || "User"}
              />

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scroll-smooth custom-scrollbar">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-outline text-xs opacity-60">
                    <span className="material-symbols-outlined text-4xl mb-2">forum</span>
                    <p>No messages in this conversation yet.</p>
                  </div>
                )}
                
                {messages.map((msg, idx) => {
                  const isMine = msg.senderId === currentUserId;
                  const showAvatar = idx === 0 || messages[idx-1].senderId !== msg.senderId;
                  
                  return (
                    <div key={msg.id} className={cn("flex gap-3.5 max-w-[80%]", isMine ? "ml-auto flex-row-reverse" : "mr-auto")}>
                      {!isMine && (
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 relative border border-outline-variant/10 self-start mt-1">
                          {showAvatar ? (
                           <Image 
                              src={otherParticipant?.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                              alt="Avatar" 
                              fill 
                              className="object-cover" 
                            />
                          ) : <div className="w-full h-full bg-transparent" />}
                        </div>
                      )}
                      <div className={cn("flex flex-col gap-1.5", isMine ? "items-end" : "items-start")}>
                        <div className={cn(
                          "px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-all",
                          isMine 
                            ? "bg-primary text-on-primary rounded-[20px] rounded-tr-[4px]" 
                            : "bg-surface-container-highest text-on-surface rounded-[20px] rounded-tl-[4px] border border-outline-variant/10"
                        )}>
                          {msg.content}
                        </div>
                        <span className="text-[9px] text-outline px-1 font-label">
                          {format(new Date(msg.timestamp), 'p')}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-surface-container-high/40 backdrop-blur-xl border-t border-outline-variant/10 relative z-10 w-full">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-1.5 focus-within:ring-1 focus-within:ring-primary/30 transition-all shadow-sm">
                  <button type="button" className="p-2.5 text-outline hover:text-primary transition-colors rounded-full hover:bg-surface-container-high">
                    <span className="material-symbols-outlined text-lg">attach_file</span>
                  </button>
                  
                  <textarea 
                    rows={1}
                    placeholder={`Message ${otherParticipant?.name}...`} 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    className="flex-1 bg-transparent max-h-32 min-h-[44px] resize-none outline-none text-sm text-on-surface py-3 px-1 font-body placeholder:text-outline/40"
                  />
                  
                  <div className="flex gap-1">
                    <button type="button" title="Send Tip" className="p-2.5 text-tertiary transition-all hover:bg-tertiary/10 rounded-full active:scale-90">
                       <span className="material-symbols-outlined text-xl">monetization_on</span>
                    </button>
                    <button 
                      type="submit" 
                      disabled={!inputText.trim()}
                      className="p-2.5 bg-primary text-on-primary transition-all hover:brightness-110 active:scale-90 rounded-full disabled:opacity-40 disabled:pointer-events-none shadow-md"
                    >
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                    </button>
                  </div>
                </form>
                <div className="text-center mt-3 opacity-40">
                  <span className="text-[8px] font-label uppercase tracking-[0.1em] text-outline flex justify-center items-center gap-1.5">
                    <span className="material-symbols-outlined text-[10px]">lock</span>
                    Private Secure Tunnel
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-5xl text-primary/40">chat_bubble</span>
              </div>
              <h2 className="font-headline text-xl font-bold text-on-surface">Your Messages</h2>
              <p className="text-outline text-sm max-w-xs mx-auto leading-relaxed">
                Connect with creators and fans privately. Select a conversation to start chatting.
              </p>
              <button className="mt-4 px-6 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-bold hover:bg-primary/20 transition-all">
                Find People
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
