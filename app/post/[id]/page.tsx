import React from 'react';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { PostCard } from '@/components/cards/PostCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default async function PostDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params;
  
  // Mock data for the post matching the Feed page aesthetic
  const mockPost = {
    creatorName: "Sienna Velour",
    creatorHandle: "@siennavelour",
    creatorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHAlaRdiimN0kwhN49DkYsCYawwy-MT7hiqRvoMlNcg31IOixdrxh4oKSluhuLjEDfNjDID8uOXye-GJ3OtCE_YFobKYjWbEwf8IUNvTKHxi9RdZqpSwLS7HcRWFAVFk9iuvLP55v-99cqVgFtS0Kv5LToYVvDdwoaDV9Jk5GgZDt4NagagCUXphoMUvOwjSNvH-Fbi5gjpd9YnSoOjsSAXzU42F1fdCapbPGKvjfraxfi4er3r4oCSx5bQiuYePECUbOn1xTqtd90",
    timeAgo: "2 hours ago",
    content: "Midnight reverie logic sequence #04. Testing new structural gradients.",
    mediaUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0KHFbrexzHEto9QwrXpVxQbX_jN6wlcWhcYHgjWskxxeFgEqFnCDMSfG2WGZk0xH9AP36wVjA5QJR8fV1xQSCYQlt-Anx6e4R8IqqY0npQDGQSpVjmKdIN7uhMEScyGwuLdrH5S0QS_Plzz6g7FUXazsFYGrMniaj3BoH1vrkxytFpIYErDM94MX2osaoMBb-E4PKEU67mjmw0o6K9LoLL3PMLTKdnt5jQ3a1NS3fJWtnwEkPCzyOP67n30bRPVNnhJsyY7zlTPtB",
    isLocked: false,
    likes: 4242,
    comments: 134,
    tips: "$240",
    postId: postId,
    price: 0,
    creatorId: "mock-creator-id",
    hasAccess: true,
  };

  return (
    <div className="bg-bg-main text-text-primary min-h-screen">
      <SideNavBar />
      <TopNavBar />
      
      <main className="ml-64 mt-20 p-10 flex justify-center w-full max-w-[1600px] mx-auto">
        <div className="w-full max-w-4xl space-y-10">
          
          <Link href="/feed" className="inline-flex items-center gap-3 text-text-muted hover:text-brand-secondary transition-all font-black uppercase tracking-[0.2em] text-[10px] group">
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Return to Collective
          </Link>

          <PostCard 
            {...mockPost} 
            onDelete={() => window.location.href = '/feed'}
          />

          {/* Comments Section */}
          <section className="bg-surface rounded-3xl p-10 border border-border-subtle/30 shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 brand-gradient opacity-5 blur-[100px] pointer-events-none"></div>
            <h3 className="font-headline font-black text-xl mb-10 tracking-tight uppercase">Connection Points ({mockPost.comments})</h3>
            
            {/* Comment Input */}
            <div className="flex gap-6 mb-12 group">
               <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex-shrink-0 border border-brand-primary/20 flex items-center justify-center">
                 <span className="material-symbols-outlined text-brand-primary">person</span>
               </div>
               <div className="flex-1">
                 <textarea 
                   placeholder="Inject data into the connection..." 
                   className="w-full bg-bg-secondary/50 border border-border-subtle/30 rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-bg-secondary transition-all resize-none h-32 placeholder:text-text-muted/40 text-text-primary"
                 />
                 <div className="flex justify-end mt-4">
                   <Button variant="primary">
                     Transmit Data
                   </Button>
                 </div>
               </div>
            </div>

            {/* Mock Comments List */}
            <div className="space-y-8">
              {[
                { name: "Nexus Arte", handle: "@nexus", time: "1h ago", text: "This structural gradient aesthetic is incredible. Truly pushing the boundaries of the nocturnal vibe." },
                { name: "Digital Nomad", handle: "@nomad", time: "45m ago", text: "Incredible curation as always. Waiting for the next drop." },
                { name: "Void Walker", handle: "@void", time: "12m ago", text: "The use of contrasting shadows here defines the entire sequence." }
              ].map((comment, i) => (
                <div key={i} className="flex gap-5 p-6 rounded-2xl bg-bg-secondary/30 border border-border-subtle/10 hover:border-brand-primary/30 hover:bg-bg-secondary/50 transition-all duration-300 group/comment">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-border-subtle flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-text-muted/50">account_circle</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2">
                         <span className="font-black text-xs text-text-primary uppercase tracking-tight group-hover/comment:text-brand-secondary transition-colors">{comment.name}</span>
                         <span className="text-[9px] text-text-muted font-bold opacity-60 uppercase">{comment.handle}</span>
                       </div>
                       <span className="text-[9px] text-text-muted font-black uppercase tracking-widest">{comment.time}</span>
                    </div>
                    <p className="text-sm text-text-secondary font-medium leading-relaxed mb-4">{comment.text}</p>
                    
                    <div className="flex gap-6">
                      <button className="flex items-center gap-2 text-[10px] font-black text-text-muted hover:text-status-error transition-colors uppercase tracking-widest group/like">
                        <span className="material-symbols-outlined text-base group-hover/like:scale-110 transition-transform">favorite</span>
                        <span className="tabular-nums">{24 - i * 5}</span>
                      </button>
                      <button className="flex items-center gap-2 text-[10px] font-black text-text-muted hover:text-brand-primary transition-colors uppercase tracking-widest">
                         Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
