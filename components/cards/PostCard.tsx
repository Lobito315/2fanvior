"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { PayPalUnlockButton } from '@/components/payments/PayPalUnlockButton';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string; handle: string; avatar: string | null };
}

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
  hasLiked?: boolean;
  comments: number;
  tips: string;
  postId: string;
  price: number;
}

// --- Tip Modal ---
function TipModal({ postId, onClose }: { postId: string; onClose: () => void }) {
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [{ isPending }] = usePayPalScriptReducer();

  const quickAmounts = [5, 10, 20];
  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-8 w-full max-w-sm shadow-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {sent ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <h3 className="font-headline font-bold text-xl text-on-surface">¡Propina Enviada!</h3>
            <p className="text-outline text-sm text-center">Tu apoyo significa mucho para el creador.</p>
            <button onClick={onClose} className="mt-2 px-6 py-2 rounded-full bg-primary text-on-primary text-sm font-bold">Cerrar</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline font-bold text-lg text-on-surface">Enviar Propina 💸</h3>
              <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Quick amounts */}
            <div className="flex gap-3 mb-4">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${
                    selectedAmount === amt && !customAmount
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-outline/20 text-outline hover:border-primary/50 hover:text-on-surface'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-bold">$</span>
              <input
                type="number"
                min="1"
                placeholder="Otro monto..."
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                className="w-full pl-8 pr-4 py-3 bg-surface-container-lowest border border-outline/20 rounded-xl text-on-surface focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
            </div>

            {finalAmount && finalAmount > 0 ? (
              isPending ? (
                <div className="h-12 w-full bg-surface-container-highest animate-pulse rounded-full" />
              ) : (
                <PayPalButtons
                  style={{ layout: "horizontal", height: 48, label: "pay", shape: "pill" }}
                  createOrder={async () => {
                    try {
                      const res = await fetch('/api/payments/create-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ postId, amount: finalAmount, type: 'TIP' }),
                      });
                      const data = await res.json() as { orderId: string };
                      return data.orderId || '';
                    } catch (err) { console.error(err); return ''; }
                  }}
                  onApprove={async (data) => {
                    try {
                      const res = await fetch('/api/payments/capture-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: data.orderID, postId, amount: finalAmount?.toString(), type: 'TIP' }),
                      });
                      const result = await res.json() as { success: boolean };
                      if (result.success) setSent(true);
                    } catch (err) { console.error(err); }
                  }}
                />
              )
            ) : (
              <div className="h-12 w-full flex items-center justify-center rounded-full bg-surface-container-highest border border-outline/10 text-outline text-sm">
                Elige o ingresa un monto para continuar
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// --- Comment Section ---
function CommentSection({ postId, initialCount }: { postId: string; initialCount: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then(r => r.json() as Promise<Comment[]>)
      .then(data => { setComments(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        const comment = await res.json() as Comment;
        setComments(prev => [...prev, comment]);
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-outline-variant/10 px-6 py-4 bg-surface-container-lowest/50">
      {/* Comments list */}
      <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-1">
        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => <div key={i} className="h-10 bg-surface-container-high animate-pulse rounded-xl" />)}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-outline text-xs font-label uppercase tracking-widest py-4">
            Sé el primero en comentar
          </p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-3 items-start">
              {comment.user.avatar ? (
                <div className="w-8 h-8 rounded-full overflow-hidden relative flex-shrink-0 border border-outline-variant/20">
                  <Image src={comment.user.avatar} alt={comment.user.name} fill className="object-cover" sizes="32px" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full flex-shrink-0 bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{comment.user.name[0]}</span>
                </div>
              )}
              <div className="flex-1 bg-surface-container-high rounded-xl px-4 py-2">
                <span className="font-bold text-xs text-primary mr-2">{comment.user.name}</span>
                <span className="text-sm text-on-surface-variant">{comment.content}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New comment input */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <textarea
          ref={inputRef}
          rows={1}
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }}
          className="flex-1 bg-surface-container-high border border-outline/20 rounded-xl px-4 py-3 text-sm text-on-surface resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
        />
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="p-3 rounded-full bg-primary text-on-primary disabled:opacity-40 hover:bg-primary/90 transition-all flex-shrink-0"
        >
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </form>
    </div>
  );
}

// --- Main PostCard ---
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
  likes: initialLikes,
  hasLiked: initialHasLiked = false,
  comments: initialComments,
  tips,
  postId,
  price
}: PostCardProps) {
  const [isUnlockedLocally, setIsUnlockedLocally] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [likePending, setLikePending] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(initialComments);
  const [showTipModal, setShowTipModal] = useState(false);
  const showLocked = isLocked && !isUnlockedLocally;

  const handleLike = async () => {
    if (likePending) return;
    setLikePending(true);

    // Optimistic update
    const newHasLiked = !hasLiked;
    setHasLiked(newHasLiked);
    setLikeCount(prev => newHasLiked ? prev + 1 : prev - 1);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json() as { liked: boolean };
      setHasLiked(data.liked);
      setLikeCount(prev => {
        // correct if server disagrees
        if (data.liked !== newHasLiked) return data.liked ? prev + 1 : prev - 1;
        return prev;
      });
    } catch {
      // Revert on error
      setHasLiked(!newHasLiked);
      setLikeCount(prev => newHasLiked ? prev - 1 : prev + 1);
    } finally {
      setLikePending(false);
    }
  };

  return (
    <>
      {showTipModal && <TipModal postId={postId} onClose={() => setShowTipModal(false)} />}

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
        <div className="bg-surface-container-lowest px-4 py-3 flex items-center justify-between border-t border-outline-variant/10">
          <div className="flex gap-1">
            {/* Like button */}
            <button
              onClick={handleLike}
              disabled={likePending}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                hasLiked
                  ? 'text-red-400 bg-red-400/10 hover:bg-red-400/20'
                  : 'text-outline hover:bg-surface-container-highest hover:text-red-400'
              }`}
            >
              <span
                className="material-symbols-outlined text-lg transition-transform duration-150 active:scale-125"
                style={{ fontVariationSettings: hasLiked ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              <span className="text-xs font-bold tabular-nums">{likeCount}</span>
            </button>

            {/* Comment button */}
            <button
              onClick={() => setShowComments(v => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                showComments
                  ? 'text-primary bg-primary/10'
                  : 'text-outline hover:bg-surface-container-highest hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-lg">chat_bubble</span>
              <span className="text-xs font-bold tabular-nums">{commentCount}</span>
            </button>
          </div>

          {/* Tip button */}
          <button
            onClick={() => setShowTipModal(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary-container/10 text-primary border border-primary/20 hover:bg-primary-container/20 hover:scale-105 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-lg">payments</span>
            <span className="text-xs font-bold font-label uppercase tracking-widest">Tip</span>
          </button>
        </div>

        {/* Expandable comments */}
        {showComments && (
          <CommentSection
            postId={postId}
            initialCount={commentCount}
          />
        )}
      </article>
    </>
  );
}
