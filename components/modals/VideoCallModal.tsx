"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import LiveVideo from '../video/LiveVideo';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: string;
  recipientName: string;
}

export default function VideoCallModal({ isOpen, onClose, room, recipientName }: VideoCallModalProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && room) {
      const fetchToken = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/livekit/token?room=${room}`);
          const data = await res.json() as { token: string };
          setToken(data.token);
        } catch (err) {
          console.error("Failed to fetch Video Call token:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchToken();
    } else {
      setToken(null);
    }
  }, [isOpen, room]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden bg-black border-none"
    >
      <div className="absolute top-4 left-6 z-30 pointer-events-none">
        <h2 className="text-white/60 text-[10px] font-label uppercase tracking-[0.2em] mb-1">Secure Video Call</h2>
        <h3 className="text-white font-headline font-bold text-xl">{recipientName}</h3>
      </div>

      <div className="flex-1 flex flex-col relative bg-surface-container-lowest">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-white/40">
             <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-xs uppercase tracking-widest">Bridging Connection...</p>
          </div>
        ) : token ? (
          <div className="flex-1 h-full">
            <LiveVideo 
                room={room} 
                token={token} 
                onDisconnected={onClose}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/40">
             <span className="material-symbols-outlined text-4xl mb-2">signal_disconnected</span>
             <p className="text-xs uppercase tracking-widest">Failed to connect</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
