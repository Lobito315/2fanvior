"use client";

import React, { useState, useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    mediaUrl: '',
    mediaType: 'image' as 'image' | 'video' | 'audio',
    isLocked: false,
    price: 0,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      // Auto-detect type
      if (file.type.startsWith('image/')) setFormData(prev => ({ ...prev, mediaType: 'image' }));
      else if (file.type.startsWith('video/')) setFormData(prev => ({ ...prev, mediaType: 'video' }));
      else if (file.type.startsWith('audio/')) setFormData(prev => ({ ...prev, mediaType: 'audio' }));
    }
  };

  const uploadFileToR2 = async (file: File): Promise<string> => {
    // 1. Get presigned URL
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, contentType: file.type }),
    });

    if (!res.ok) {
      const errData = await res.json() as { error?: string };
      throw new Error(errData.error || 'Failed to get upload URL');
    }

    const { uploadUrl, publicUrl } = await res.json() as { uploadUrl: string; publicUrl: string };

    // 2. Upload file directly to R2
    // We use XMLHttpRequest to track progress
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(publicUrl);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      let finalMediaUrl = formData.mediaUrl;

      // If user selected a file, upload it first
      if (mediaFile) {
        finalMediaUrl = await uploadFileToR2(mediaFile);
      }

      const payload = { ...formData, mediaUrl: finalMediaUrl };
      const validation = postSchema.safeParse(payload);
      
      if (!validation.success) {
        throw new Error(validation.error.issues[0].message);
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || 'Failed to create post');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
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

              {/* Media Upload Area */}
              <div className="space-y-2">
                <label className="font-label text-xs font-bold uppercase tracking-widest text-outline ml-1">Media File</label>
                
                <div 
                  className={`w-full border-2 border-dashed rounded-xl p-8 text-center transition-all ${mediaFile ? 'border-primary bg-primary/5' : 'border-outline/20 bg-surface-container-lowest hover:border-primary/50'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*,video/*,audio/*"
                    onChange={handleFileChange}
                  />
                  
                  {mediaFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-primary">check_circle</span>
                      <p className="font-bold text-on-surface">{mediaFile.name}</p>
                      <p className="text-xs text-outline">{(mediaFile.size / 1024 / 1024).toFixed(2)} MB • Click to change</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 cursor-pointer">
                      <span className="material-symbols-outlined text-4xl text-outline mb-2">cloud_upload</span>
                      <p className="font-bold text-on-surface">Click to upload or drag and drop</p>
                      <p className="text-xs text-outline">Images, Videos, or Audio (Processed via Edge R2)</p>
                    </div>
                  )}
                </div>

                {!mediaFile && (
                  <div className="mt-4 space-y-2">
                    <p className="font-label text-xs uppercase tracking-widest text-outline text-center mt-4 mb-2">OR USE EXISTING URL</p>
                    <Input
                      placeholder="https://imgur.com/..."
                      value={formData.mediaUrl}
                      onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                    />
                  </div>
                )}
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

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-outline uppercase tracking-widest">
                  <span>Uploading to R2...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}

            <Button type="submit" variant="gradient" fullWidth className="h-14 text-lg" disabled={loading}>
              {loading ? "Processing..." : "Publish to Feed"}
              {!loading && <span className="material-symbols-outlined ml-2">send</span>}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
