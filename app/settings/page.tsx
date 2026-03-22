"use client";

import React, { useState, useEffect, useRef } from 'react';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';

export default function SettingsPage() {
  const { update } = useSession();
  const [activeTab, setActiveTab] = useState('PROFILE');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // States para el form
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cargar info del usuario al entrar
    fetch('/api/users/me')
      .then(async res => await res.json() as any)
      .then(data => {
        if (!data.error) {
          setName(data.name || '');
          setUsername(data.handle || '');
          setBio(data.bio || '');
          setAvatar(data.avatar || null);
        }
        setLoading(false);
      });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handeSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, handle: username, bio, avatar })
      });
      if (res.ok) {
        // Actualizar la sesión solo con el nombre (datos ligeros)
        await update({ name });
        alert("¡Cambios guardados con éxito!");
      } else {
        alert("Hubo un error guardand tu perfil.");
      }
    } catch(err) {
      alert("Error de conexión.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <SideNavBar />
      <TopNavBar />
      
      <main className="ml-64 mt-16 p-8 min-h-screen">
        <div className="mb-10">
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">Platform <span className="text-primary">Settings</span></h2>
          <p className="text-outline mt-2 max-w-lg">Manage your account preferences, privacy controls, and platform aesthetics.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="flex flex-col gap-2">
              <button onClick={() => setActiveTab('PROFILE')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'PROFILE' ? 'bg-primary-container text-on-primary-container' : 'text-outline hover:bg-surface-container-low hover:text-on-surface'}`}>
                <span className="material-symbols-outlined text-[18px]">person</span>
                Profile & Identity
              </button>
              <button onClick={() => setActiveTab('SECURITY')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'SECURITY' ? 'bg-primary-container text-on-primary-container' : 'text-outline hover:bg-surface-container-low hover:text-on-surface'}`}>
                <span className="material-symbols-outlined text-[18px]">security</span>
                Security & Access
              </button>
            </nav>
          </aside>

          <section className="flex-1 glass-card bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]">
            {activeTab === 'PROFILE' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header>
                  <h3 className="font-headline text-2xl font-bold tracking-tight">Public Persona</h3>
                  <p className="text-sm font-body text-outline mt-1">This is how the community sees you on Fanvior.</p>
                </header>
                
                {loading ? (
                  <div className="animate-pulse flex flex-col gap-6">
                    <div className="w-24 h-24 rounded-full bg-surface-container-low"></div>
                    <div className="h-10 bg-surface-container-low rounded-lg w-full max-w-md"></div>
                    <div className="h-10 bg-surface-container-low rounded-lg w-full max-w-md"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center border-2 border-outline/20 overflow-hidden relative">
                        {avatar ? (
                           <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                           <span className="material-symbols-outlined text-4xl text-outline/50">photo_camera</span>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          ref={fileInputRef} 
                          onChange={handleImageChange}
                        />
                      </div>
                      <div>
                        <Button variant="outline" className="text-xs mr-3 px-4" onClick={() => fileInputRef.current?.click()}>
                          Change Avatar
                        </Button>
                        <button onClick={() => setAvatar(null)} className="text-xs text-error font-bold hover:underline">Remove</button>
                      </div>
                    </div>

                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="text-[10px] font-label uppercase tracking-widest text-outline block mb-2">Display Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface-container-low border border-outline/20 rounded-lg p-3 text-on-surface font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors hover:border-outline/40" />
                      </div>
                      <div>
                        <label className="text-[10px] font-label uppercase tracking-widest text-outline block mb-2">Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-surface-container-low border border-outline/20 rounded-lg p-3 text-on-surface font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors hover:border-outline/40" />
                      </div>
                      <div>
                        <label className="text-[10px] font-label uppercase tracking-widest text-outline block mb-2">Bio / Editorial Tagline</label>
                        <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Describe your sanctuary..." className="w-full bg-surface-container-low border border-outline/20 rounded-lg p-3 text-on-surface font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none hover:border-outline/40"></textarea>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-outline/10">
                      <Button variant="gradient" className="px-8 shadow-lg shadow-primary/20" onClick={handeSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Profile'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {activeTab !== 'PROFILE' && (
              <div className="flex flex-col items-center justify-center h-64 opacity-50 space-y-4 animate-in fade-in duration-500">
                <span className="material-symbols-outlined text-4xl text-outline">construction</span>
                <p className="font-label uppercase tracking-widest text-outline">Development Phase Area</p>
                <p className="text-xs font-body max-w-xs text-center">This section of the vault is currently being curated. Come back soon.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
