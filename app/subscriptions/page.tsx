"use client";

import React from 'react';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { Button } from '@/components/ui/Button';

export default function SubscriptionsPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <TopNavBar />
      <SideNavBar />

      <main className="flex-1 lg:ml-72 pt-24 px-8 pb-12 w-full max-w-5xl">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">Your Vault Access</h1>
            <p className="text-outline mt-2">Manage your subscriptions, billing cycles, and exclusive creator tiers.</p>
          </div>
          <Button variant="outline" className="shadow-none">View Billing History</Button>
        </header>

        <section className="space-y-6">
          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-6 w-full">
              <div className="w-16 h-16 rounded-full bg-surface-container-highest flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-headline font-bold text-lg text-on-surface">Elena G.</h3>
                  <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded-full uppercase tracking-widest font-bold">Premium Tier</span>
                </div>
                <p className="text-sm text-outline mt-1">Next billing date: <strong>Nov 12, 2026</strong></p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="text-right hidden sm:block">
                <p className="font-headline font-bold text-xl text-on-surface">$14.99</p>
                <p className="text-[10px] text-outline uppercase tracking-widest">/ month</p>
              </div>
              <Button variant="secondary" className="w-full md:w-auto text-sm">Manage</Button>
            </div>
          </div>
          
          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 flex flex-col md:flex-row gap-6 items-center justify-between opacity-60">
            <div className="flex items-center gap-6 w-full">
              <div className="w-16 h-16 rounded-full bg-surface-container-highest flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-headline font-bold text-lg text-on-surface">Midnight Studio</h3>
                  <span className="text-[10px] bg-surface-container-highest text-outline px-2 py-1 rounded-full uppercase tracking-widest font-bold">Expired</span>
                </div>
                <p className="text-sm text-outline mt-1">Access ended: <strong>Aug 01, 2026</strong></p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="text-right hidden sm:block">
                <p className="font-headline font-bold text-xl text-on-surface">$9.99</p>
                <p className="text-[10px] text-outline uppercase tracking-widest">/ month</p>
              </div>
              <Button variant="outline" className="w-full md:w-auto text-sm border-outline-variant/30 text-outline">Renew Access</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
