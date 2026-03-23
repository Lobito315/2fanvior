"use client";

import React from 'react';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { PostCard } from '@/components/cards/PostCard';
import Image from 'next/image';

export default function FeedPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <SideNavBar />
      <TopNavBar />
      
      <main className="ml-64 mt-20 p-8 flex justify-center w-full max-w-7xl mx-auto">
        
        <div className="w-full max-w-2xl space-y-8">
          {/* Post Creation Input Container */}
          <div className="bg-surface-container-high rounded-xl p-6 glass-card border border-outline-variant/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-outline-variant/20 relative">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTUa1bH5L6O07C_R01xR_2PqS9CgI5O1q6P5D9mD9Z-q0uH1O88_oB-1qFw92I4E37TfS86v9Vq0jUqgH4R8L1rA1i_zZ3M0s4p1V7uFk8K9d3w5F9x-4H8qI0d4_6G1s_0J8S8rQ7B2g6c8v3wV5u6q_A5S8P4KkZ0xY4S-0iXzM0a12hK0c9J" alt="Current User" fill sizes="48px" className="object-cover" />
              </div>
              <div className="flex-1">
                <textarea 
                  placeholder="Draft a new artifact or announcement..." 
                  className="w-full bg-transparent text-on-surface placeholder:text-outline font-body text-sm resize-none focus:outline-none min-h-[60px]"
                ></textarea>
                
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-outline-variant/10">
                  <div className="flex gap-2">
                    <button className="w-9 h-9 flex items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-xl">image</span>
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-xl">videocam</span>
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors relative group">
                      <span className="material-symbols-outlined text-xl">lock</span>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[10px] uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Paywall Content</span>
                    </button>
                  </div>
                  <button className="brand-gradient px-6 py-2 rounded-full text-xs font-bold text-on-primary-container shadow-lg shadow-primary-container/20 hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-widest font-label">
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Filter / Switcher */}
          <div className="flex items-center gap-6 border-b border-outline-variant/10 pb-4">
            <button className="text-sm font-bold text-primary border-b-2 border-primary pb-4 -mb-[17px]">Curated For You</button>
            <button className="text-sm font-bold text-outline hover:text-on-surface transition-colors pb-4 -mb-[17px]">Following</button>
            <button className="text-sm font-bold text-outline hover:text-on-surface transition-colors pb-4 -mb-[17px]">Trending Artifacts</button>
          </div>

          {/* Feed List */}
          <div className="space-y-8 flex flex-col">
            <PostCard 
              creatorName="Sienna Velour"
              creatorHandle="@siennavelour"
              creatorAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuBHAlaRdiimN0kwhN49DkYsCYawwy-MT7hiqRvoMlNcg31IOixdrxh4oKSluhuLjEDfNjDID8uOXye-GJ3OtCE_YFobKYjWbEwf8IUNvTKHxi9RdZqpSwLS7HcRWFAVFk9iuvLP55v-99cqVgFtS0Kv5LToYVvDdwoaDV9Jk5GgZDt4NagagCUXphoMUvOwjSNvH-Fbi5gjpd9YnSoOjsSAXzU42F1fdCapbPGKvjfraxfi4er3r4oCSx5bQiuYePECUbOn1xTqtd90"
              timeAgo="2 hours ago"
              content="Midnight reverie logic sequence #04. Testing new structural gradients."
              mediaUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuC0KHFbrexzHEto9QwrXpVxQbX_jN6wlcWhcYHgjWskxxeFgEqFnCDMSfG2WGZk0xH9AP36wVjA5QJR8fV1xQSCYQlt-Anx6e4R8IqqY0npQDGQSpVjmKdIN7uhMEScyGwuLdrH5S0QS_Plzz6g7FUXazsFYGrMniaj3BoH1vrkxytFpIYErDM94MX2osaoMBb-E4PKEU67mjmw0o6K9LoLL3PMLTKdnt5jQ3a1NS3fJWtnwEkPCzyOP67n30bRPVNnhJsyY7zlTPtB"
              isLocked={false}
              likes={4242}
              comments={134}
              tips="$240"
            />
            
            <PostCard 
              creatorName="Aiden Voss"
              creatorHandle="@voss_archive"
              creatorAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuBLRBUcN4Mia_YWqLd1aDEyvpQbDDZv1KSUaJSVT5kf1FSHZKOZ-ayiMdR0FQOPBJsmvE597jKEHx-PecQXXNpvZuz-TDBEgnqxcJ-5oiCBtIftYSFoFtYi3AlM90NVFB2E4kzXFlDiWnNaPuPc_vEXqF0eo0O-d4hzg7ZCbgqukklXN-THDchgsjPQhXLcQN35_-WIaQ_k8ZpKTypzSwO-_mEJDaUXBoWbu4VLZfEn0mHYp97s-J091dhzo8-ODf4Rto9KM0DlyjCC"
              timeAgo="5 hours ago"
              content="The complete breakdown of my latest editorial shoot. Only for subscribers."
              mediaUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuD_U9QO_qA1l_O5i5h7k3j3rX0Pq5Y3VwT_y3Fj-_S-vR3XkT_J2U-FvB8UoExFv5pB_X6bC7oA7vJ9nB8u_C7kQ2g9qN5qjF_P8oB3g9sQ2_U4vB4vX9rD3kY0T0lA4oQ9jM"
              isLocked={true}
              likes={1820}
              comments={89}
              tips="$50"
            />
          </div>
        </div>

        {/* Right Sidebar (Suggest Creators, Trending Stats) */}
        <aside className="hidden xl:block w-80 ml-12 sticky top-28 h-[calc(100vh-120px)] space-y-6">
           <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10">
             <h4 className="font-headline font-bold text-on-surface mb-4">Trending Curators</h4>
             <div className="space-y-4">
                {/* Simplified mini user card for right sidebar */}
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest overflow-hidden border border-outline/20"></div>
                  <div>
                    <h5 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Digital Nomad</h5>
                    <p className="text-[10px] text-outline font-label uppercase tracking-widest">Growth +24%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest overflow-hidden border border-outline/20"></div>
                  <div>
                    <h5 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Nexus Arte</h5>
                    <p className="text-[10px] text-outline font-label uppercase tracking-widest">Growth +18%</p>
                  </div>
                </div>
             </div>
           </div>

           <div className="text-[10px] font-label uppercase tracking-[0.2em] text-outline/40 leading-relaxed text-center">
             <p>© 2026 Fanvior</p>
             <div className="flex justify-center gap-3 mt-2">
               <a href="#" className="hover:text-outline transition-colors">Privacy</a>
               <a href="#" className="hover:text-outline transition-colors">Terms</a>
               <a href="#" className="hover:text-outline transition-colors">Support</a>
             </div>
           </div>
        </aside>
      </main>
    </div>
  );
}
