"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ResetPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-6 bg-surface overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-container/10 blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-tertiary-container/5 blur-[120px]"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full max-w-[900px]">
        {/* Header / Logo Area */}
        <div className="mb-12 text-center">
          <h1 className="font-headline text-3xl font-black tracking-tighter text-primary mb-2">Fanvior</h1>
          <p className="font-label text-xs uppercase tracking-[0.2em] text-outline">Digital Archives & Editorial</p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-xl glass-card border border-white/5 shadow-2xl">
          {/* Left Side: Interactive Forms */}
          <div className="p-10 lg:p-14 bg-surface-container-highest/20">
            {!success ? (
              <section id="reset-screen">
                <header className="mb-10">
                  <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-3">Restore Access</h2>
                  <p className="text-on-surface-variant leading-relaxed">Enter the email associated with your account and we'll send a secure link to reset your password.</p>
                </header>

                <form className="space-y-6" onSubmit={handleReset}>
                  <Input 
                    label="Email Address" 
                    icon="mail" 
                    placeholder="curator@midnight.com" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                  
                  <Button type="submit" variant="gradient" fullWidth className="py-4 gap-3">
                    Send Reset Link
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </Button>
                </form>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                  <Link href="/login" className="font-label text-xs font-bold uppercase tracking-widest text-outline hover:text-primary transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                    Back to Login
                  </Link>
                </div>
              </section>
            ) : (
              <section id="success-screen" className="text-center py-4">
                <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-container/10 text-primary-container ring-1 ring-primary-container/30">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
                </div>
                
                <header className="mb-8">
                  <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-3">Check Your Email</h2>
                  <p className="text-on-surface-variant leading-relaxed">We've sent a recovery link to your inbox. It will expire in 15 minutes for security.</p>
                </header>
                
                <div className="p-6 bg-surface-container-lowest rounded-xl mb-10 text-left border border-white/5">
                  <p className="text-xs text-outline leading-relaxed">
                    <span className="font-bold text-on-surface block mb-1">Didn't receive it?</span>
                    Check your spam folder or wait a moment. Sometimes the midnight delivery takes a little longer.
                  </p>
                </div>
                
                <Button 
                  variant="secondary" 
                  fullWidth 
                  className="mb-6"
                  onClick={() => setSuccess(false)}
                >
                  Resend Email
                </Button>
                
                <Link href="/login" className="font-label text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-fixed transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to Login
                </Link>
              </section>
            )}
          </div>

          {/* Right Side: Editorial Visual */}
          <div className="relative hidden md:block overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb2P_4AxPl_kK10652t37iwzKhl1RCjW8IdlgQBQvlYNhLsi9et6BorD3lIQairCnJMK2OgCHjjCnwsoGOTvcjDzL4W7DhSLctltwEdOh5-mhNj49KpzsaKpqDfFiUstYU2XKy7fmLffoEO0ReiXmO727jLral6ccEX6FZK0eGBjIfUHRNyPcGRyLgGGcaZrCZQCkYF-990Yomcghm-oPToe5310kbgEMYNFwL-DbM4yT8EpdB_zeA_XRB4bKOhrpBuqPFGvUBm064" 
              alt="Abstract deep purple and black smoke patterns" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-12 w-full">
              <div className="space-y-4">
                <div className="h-1 w-12 bg-primary-container rounded-full"></div>
                <h3 className="font-headline text-2xl font-bold text-white leading-tight">Secure recovery for the modern curator.</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-[280px]">Your digital archives are protected with multi-layered encryption and ephemeral access links.</p>
              </div>
              
              <div className="mt-12 flex gap-4">
                <div className="flex -space-x-3">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuArQ21SNyD5yjzXa9cuhAwCofvrSFuQSFC3JKdjNfM2ZNcX3hzZpADxbO26lX0EG_iy0MB7S2pwDCxlb_I1kP3Op0LXNMgipqIxEm2AmQYX0hNmYM4lCthBT-TAgiym-b_11YdcZ-nO118dRTYRON98X68Shcmm_20yMnNmfu4VhdC9M6BslqFygV8Fc-O7AgRj9PwssRgY2k5E4Jl-KlsFEVXHvHWkmTOsyS4m77CyiSHjqKqm5XSOQTLlRM4_TIKxj8uHEB9QEzJU" className="w-8 h-8 rounded-full border-2 border-surface object-cover" alt="User 1" />
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaC0HKZw_Vfr80FQy_iILHPcBvNWtrzV3EEaOW6y_S-wsF_pOsNjXqRG4YFttgSej3t_Nu7gh1h0w9P0IjhZ_ifArEYQkpw76mpyg2APkhmJxKL2mEHCM-4nMWDWfAH1midbAtH0JrHjoDMj4OX3uR5KRgiyLbg_2AG_gFOA824qHhDDu8HiwCaH1DCvamFBIo6CVelh1jT_dX1W3X8xeQkZ1cEnPNzVrdJvIITizBN3vjPIT-MHtc27OwDxmBs9m9PEBJzA9UGYgp" className="w-8 h-8 rounded-full border-2 border-surface object-cover" alt="User 2" />
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUuiY9MTOH5UwsnRV2sTUr-3KcCR1qm2IW3BNkUQnK8G0hxR8x-nrmdE7kvHXE_MCaRoVpgmuXu0o9hxfdB8ntD4_EslC3mRaKSW-6yPu9gaAQ-JfsokiQkbjTfedEUbGLqzXJn8_ZKVG12C-NaZtk-hUHAAcdlPLNtsXgYM1RrbRZ5gr6ZGgrkuCVt9yqCTEz7S85kI408ejQnbE4MSZvv4t_Hx3X1Bap2uYv48hSnoK7NjQfpToEYqv62EB7-bVJ8XcU7djaokDl" className="w-8 h-8 rounded-full border-2 border-surface object-cover" alt="User 3" />
                </div>
                <span className="text-[10px] font-label font-bold uppercase tracking-widest text-outline self-center">Joined by 12k+</span>
              </div>
            </div>

            <div className="absolute top-10 right-10 w-32 h-32 rounded-full glass-card border border-white/10 flex items-center justify-center opacity-40 rotate-12">
              <span className="material-symbols-outlined text-4xl text-primary">lock_open</span>
            </div>
          </div>
        </div>

        {/* Footer Metadata */}
        <footer className="mt-12 flex flex-col items-center gap-6">
          <div className="flex gap-8">
            <a href="#" className="font-label text-[10px] font-bold uppercase tracking-widest text-outline hover:text-on-surface transition-colors">Security Policy</a>
            <a href="#" className="font-label text-[10px] font-bold uppercase tracking-widest text-outline hover:text-on-surface transition-colors">Help Center</a>
            <a href="#" className="font-label text-[10px] font-bold uppercase tracking-widest text-outline hover:text-on-surface transition-colors">Terms of Access</a>
          </div>
          <p className="font-label text-[9px] text-outline/40 tracking-[0.3em] uppercase">© 2026 Fanvior Archive</p>
        </footer>
      </main>
    </div>
  );
}
