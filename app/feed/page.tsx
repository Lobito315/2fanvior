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
  mediaType: string | null;
  isLocked: boolean;
  price: number;
  createdAt: string;
  creatorId: string;
  likes: number;
  comments: number;
  hasLiked: boolean;
  creator: {
    name: string;
    handle: string;
    avatar: string | null;
  };
  hasAccess?: boolean;
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
    <div className="bg-bg-main text-text-primary min-h-screen">
      <SideNavBar />
      <TopNavBar />
      
      <main className="ml-64 mt-20 p-10 flex justify-center w-full max-w-[1600px] mx-auto">
        
        <div className="w-full max-w-2xl space-y-8">
          {/* Post Creation CTA for Creators */}
          <div 
            onClick={() => router.push('/content/create')}
            className="bg-surface rounded-2xl p-8 border border-border-subtle/30 shadow-premium relative overflow-hidden cursor-pointer group hover:border-brand-primary/40 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-40 h-40 brand-gradient opacity-10 blur-[100px] pointer-events-none group-hover:opacity-20 transition-all duration-700"></div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center text-white shadow-glow-primary group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-2xl">add</span>
                </div>
                <div>
                  <h3 className="font-headline font-black text-xl text-text-primary tracking-tight group-hover:text-brand-secondary transition-colors">Publish New Artifact</h3>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-2 opacity-70">Share your latest creation with the collective</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-text-muted group-hover:text-brand-secondary group-hover:translate-x-2 transition-all duration-500">arrow_forward</span>
            </div>
          </div>

          {/* Feed Filter / Switcher */}
          <div className="flex items-center gap-8 border-b border-border-subtle/20 pb-4 ml-2">
            <button className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary border-b-2 border-brand-primary pb-4 -mb-[18px]">Curated For You</button>
            <button className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-text-primary transition-colors pb-4 -mb-[18px] opacity-60">Following</button>
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
                mediaType={post.mediaType || undefined}
                isLocked={post.isLocked}
                price={post.price}
                likes={post.likes || 0}
                hasLiked={post.hasLiked || false}
                comments={post.comments || 0}
                tips="$0"
                creatorId={post.creatorId}
                onDelete={(deletedId) => setPosts(prev => prev.filter(p => p.id !== deletedId))}
                hasAccess={post.hasAccess}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar (Suggest Creators) */}
        <aside className="hidden xl:block w-80 ml-16 sticky top-28 h-[calc(100vh-120px)] space-y-8">
           <div className="bg-surface p-8 rounded-3xl border border-border-subtle/30 shadow-premium relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-32 h-32 brand-gradient opacity-5 blur-3xl"></div>
             <h4 className="font-headline font-black text-sm text-text-primary mb-6 uppercase tracking-widest opacity-80">Trending Curators</h4>
             <div className="space-y-6">
                <div className="flex items-center gap-4 group/item cursor-pointer">
                  <div className="w-12 h-12 rounded-xl brand-gradient overflow-hidden border border-border-subtle/40 group-hover/item:scale-105 transition-transform duration-500"></div>
                  <div>
                    <h5 className="text-sm font-black text-text-primary group-hover/item:text-brand-secondary transition-colors uppercase tracking-tight">Digital Nomad</h5>
                    <p className="text-[9px] text-status-success font-black uppercase tracking-[0.2em] mt-1">Growth +24%</p>
                  </div>
                </div>
             </div>
           </div>

           <div className="text-[9px] font-black uppercase tracking-[0.25em] text-text-muted/30 leading-relaxed px-8">
             <p>© 2026 Fanvior — The Collective Memory</p>
             <div className="flex gap-4 mt-3">
               <a href="#" className="hover:text-brand-primary transition-colors">Privacy Prot</a>
               <a href="#" className="hover:text-brand-primary transition-colors">Terms of Ops</a>
             </div>
           </div>
        </aside>
      </main>
    </div>
  );
}
