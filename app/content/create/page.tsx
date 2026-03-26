"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  content: z.string().optional(),
  mediaUrl: z.string().url("Must be a valid URL").or(z.literal('')),
  mediaType: z.enum(['image', 'video', 'audio']).default('image'),
  isLocked: z.boolean().default(false),
  price: z.number().nonnegative().default(0),
});

export default function CreateContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    mediaUrl: '',
    mediaType: 'image' as 'image' | 'video' | 'audio',
    isLocked: false,
    price: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validation = postSchema.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || 'Failed to create post');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <SideNavBar />
      <TopNavBar />

      <main className="ml-64 mt-16 p-8">
        <div className="max-w-2xl mx-auto">
          <header className="mb-10">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
              Unleash <span className="text-primary text-shadow shadow-primary/20">New Content</span>
            </h1>
            <p className="text-outline mt-2">Publish your latest editorial or digital assets to your collective.</p>
          </header>

          <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl border border-outline-variant/10 space-y-6">
            <div className="space-y-4">
              <Input
                label="Post Title"
                placeholder="The Night Void"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <div className="space-y-2">
                <label className="font-label text-xs font-bold uppercase tracking-widest text-outline ml-1">Description</label>
                <textarea
                  className="w-full bg-surface-container-lowest text-on-surface border border-outline/20 rounded-xl p-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none min-h-[100px] transition-all"
                  placeholder="Tell the story behind this piece..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label text-xs font-bold uppercase tracking-widest text-outline ml-1">Media URL</label>
                  <Input
                    placeholder="https://imgur.com/..."
                    value={formData.mediaUrl}
                    onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-xs font-bold uppercase tracking-widest text-outline ml-1">Type</label>
                  <select
                    className="w-full h-14 bg-surface-container-lowest text-on-surface border border-outline/20 rounded-xl px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    value={formData.mediaType}
                    onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as any })}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-outline/10">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isLocked"
                    className="w-5 h-5 rounded border-none bg-surface-container-lowest text-primary focus:ring-0 transition-colors cursor-pointer"
                    checked={formData.isLocked}
                    onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })}
                  />
                  <label htmlFor="isLocked" className="text-sm font-medium text-on-surface cursor-pointer">Lock Content (Premium)</label>
                </div>

                {formData.isLocked && (
                  <div className="flex-1 max-w-[150px]">
                    <Input
                      label="Price ($)"
                      type="number"
                      placeholder="5.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <Button type="submit" variant="gradient" fullWidth className="h-14 text-lg" disabled={loading}>
              {loading ? "Publishing..." : "Publish to Feed"}
              {!loading && <span className="material-symbols-outlined ml-2">send</span>}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
