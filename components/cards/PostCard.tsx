"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { PayPalUnlockButton } from '@/components/payments/PayPalUnlockButton';
import { useSession } from 'next-auth/react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

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
  creatorId: string;
  onDelete?: (postId: string) => void;
  hasAccess?: boolean;
}

// --- Tip Modal ---
function TipModal({ postId, creatorId, onClose }: { postId: string; creatorId: string; onClose: () => void }) {
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
                      const res = await fetch('/api/payments?action=create-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ postId, recipientId: creatorId, amount: finalAmount, type: 'TIP' }),
                      });
                      const data = await res.json() as { orderId: string };
                      return data.orderId || '';
                    } catch (err) { console.error(err); return ''; }
                  }}
                  onApprove={async (data) => {
                    try {
                      const res = await fetch('/api/payments?action=capture-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: data.orderID, postId, recipientId: creatorId, amount: finalAmount?.toString(), type: 'TIP' }),
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
  price,
  creatorId,
  onDelete,
  hasAccess = false
}: PostCardProps) {
  const { data: session } = useSession();
  const [isUnlockedLocally, setIsUnlockedLocally] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [likePending, setLikePending] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(initialComments);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const showLocked = isLocked && !isUnlockedLocally;
  const canEdit = session?.user && ((session.user as any).id === creatorId || (session.user as any).role === 'ADMIN');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        onDelete?.(postId);
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting post');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDownload = async () => {
    if (!mediaUrl) return;
    try {
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from URL or use a default
      const filename = mediaUrl.split('/').pop()?.split('?')[0] || `fanvior-artifact-${postId}`;
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      // Fallback: just open in new tab if blob fetch fails (e.g., CORS)
      window.open(mediaUrl, '_blank');
    }
  };

  return (
    <>
      {showTipModal && <TipModal postId={postId} creatorId={creatorId} onClose={() => setShowTipModal(false)} />}

      <article className="bg-surface rounded-2xl overflow-hidden shadow-premium border border-border-subtle/30 group hover:border-brand-primary/30 transition-all duration-500">
        {/* Post Header */}
        <div className="p-8 flex items-center justify-between border-b border-border-subtle/20">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl overflow-hidden relative border border-border-subtle group-hover:ring-2 group-hover:ring-brand-primary/30 transition-all duration-500">
              <Image src={creatorAvatar} alt={creatorName} fill className="object-cover" sizes="56px" />
            </div>
            <div>
              <h3 className="font-headline font-black text-text-primary text-base flex items-center gap-2 tracking-tight group-hover:text-brand-secondary transition-colors uppercase">
                {creatorName}
                <span className="material-symbols-outlined text-sm text-brand-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </h3>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-1.5 opacity-60">{timeAgo}</p>
            </div>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className={`text-text-muted hover:text-text-primary transition-all p-2.5 rounded-xl ${showDropdown ? 'bg-surface-light text-text-primary' : 'hover:bg-surface-light/50'}`}
            >
              <span className="material-symbols-outlined text-2xl">more_vert</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-surface border border-border-subtle/40 rounded-2xl shadow-3xl z-50 overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
                <div className="py-2">
                  <button className="w-full px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-text-secondary hover:bg-surface-light hover:text-text-primary flex items-center gap-4 transition-all">
                    <span className="material-symbols-outlined text-xl">share</span>
                    Share Artifact
                  </button>
                  <button className="w-full px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-text-secondary hover:bg-surface-light hover:text-text-primary flex items-center gap-4 transition-all">
                    <span className="material-symbols-outlined text-xl">report</span>
                    Report Content
                  </button>
                  
                  {hasAccess && mediaUrl && (
                    <button 
                      onClick={() => { setShowDropdown(false); handleDownload(); }}
                      className="w-full px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-brand-secondary hover:bg-brand-secondary/10 flex items-center gap-4 transition-all"
                    >
                      <span className="material-symbols-outlined text-xl">download</span>
                      Download
                    </button>
                  )}
                  
                  {canEdit && (
                    <>
                      <div className="h-[1px] bg-border-subtle/20 my-2 mx-4" />
                      <button 
                        onClick={() => { setShowDropdown(false); setShowDeleteConfirm(true); }}
                        className="w-full px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-status-error hover:bg-status-error/10 flex items-center gap-4 transition-all"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                        Expunge
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal 
          isOpen={showDeleteConfirm} 
          onClose={() => setShowDeleteConfirm(false)}
          title="Delete Artifact?"
        >
          <div className="space-y-6">
            <p className="text-on-surface-variant text-sm leading-relaxed">
              This action is permanent and cannot be undone. All data associated with this artifact—including likes, comments, and metrics—will be expunged from the collective memory.
            </p>
            
            <div className="flex gap-3 justify-end pt-2">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2.5 rounded-full text-xs font-bold font-label uppercase tracking-widest text-outline hover:bg-surface-container-highest transition-all"
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-2.5 rounded-full text-xs font-bold font-label uppercase tracking-widest bg-error text-on-error shadow-lg shadow-error/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-on-error/30 border-t-on-error rounded-full animate-spin" />
                    Expunging...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </Modal>

        {/* Post Content */}
        <div className="p-8">
          {description && <p className="text-text-primary text-sm font-bold leading-relaxed mb-4 tracking-tight">{description}</p>}
          {content && <p className="text-text-secondary text-sm font-medium leading-loose mb-8 opacity-80 font-body">{content}</p>}

          {mediaUrl && !showLocked && (
            <div className="relative w-full rounded-2xl overflow-hidden border border-border-subtle/30 mb-8 bg-bg-main shadow-premium">
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
            <div className="relative w-full aspect-square md:aspect-video rounded-2xl overflow-hidden mb-8 flex items-center justify-center border border-brand-primary/20 bg-bg-main group/lock">
              {mediaUrl && (
                <div className="absolute inset-0">
                  {mediaType === 'video' ? (
                    <div className="w-full h-full bg-bg-secondary flex items-center justify-center opacity-30 blur-2xl font-body">
                      <span className="material-symbols-outlined text-8xl">videocam</span>
                    </div>
                  ) : (
                    <Image src={mediaUrl} alt="Locked artifact" fill className="object-cover opacity-20 blur-2xl grayscale transition-all group-hover/lock:opacity-30 group-hover/lock:blur-xl" />
                  )}
                </div>
              )}
              <div className="relative z-10 flex flex-col items-center p-10 bg-surface/90 backdrop-blur-2xl rounded-3xl border border-brand-primary/30 shadow-3xl text-center max-w-sm">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6 ring-4 ring-brand-primary/5">
                  <span className="material-symbols-outlined text-3xl text-brand-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <h4 className="font-headline font-black text-text-primary text-xl mb-3 tracking-tight uppercase">Premium Artifact</h4>
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.25em] mb-8 leading-relaxed">
                  Support the curator with ${price.toFixed(2)} to unlock high-fidelity data
                </p>
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
        <div className="bg-bg-secondary/40 px-6 py-4 flex items-center justify-between border-t border-border-subtle/20">
          <div className="flex gap-2">
            {/* Like button */}
            <button
              onClick={handleLike}
              disabled={likePending}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-300 group/btn ${
                hasLiked
                  ? 'text-status-error bg-status-error/10 hover:bg-status-error/20'
                  : 'text-text-muted hover:bg-surface-light/50 hover:text-status-error'
              }`}
            >
              <span
                className="material-symbols-outlined text-xl transition-transform duration-300 group-active/btn:scale-150"
                style={{ fontVariationSettings: hasLiked ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              <span className="text-xs font-black tabular-nums tracking-wider">{likeCount}</span>
            </button>

            {/* Comment button */}
            <button
              onClick={() => setShowComments(v => !v)}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-300 ${
                showComments
                  ? 'text-brand-secondary bg-brand-secondary/10'
                  : 'text-text-muted hover:bg-surface-light/50 hover:text-text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-xl">chat_bubble</span>
              <span className="text-xs font-black tabular-nums tracking-wider">{commentCount}</span>
            </button>
          </div>

          {/* Tip button */}
          <button
            onClick={() => setShowTipModal(true)}
            className="flex items-center gap-3 px-6 py-2.5 rounded-xl bg-brand-primary text-white shadow-glow-primary hover:scale-105 active:scale-95 transition-all duration-300 font-black text-[10px] uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-lg">payments</span>
            Tip Creator
          </button>
        </div>

        {showComments && (
          <CommentSection
            postId={postId}
            initialCount={commentCount}
          />
        )}
      </article>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)}
        title="Expunge Artifact?"
      >
        <div className="space-y-8">
          <p className="text-text-secondary text-sm leading-relaxed opacity-80 font-medium">
            This action is permanent. All associated engagement metrics, connection points, and content will be irreversibly removed from the collective.
          </p>
          
          <div className="flex gap-4 justify-end">
            <button 
              onClick={() => setShowDeleteConfirm(false)}
              className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-surface-light transition-all"
              disabled={deleting}
            >
              Cancel
            </button>
            <Button 
              onClick={handleDelete}
              disabled={deleting}
              variant="primary"
              className="bg-status-error hover:bg-status-error/90 shadow-none hover:shadow-glow-error"
            >
              {deleting ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Expunging...
                </>
              ) : (
                'Confirm Expunge'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
