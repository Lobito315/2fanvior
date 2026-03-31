"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export function TopNavBar() {
  const { data: session } = useSession();
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Escuchar cambios en la sesión para refrescar datos si es necesario
    if (session?.user) {
      // Intentamos cargar los datos frescos del usuario
      fetch('/api/users/me')
        .then(res => {
          if (!res.ok) throw new Error("Status " + res.status);
          return res.json() as any;
        })
        .then(data => {
          if (data && !data.error) {
            setUserAvatar(data.avatar || null);
            setUserName(data.name || null);
          }
        })
        .catch((err) => {
          console.warn("Fetch failed, sticking to session data:", err.message);
          setUserName(session.user?.name || null);
        });
    }
  }, [session]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-bg-main/60 backdrop-blur-xl border-b border-border-subtle/30 shadow-premium">
      <div className="flex justify-between items-center h-20 px-10 ml-64">
        <div className="flex items-center flex-1 max-w-2xl">
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-text-muted text-lg group-focus-within:text-brand-secondary transition-all">
              search
            </span>
            <input 
              type="text" 
              placeholder="Search curators, artifacts, or digital IDs..." 
              className="w-full bg-bg-secondary/40 border border-border-subtle/40 rounded-2xl py-3 pl-14 pr-6 text-xs text-text-primary placeholder:text-text-muted/40 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-bg-secondary/80 transition-all font-medium tracking-wide"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <button className="relative text-text-muted hover:text-brand-secondary p-2.5 rounded-xl hover:bg-surface/50 transition-all active:scale-90 duration-300 group">
            <span className="material-symbols-outlined text-2xl">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-status-error rounded-full border-2 border-bg-main ring-4 ring-status-error/20"></span>
          </button>
          
          <div className="h-10 w-[1px] bg-border-subtle/30"></div>
          
          <div className="flex items-center gap-4 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-text-primary tracking-tight leading-none group-hover:text-brand-secondary transition-colors uppercase">{userName || session?.user?.name || "Anonymous"}</p>
              <p className="text-[9px] text-brand-primary font-bold uppercase tracking-[0.2em] mt-1.5 opacity-80">Elite Curator</p>
            </div>
            <div className="w-11 h-11 rounded-xl overflow-hidden ring-1 ring-border-subtle group-hover:ring-brand-primary/50 transition-all relative bg-surface shadow-premium">
              {userAvatar ? (
                <Image 
                  src={userAvatar} 
                  alt={userName || "User Profile"}
                  fill
                  sizes="44px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-primary/10">
                  <span className="material-symbols-outlined text-brand-primary text-2xl">person</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
