import React from 'react';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { PostCard } from '@/components/cards/PostCard';
import Link from 'next/link';

export default function PostDetailsPage({ params }: { params: { id: string } }) {
  const postId = params.id;
  
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
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <SideNavBar />
      <TopNavBar />
      
      <main className="ml-64 mt-20 p-8 flex justify-center w-full max-w-7xl mx-auto">
        <div className="w-full max-w-3xl space-y-8">
          
          <Link href="/feed" className="inline-flex items-center gap-2 text-outline hover:text-on-surface transition-colors font-label uppercase tracking-widest text-xs">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Feed
          </Link>

          <PostCard {...mockPost} />

          {/* Comments Section */}
          <section className="bg-surface-container-high rounded-xl p-8 glass-card border border-outline-variant/10 shadow-xl">
            <h3 className="font-headline font-bold text-xl mb-6">Discussion ({mockPost.comments})</h3>
            
            {/* Comment Input */}
            <div className="flex gap-4 mb-8">
               <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0"></div>
               <div className="flex-1">
                 <textarea 
                   placeholder="Add to the discussion..." 
                   className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg p-4 text-sm font-body focus:outline-none focus:border-primary/50 transition-colors resize-none h-24"
                 />
                 <div className="flex justify-end mt-2">
                   <button className="brand-gradient px-6 py-2 rounded-full text-xs font-bold text-on-primary-container shadow-lg shadow-primary-container/20 hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-widest font-label">
                     Post Comment
                   </button>
                 </div>
               </div>
            </div>

            {/* Mock Comments List */}
            <div className="space-y-6">
              {[
                { name: "Nexus Arte", time: "1 hour ago", text: "This structural gradient aesthetic is incredible. Truly pushing the boundaries of the nocturnal vibe." },
                { name: "Digital Nomad", time: "45 minutes ago", text: "Incredible curation as always. Waiting for the next drop." },
                { name: "Void Walker", time: "12 minutes ago", text: "The use of contrasting shadows here defines the entire sequence." }
              ].map((comment, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-lg bg-surface-container-low/50 border border-outline-variant/5 hover:bg-surface-container-highest transition-colors">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline/10 flex-shrink-0"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-on-surface">{comment.name}</span>
                      <span className="text-xs text-outline">{comment.time}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant font-body">{comment.text}</p>
                    
                    <div className="flex gap-4 mt-3">
                      <button className="flex items-center gap-1 text-xs text-outline hover:text-tertiary transition-colors">
                        <span className="material-symbols-outlined text-sm">favorite</span>
                        <span>{24 - i * 5}</span>
                      </button>
                      <button className="flex items-center gap-1 text-xs text-outline hover:text-on-surface transition-colors">
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
