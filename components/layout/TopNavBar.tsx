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
          return res.json();
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
    <header className="fixed top-0 w-full z-40 bg-surface/70 backdrop-blur-xl shadow-2xl shadow-black/50">
      <div className="flex justify-between items-center h-16 px-8 ml-64">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">
              search
            </span>
            <input 
              type="text" 
              placeholder="Search creators, subscribers or IDs..." 
              className="w-full bg-surface-container-low/50 border-none rounded-full py-2 pl-12 pr-4 text-sm text-on-surface focus:ring-2 focus:ring-primary transition-all font-body"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-outline hover:bg-surface-container-high/80 p-2 rounded-full transition-colors active:scale-95 duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          
          <div className="h-8 w-[1px] bg-outline-variant/50"></div>
          
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all relative bg-surface-container">
              {userAvatar ? (
                <Image 
                  src={userAvatar} 
                  alt={userName || "User Profile"}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <span className="material-symbols-outlined text-primary text-xl">person</span>
                </div>
              )}
            </div>
            <div className="hidden lg:block text-right">
              <p className="text-xs font-bold text-on-surface">{userName || session?.user?.name || "Anonymous"}</p>
              <p className="text-[10px] text-primary font-medium">Fanvior User</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
