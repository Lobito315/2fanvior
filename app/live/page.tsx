import React from 'react';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { SideNavBar } from '@/components/layout/SideNavBar';

export default function LiveStreamPage() {
  return (
    <div className="bg-surface text-on-surface h-screen overflow-hidden flex flex-col">
      <TopNavBar />
      <SideNavBar />
      
      <main className="ml-64 mt-16 flex-1 flex">
        {/* Stream Area */}
        <section className="flex-1 p-6 flex flex-col">
          <div className="w-full flex-1 bg-surface-container-highest rounded-2xl border border-outline-variant/20 overflow-hidden relative shadow-2xl flex flex-col group">
            
            {/* Live Video Placeholder */}
            <div className="absolute inset-0 bg-surface-container-lowest">
               {/* Ambient glowing background simulating broadcast */}
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/30 via-surface to-surface opacity-50 animate-pulse"></div>
               
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="w-24 h-24 rounded-full bg-primary-container/20 border border-primary/30 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-4xl text-primary animate-bounce">sensors</span>
                 </div>
                 <h2 className="font-headline text-2xl font-bold tracking-tight">Broadcast Starting Soon</h2>
                 <p className="text-outline text-sm mt-2 font-body">Wait for the curator to begin the transmission.</p>
               </div>
            </div>

            {/* Video Overlays */}
            <div className="relative z-10 flex justify-between p-6 bg-gradient-to-b from-black/60 to-transparent">
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
              
              <div className="flex items-center gap-3">
                 <div className="glass-card bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg flex items-center gap-3 border border-white/10">
                   <div className="w-8 h-8 rounded-full bg-surface overflow-hidden border border-outline/30"></div>
                   <div>
                     <h4 className="text-xs font-bold text-white">Sienna Velour</h4>
                     <p className="text-[10px] text-white/60">Midnight Editorial Shoot</p>
                   </div>
                 </div>
              </div>
            </div>

            {/* Video Controls Placeholder */}
            <div className="relative z-10 mt-auto p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <div className="flex justify-between items-center text-white">
                 <div className="flex gap-4">
                   <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">play_arrow</span></button>
                   <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">volume_up</span></button>
                   <span className="text-sm font-mono tracking-widest">00:14:02</span>
                 </div>
                 <div className="flex gap-4">
                   <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">settings</span></button>
                   <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">fullscreen</span></button>
                 </div>
               </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="flex flex-col">
              <h1 className="font-headline text-2xl font-bold tracking-tight">Midnight Editorial Shoot: Behind the Scenes</h1>
              <p className="text-sm text-outline mt-1 font-label uppercase tracking-widest">Exclusive to Midnight Elite Tier</p>
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
             <h3 className="font-headline font-bold">Live Chat</h3>
             <span className="material-symbols-outlined text-outline">more_horiz</span>
           </header>

           <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {[
                { u: "Nexus Arte", t: "The lighting setup is incredible.", c: "text-primary" },
                { u: "Void Walker", t: "Are those ARRI fixtures?", c: "text-tertiary" },
                { u: "Digital Nomad", t: "Loving the new aesthetic direction 🔥", c: "text-[#E2A4FF]" },
                { u: "Curator 99", t: "Will this be saved as VOD?", c: "text-outline" },
                { u: "Aiden Voss", t: "Just beautiful.", c: "text-secondary" }
              ].map((msg, i) => (
                <div key={i} className="text-sm font-body leading-snug">
                  <span className={`font-bold mr-2 ${msg.c}`}>{msg.u}</span>
                  <span className="text-on-surface-variant">{msg.t}</span>
                </div>
              ))}
              
              {/* Highlighted Tip Message */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 my-4">
                 <div className="flex justify-between items-center mb-1">
                   <span className="font-bold text-primary text-sm">Super Fan</span>
                   <span className="font-bold text-on-surface text-sm">$50.00</span>
                 </div>
                 <p className="text-on-surface text-sm font-body">Keep up the amazing work!</p>
              </div>
           </div>

           <footer className="p-4 bg-surface w-full border-t border-outline-variant/10">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Send a message..." 
                  className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-full px-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0 hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
              <div className="mt-3 flex justify-between items-center text-xs text-outline px-2">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">sentiment_satisfied</span></span>
                <span>Chat rules apply</span>
              </div>
           </footer>
        </aside>
      </main>
    </div>
  );
}
