"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { PostCard } from '@/components/cards/PostCard';
import Image from 'next/image';

interface Post {
  id: string;
  title: string | null;
  description: string | null;
  content: string | null;
  mediaUrl: string | null;
  isLocked: boolean;
  price: number;
  createdAt: string;
  creatorId: string;
  creator: {
    name: string;
    handle: string;
    avatar: string | null;
  };
}

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('Failed to fetch sequence');
      const data = await res.json() as Post[];
      setPosts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <SideNavBar />
      <TopNavBar />
      
      <main className="ml-64 mt-20 p-8 flex justify-center w-full max-w-7xl mx-auto">
        
        <div className="w-full max-w-2xl space-y-8">
          {/* Post Creation CTA for Creators */}
          <div 
            onClick={() => router.push('/content/create')}
            className="bg-surface-container-high rounded-xl p-6 glass-card border border-outline-variant/10 shadow-lg relative overflow-hidden cursor-pointer group hover:bg-surface-container-highest transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all"></div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full brand-gradient flex items-center justify-center text-on-primary-container shadow-lg">
                  <span className="material-symbols-outlined">add</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">Publish New Artifact</h3>
                  <p className="text-xs text-outline font-label uppercase tracking-widest">Share your latest creation with the collective</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_forward</span>
            </div>
          </div>

          {/* Feed Filter / Switcher */}
          <div className="flex items-center gap-6 border-b border-outline-variant/10 pb-4">
            <button className="text-sm font-bold text-primary border-b-2 border-primary pb-4 -mb-[17px]">Curated For You</button>
            <button className="text-sm font-bold text-outline hover:text-on-surface transition-colors pb-4 -mb-[17px]">Following</button>
          </div>

          {/* Feed List */}
          <div className="space-y-8 flex flex-col min-h-[400px]">
            {loading && (
              <div className="space-y-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-surface-container-high h-64 rounded-xl animate-pulse border border-outline/10"></div>
                ))}
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-10 text-center">
                <span className="material-symbols-outlined text-4xl text-red-400 mb-4">error</span>
                <p className="text-red-400 font-medium">{error}</p>
                <button onClick={fetchPosts} className="mt-4 text-xs font-bold uppercase tracking-widest text-primary hover:underline">Retry Fetch</button>
              </div>
            )}

            {!loading && !error && posts.length === 0 && (
              <div className="text-center p-20 glass-card rounded-xl border border-outline/10">
                <span className="material-symbols-outlined text-5xl text-outline mb-4">inventory_2</span>
                <p className="text-outline font-label uppercase tracking-widest">The void is currently empty</p>
              </div>
            )}

            {!loading && posts.map((post) => (
              <PostCard 
                key={post.id}
                postId={post.id}
                creatorName={post.creator.name}
                creatorHandle={post.creator.handle}
                creatorAvatar={post.creator.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDTUa1bH5L6O07C_R01xR_2PqS9CgI5O1q6P5D9mD9Z-q0uH1O88_oB-1qFw92I4E37TfS86v9Vq0jUqgH4R8L1rA1i_zZ3M0s4p1V7uFk8K9d3w5F9x-4H8qI0d4_6G1s_0J8S8rQ7B2g6c8v3wV5u6q_A5S8P4KkZ0xY4S-0iXzM0a12hK0c9J"}
                timeAgo="Just now"
                description={post.description || undefined}
                content={post.content || undefined}
                mediaUrl={post.mediaUrl || undefined}
                isLocked={post.isLocked}
                price={post.price}
                likes={0}
                comments={0}
                tips="$0"
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar (Suggest Creators) */}
        <aside className="hidden xl:block w-80 ml-12 sticky top-28 h-[calc(100vh-120px)] space-y-6">
           <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10">
             <h4 className="font-headline font-bold text-on-surface mb-4">Trending Curators</h4>
             <div className="space-y-4">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full brand-gradient overflow-hidden border border-outline/20"></div>
                  <div>
                    <h5 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Digital Nomad</h5>
                    <p className="text-[10px] text-outline font-label uppercase tracking-widest">Growth +24%</p>
                  </div>
                </div>
             </div>
           </div>

           <div className="text-[10px] font-label uppercase tracking-[0.2em] text-outline/40 leading-relaxed text-center">
             <p>© 2026 Fanvior</p>
             <div className="flex justify-center gap-3 mt-2">
               <a href="#" className="hover:text-outline transition-colors">Privacy</a>
               <a href="#" className="hover:text-outline transition-colors">Terms</a>
             </div>
           </div>
        </aside>
      </main>
    </div>
  );
}
