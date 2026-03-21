"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function RegisterPage() {
  const [role, setRole] = useState<'CREATOR' | 'SUBSCRIBER'>('SUBSCRIBER');
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Registration API
    console.log("Registering", { role });
  };

  return (
    <div className="relative flex min-h-screen bg-surface">
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary-container/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[5%] w-[40%] h-[50%] bg-tertiary-container/5 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 flex flex-col lg:flex-row w-full min-h-screen">
        {/* Left Side: Editorial Visual */}
        <section className="hidden lg:flex w-1/2 p-12 flex-col justify-between items-start overflow-hidden relative">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-primary font-headline">Fanvior</span>
          </div>
          
          <div className="relative w-full max-w-lg">
            <h1 className="font-headline text-7xl font-extrabold tracking-tight leading-tight shadow-primary/30 text-shadow">
              The <span className="text-primary">Ethereal</span> <br/> Nocturne
            </h1>
            <p className="mt-8 text-on-surface-variant text-xl max-w-md font-light leading-relaxed">
              Step into a curated sanctuary of high-end editorial experiences. A private gallery for the digital vanguard.
            </p>
          </div>
          
          <div className="flex gap-12">
            <div className="flex flex-col">
              <span className="font-headline text-3xl font-bold text-primary">12K+</span>
              <span className="text-[10px] font-label uppercase tracking-widest text-outline mt-1">Global Creators</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-3xl font-bold text-primary">95%</span>
              <span className="text-[10px] font-label uppercase tracking-widest text-outline mt-1">Satisfaction</span>
            </div>
          </div>
        </section>

        {/* Right Side: Sign Up Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="glass-card w-full max-w-xl rounded-lg p-8 lg:p-12 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] border border-outline-variant/10">
            <header className="mb-10">
              <h2 className="font-headline text-4xl font-bold text-on-surface tracking-tight">Join the Nocturne</h2>
              <p className="text-outline mt-2">Begin your journey in our midnight ecosystem.</p>
            </header>

            <form className="space-y-8" onSubmit={handleRegister}>
              {/* Role Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-label uppercase tracking-widest text-outline block">Choose Your Presence</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setRole('CREATOR')}
                    className={cn(
                      "group flex flex-col items-center justify-center p-6 rounded-lg transition-all border-2",
                      role === 'CREATOR' 
                        ? "bg-surface-container-high border-primary-container text-on-primary-container" 
                        : "bg-surface-container-low border-transparent text-outline hover:bg-surface-container-high"
                    )}
                  >
                    <span className="material-symbols-outlined mb-2 text-3xl" style={role === 'CREATOR' ? { fontVariationSettings: "'FILL' 1" } : {}}>brush</span>
                    <span className="font-headline text-sm font-bold">Creator</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('SUBSCRIBER')}
                    className={cn(
                      "group flex flex-col items-center justify-center p-6 rounded-lg transition-all border-2",
                      role === 'SUBSCRIBER' 
                        ? "bg-surface-container-high border-primary-container text-on-primary-container" 
                        : "bg-surface-container-low border-transparent text-outline hover:bg-surface-container-high"
                    )}
                  >
                    <span className="material-symbols-outlined mb-2 text-3xl" style={role === 'SUBSCRIBER' ? { fontVariationSettings: "'FILL' 1" } : {}}>person</span>
                    <span className="font-headline text-sm font-bold">Subscriber</span>
                  </button>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" placeholder="John Doe" required />
                <Input label="Username" placeholder="@curator" required />
                <Input label="Email Address" type="email" placeholder="void@midnight.com" containerClassName="md:col-span-2" required />
                <Input label="Password" type="password" placeholder="••••••••" containerClassName="md:col-span-2" required />
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3">
                <div className="flex items-center h-5">
                  <input type="checkbox" id="terms" required className="w-5 h-5 rounded border-none bg-surface-container-lowest text-primary-container focus:ring-0 focus:ring-offset-0 transition-colors" />
                </div>
                <label htmlFor="terms" className="text-sm text-outline leading-snug">
                  I verify that I am <span className="text-primary">18+ years of age</span> and agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                </label>
              </div>

              {/* CTA Actions */}
              <div className="pt-4 space-y-6">
                <Button type="submit" variant="gradient" fullWidth className="h-14">
                  Create Account
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-outline">Already have an account?</span>
                  <Link href="/login" className="text-tertiary font-bold hover:text-tertiary-fixed transition-colors">Login</Link>
                </div>
              </div>
            </form>

            {/* Footer Visual Decoration */}
            <div className="mt-12 pt-8 border-t border-outline-variant/10 flex justify-between items-center opacity-40 grayscale hover:grayscale-0 transition-all">
              <span className="text-[10px] font-label uppercase tracking-[0.2em] text-outline">Established 2026</span>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-lg">verified</span>
                <span className="material-symbols-outlined text-lg">security</span>
                <span className="material-symbols-outlined text-lg">lock</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
