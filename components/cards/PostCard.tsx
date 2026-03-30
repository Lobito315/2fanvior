"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PayPalUnlockButton } from '@/components/payments/PayPalUnlockButton';

interface PostCardProps {
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  timeAgo: string;
  mediaUrl?: string;
  mediaType?: string;
  description?: string;
  content?: string;
  isLocked: boolean;
  likes: number;
  comments: number;
  tips: string;
  postId: string;
  price: number;
}

export function PostCard({ 
  creatorName, 
  creatorHandle, 
  creatorAvatar, 
  timeAgo, 
  mediaUrl, 
  mediaType,
  description,
  content, 
  isLocked, 
  likes, 
  comments, 
  tips,
  postId,
  price
}: PostCardProps) {
  const [isUnlockedLocally, setIsUnlockedLocally] = useState(false);
  const showLocked = isLocked && !isUnlockedLocally;
  return (
    <article className="bg-surface-container-high rounded-xl overflow-hidden glass-card shadow-xl border border-outline-variant/10">
      {/* Post Header */}
      <div className="p-6 flex items-center justify-between border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden relative border border-outline-variant/20">
            <Image src={creatorAvatar} alt={creatorName} fill className="object-cover" sizes="48px" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-on-surface flex items-center gap-1">
              {creatorName}
              <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </h3>
            <p className="text-xs text-outline font-label uppercase tracking-widest mt-1">{timeAgo}</p>
          </div>
        </div>
        <button className="text-outline hover:text-on-surface transition-colors p-2">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      {/* Post Content */}
      <div className="p-6">
        {description && <p className="text-on-surface-variant text-sm font-body leading-relaxed mb-2 font-bold">{description}</p>}
        {content && <p className="text-on-surface-variant text-sm font-body leading-relaxed mb-6">{content}</p>}
        
        {mediaUrl && !showLocked && (
          <div className="relative w-full rounded-lg overflow-hidden border border-outline-variant/10 mb-6 bg-black flex items-center justify-center min-h-[200px]">
            {mediaType === 'video' ? (
              <video 
                src={mediaUrl} 
                className="w-full max-h-[700px] aspect-auto" 
                controls 
                playsInline
                preload="metadata"
              />
            ) : (
              <div className="relative w-full aspect-video">
                <Image 
                  src={mediaUrl} 
                  alt="Post content" 
                  fill 
                  className="object-contain" 
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )}
          </div>
        )}

        {showLocked && (
          <div className="relative w-full aspect-square md:aspect-video rounded-lg overflow-hidden mb-6 flex items-center justify-center border border-primary-container/30 bg-surface-container-low group">
            {mediaUrl && (
              <div className="absolute inset-0">
                {mediaType === 'video' ? (
                  <div className="w-full h-full bg-surface-container-highest flex items-center justify-center opacity-40 blur-md">
                     <span className="material-symbols-outlined text-6xl">videocam</span>
                  </div>
                ) : (
                  <Image src={mediaUrl} alt="Locked content preview" fill className="object-cover opacity-30 blur-md grayscale transition-all group-hover:blur-sm" />
                )}
              </div>
            )}
            <div className="relative z-10 flex flex-col items-center p-8 bg-surface-container-high/80 backdrop-blur-xl rounded-2xl border border-primary/20 shadow-2xl">
              <span className="material-symbols-outlined text-4xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <h4 className="font-headline font-bold text-on-surface text-lg mb-2">Premium Artifact</h4>
              <p className="text-xs text-outline font-label uppercase tracking-widest text-center mb-6">Unlock for ${price.toFixed(2)} to reveal curated content</p>
              
              <PayPalUnlockButton 
                postId={postId} 
                amount={price} 
                onSuccess={() => setIsUnlockedLocally(true)} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="bg-surface-container-lowest p-4 flex items-center justify-between border-t border-outline-variant/10">
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-container-highest transition-colors text-outline hover:text-tertiary">
            <span className="material-symbols-outlined text-lg">favorite</span>
            <span className="text-xs font-bold">{likes}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-container-highest transition-colors text-outline hover:text-on-surface">
            <span className="material-symbols-outlined text-lg">chat_bubble</span>
            <span className="text-xs font-bold">{comments}</span>
          </button>
        </div>
        
        <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary-container/10 text-primary border border-primary/20 hover:bg-primary-container/20 transition-colors">
          <span className="material-symbols-outlined text-lg">payments</span>
          <span className="text-xs font-bold font-label uppercase tracking-widest">Tip {tips}</span>
        </button>
      </div>
    </article>
  );
}
