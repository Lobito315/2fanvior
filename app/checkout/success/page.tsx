import React from 'react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-6 bg-surface overflow-hidden">
      {/* Cinematic ambient background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-container-high/40 via-surface to-surface"></div>
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-tertiary-container/10 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-lg">
        <div className="glass-card p-12 rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-outline-variant/20 text-center flex flex-col items-center">
          
          <div className="w-24 h-24 bg-primary-container/20 border border-primary/30 rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_-10px_rgba(var(--primary),0.4)]">
            <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>

          <h1 className="font-headline text-4xl font-extrabold text-on-surface mb-4 tracking-tight">Access Granted</h1>
          
          <p className="text-on-surface-variant text-base font-body mb-8 leading-relaxed">
            Your payment was successfully processed. You now have exclusive access to premium content and private tiers within the Fanvior ecosystem.
          </p>

          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl w-full p-6 text-left mb-10 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-outline font-label uppercase tracking-widest text-[10px]">Transaction ID</span>
              <span className="font-mono text-on-surface font-bold text-xs uppercase">#FXN-84B92X</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-outline font-label uppercase tracking-widest text-[10px]">Tier</span>
              <span className="text-primary font-bold">Midnight Elite</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-outline font-label uppercase tracking-widest text-[10px]">Amount Paid</span>
              <span className="text-on-surface font-bold">$49.99 USD</span>
            </div>
          </div>

          <Link href="/dashboard" className="w-full brand-gradient py-4 rounded-xl text-sm font-bold text-on-primary-container shadow-xl shadow-primary-container/20 flex justify-center items-center gap-2 hover:scale-[1.03] active:scale-95 transition-all uppercase tracking-widest font-label">
            Enter Dashboard
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
          
          <Link href="/feed" className="mt-6 text-sm text-outline hover:text-on-surface transition-colors font-body underline decoration-outline/30 underline-offset-4">
            Return to Feed
          </Link>
        </div>
      </main>
    </div>
  );
}
