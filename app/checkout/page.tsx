"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const [complete, setComplete] = useState(false);

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen selection:bg-primary/30">
      {/* TopAppBar Execution */}
      <header className="fixed top-0 w-full z-50 bg-[#12121d]/70 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(13,13,24,0.3)] flex items-center justify-between px-6 h-20">
        <div className="flex items-center gap-4">
          <span className="text-transparent bg-clip-text brand-gradient font-black italic font-headline tracking-tight text-2xl">
            Ethereal Nocturne
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-primary hover:bg-primary/10 transition-colors active:scale-95 duration-200 p-2 rounded-full">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </button>
          <button className="text-primary hover:bg-primary/10 transition-colors active:scale-95 duration-200 p-2 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4 md:px-0 flex justify-center items-center min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-container/10 via-surface to-surface">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative">
          
          {/* Transaction Summary Column */}
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="p-8 rounded-lg bg-surface-container-low/50 glass-card flex flex-col gap-10 border border-outline-variant/10">
              <div>
                <h2 className="font-headline text-3xl font-bold text-primary mb-2 tracking-tight">Summary</h2>
                <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest">Review your selection</p>
              </div>
              
              <div className="flex flex-col gap-8">
                <div className="flex gap-6 items-center">
                  <div className="w-24 h-24 rounded-md overflow-hidden bg-surface-container-high shrink-0 relative">
                    <Image 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0KHFbrexzHEto9QwrXpVxQbX_jN6wlcWhcYHgjWskxxeFgEqFnCDMSfG2WGZk0xH9AP36wVjA5QJR8fV1xQSCYQlt-Anx6e4R8IqqY0npQDGQSpVjmKdIN7uhMEScyGwuLdrH5S0QS_Plzz6g7FUXazsFYGrMniaj3BoH1vrkxytFpIYErDM94MX2osaoMBb-E4PKEU67mjmw0o6K9LoLL3PMLTKdnt5jQ3a1NS3fJWtnwEkPCzyOP67n30bRPVNnhJsyY7zlTPtB" 
                      alt="Digital Series #04 Cover" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-on-surface font-headline font-bold text-xl">Digital Series #04</span>
                    <span className="text-tertiary font-label text-xs uppercase tracking-widest mt-1">Elena G.</span>
                    <span className="text-on-surface-variant text-sm mt-2">Premium Curated Asset</span>
                  </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-outline-variant/20">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>$9.99</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Processing Fee</span>
                    <span className="text-tertiary">Included</span>
                  </div>
                  
                  <div className="flex justify-between items-end pt-4">
                    <span className="font-headline font-bold text-on-surface text-lg">Total</span>
                    <span className="font-headline font-bold text-3xl text-primary">$9.99</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-col gap-4 pt-6">
                <div className="flex items-center gap-3 text-on-surface-variant/60">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span className="text-xs font-label uppercase tracking-wider">Secured by PayPal</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant/60">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span className="text-xs font-label uppercase tracking-wider">Encrypted Transaction</span>
                </div>
              </div>
            </div>
          </div>

          {/* PayPal Integration UI Column */}
          <div className="md:col-span-7 order-1 md:order-2">
            <div className="rounded-lg bg-surface-container-highest shadow-2xl overflow-hidden border border-outline-variant/10">
              
              <div className="p-10 brand-gradient">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="font-headline font-extrabold text-4xl text-on-primary-container tracking-tighter mb-2">Complete Checkout</h1>
                    <p className="text-on-primary-container/80 text-lg">Secure authorization via PayPal</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-full backdrop-blur-md">
                    <span className="material-symbols-outlined text-on-primary-container text-3xl">payments</span>
                  </div>
                </div>
              </div>

              <div className="p-10 flex flex-col gap-8">
                {/* User Info (Auth State) */}
                <div className="flex flex-col gap-2">
                   {/* Payment button */}
                   <Button 
                     variant="gradient" 
                     fullWidth 
                     size="lg" 
                     className="py-6 text-xl shadow-[0_0_20px_rgba(108,92,231,0.4)]"
                     onClick={() => {
                        console.log("Mocking PayPal execution");
                        setComplete(true);
                     }}
                   >
                     Complete Purchase with PayPal
                     <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
                   </Button>
                   
                   {complete && (
                     <div className="text-center mt-4 p-4 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 font-bold">
                       Payment Simulated Successfully!
                     </div>
                   )}
                   
                   <p className="text-center text-xs text-on-surface-variant/60 mt-6 px-8 leading-relaxed">
                     By clicking "Complete Purchase", you authorize Ethereal Nocturne to charge $9.99 to your PayPal account. Terms & Privacy Policy apply.
                   </p>
                </div>
              </div>

              {/* Bottom Branding */}
              <div className="bg-surface-container-lowest p-6 flex items-center justify-center gap-8 border-t border-outline-variant/10">
                <span className="font-headline font-bold italic text-on-surface-variant/40 text-sm tracking-tighter">Ethereal Nocturne Secure Checkout</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
