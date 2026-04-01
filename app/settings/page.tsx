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
  const [paypalEmail, setPaypalEmail] = useState('');
  
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
          setPaypalEmail(data.paypalEmail || '');
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
        body: JSON.stringify({ name, handle: username, bio, avatar, paypalEmail })
      });
      if (res.ok) {
        // Actualizar la sesión solo con el nombre (datos ligeros)
        await update({ name });
        alert("¡Cambios guardados con éxito!");
      } else {
        const err = await res.json() as any;
        alert(err.details?.paypalEmail?._errors?.[0] || "Hubo un error guardando tus ajustes.");
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
              <button onClick={() => setActiveTab('PAYMENTS')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'PAYMENTS' ? 'bg-primary-container text-on-primary-container' : 'text-outline hover:bg-surface-container-low hover:text-on-surface'}`}>
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                Payment Vault
              </button>
              <button onClick={() => setActiveTab('NOTIFICATIONS')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'NOTIFICATIONS' ? 'bg-primary-container text-on-primary-container' : 'text-outline hover:bg-surface-container-low hover:text-on-surface'}`}>
                <span className="material-symbols-outlined text-[18px]">notifications</span>
                Alerts & Feedback
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

            {activeTab === 'PAYMENTS' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-on-surface">
                <header>
                  <h3 className="font-headline text-2xl font-bold tracking-tight">Financial Hub</h3>
                  <p className="text-sm font-body text-outline mt-1">Configure your payout destinations and commercial credentials.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PayPal Card */}
                  <div className="p-6 bg-surface-container-low border border-brand-primary/10 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <span className="material-symbols-outlined text-6xl">payments</span>
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                         <span className="material-symbols-outlined text-brand-primary">p2p</span>
                      </div>
                      <h4 className="font-bold">PayPal Gateway</h4>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-label uppercase tracking-widest text-outline block mb-2">Payout Email Address</label>
                        <input 
                          type="email" 
                          value={paypalEmail} 
                          onChange={e => setPaypalEmail(e.target.value)} 
                          placeholder="your-paypal@example.com"
                          className="w-full bg-surface-container-lowest border border-outline/20 rounded-lg p-3 text-on-surface font-body focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors text-sm" 
                        />
                        <p className="text-[10px] text-outline mt-2 italic flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">info</span>
                          Verified payouts are processed every 48 hours.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Future Gateways Placeholder */}
                  <div className="p-6 bg-surface-container-low/50 border border-outline/10 border-dashed rounded-2xl flex flex-col items-center justify-center text-center opacity-40">
                     <span className="material-symbols-outlined text-4xl mb-3">add_circle</span>
                     <p className="text-[10px] font-bold uppercase tracking-widest">Connect More</p>
                     <p className="text-[10px] mt-1">Stripe, Crypto, Bank Transfer (Coming soon)</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-outline/10">
                  <Button variant="gradient" className="px-10 shadow-xl shadow-brand-primary/20" onClick={handeSave} disabled={saving}>
                    {saving ? 'Synchronizing...' : 'Save Payout Settings'}
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'NOTIFICATIONS' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header>
                  <h3 className="font-headline text-2xl font-bold tracking-tight">Notification Preferences</h3>
                  <p className="text-sm font-body text-outline mt-1">Control how and when Fanvior contacts you.</p>
                </header>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-surface-container-low border border-outline/10 rounded-lg">
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">Email Newsletters</h4>
                      <p className="text-xs text-outline font-body mt-1">Curated drops and platform updates</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-outline/30 bg-surface-container-lowest text-primary focus:ring-0 focus:ring-offset-0 transition-colors" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container-low border border-outline/10 rounded-lg">
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">Push Notifications</h4>
                      <p className="text-xs text-outline font-body mt-1">Real-time alerts for likes, tips, and comments</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-outline/30 bg-surface-container-lowest text-primary focus:ring-0 focus:ring-offset-0 transition-colors" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container-low border border-outline/10 rounded-lg">
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">New Subscriber Alerts</h4>
                      <p className="text-xs text-outline font-body mt-1">Get notified immediately when someone joins your tier</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-outline/30 bg-surface-container-lowest text-primary focus:ring-0 focus:ring-offset-0 transition-colors" />
                  </div>
                </div>

                <div className="pt-6 border-t border-outline/10">
                  <Button variant="gradient" className="px-8 shadow-lg shadow-primary/20">
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}

            {activeTab !== 'PROFILE' && activeTab !== 'NOTIFICATIONS' && (
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
