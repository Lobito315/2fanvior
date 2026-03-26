"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      console.log('SignIn Response:', res);
      setLoading(false);
      
      if (res?.error) {
        setError(res.error === 'CredentialsSignin' ? 'Invalid email or password.' : res.error);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 lg:px-8 bg-surface overflow-hidden">
      {/* Background Layer with Editorial Imagery */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-container-lowest to-surface"></div>
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBulOk-c4myMV29MCefB1wQrthrOwxnR4Ovzp_xg_O1Cf6H6cWT7UQ6QWxjuw-YWlly2Qj6G_rN4XdArX5AZkCepr-kg8zQXWupg7h8zhrg3dr9rQGJRdeFim_mFkbCxCr9WMzySdeEANSGdZkFoCc7rz46tUP2P_gOjpHlmULTtG6Jts7odQ2afHumv3J5cf2GYolf7BvNgVSGRyAdVb3P4CoaXNq1pGchTufLDbbM27-_6VEPqizjhrcunLZMo8BBpEbpZVjO7ej9" 
            alt="Abstract minimalist architectural void" 
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-tertiary-container/10 rounded-full blur-[150px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[480px] space-y-8">
        {/* Identity Header */}
        <div className="text-center space-y-4">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tighter">
            Fanvior
          </h1>
          <p className="font-body text-outline text-lg tracking-tight">Enter the sanctuary of rare aesthetics.</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-10 rounded-lg shadow-2xl space-y-8 border border-outline-variant/10">
          
          {/* Social Auth Cluster */}
          <div className="grid grid-cols-1 gap-4">
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="flex items-center justify-center gap-3 w-full h-14 rounded-full bg-surface-container-lowest text-on-surface font-medium hover:bg-surface-bright transition-all duration-300 border border-outline/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"></path>
              </svg>
              <span className="font-body text-sm tracking-wide">Sign in with Google</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline/10"></div>
            </div>
            <span className="relative bg-[#292931] px-4 text-xs font-label uppercase tracking-[0.2em] text-outline/60">OR</span>
          </div>

          {/* Email Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <Input 
              label="Identity" 
              type="email" 
              placeholder="email@address.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="space-y-2">
              <div className="flex justify-between items-end mb-1">
                <label className="font-label text-xs font-bold uppercase tracking-widest text-outline ml-1">Passkey</label>
                <Link href="/reset" className="text-[11px] font-body text-primary/70 hover:text-primary transition-colors tracking-tight">Forgot Password?</Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <Button type="submit" variant="gradient" fullWidth className="h-16 text-lg mt-4 group" disabled={loading}>
              {loading ? "Authenticating..." : "Access Vault"}
              {!loading && <span className="material-symbols-outlined ml-2 text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>}
            </Button>
          </form>

          <div className="pt-2 text-center">
            <p className="font-body text-sm text-outline">
              New to the curation? 
              <Link href="/register" className="text-tertiary font-semibold hover:underline decoration-tertiary/30 underline-offset-4 ml-1">Join the Collective</Link>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-label uppercase tracking-widest text-outline/40">
          <a href="#" className="hover:text-outline transition-colors">Privacy Protocol</a>
          <a href="#" className="hover:text-outline transition-colors">Curatorial Terms</a>
          <a href="#" className="hover:text-outline transition-colors">Digital Integrity</a>
        </div>
      </main>
    </div>
  );
}
