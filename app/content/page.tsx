"use client";

import React, { useState } from 'react';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { Button } from '@/components/ui/Button';

export default function IdentityVerificationPage() {
  const [activeTab, setActiveTab] = useState('PENDING');

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <SideNavBar />
      <TopNavBar />
      
      <main className="ml-64 mt-16 p-8 min-h-screen">
        {/* Header Section */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
            <a href="#" className="hover:text-primary transition-colors">Admin</a>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary font-bold">Identity Verification</span>
          </nav>
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">Age <span className="text-primary">Verification</span></h2>
          <p className="text-outline mt-2 max-w-lg font-body">Review submitted government IDs to ensure all registered creators and subscribers are 18+ years of age.</p>
        </div>

        {/* Action Tabs */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('PENDING')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'PENDING' ? 'bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/30 scale-105' : 'bg-surface-container-low text-outline hover:bg-surface-container-high hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-sm">pending_actions</span>
            Pending Approval
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${activeTab === 'PENDING' ? 'bg-on-primary-container text-primary-container' : 'bg-outline/20 text-outline'}`}>12</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('REJECTED')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'REJECTED' ? 'bg-error-container text-on-error-container shadow-lg shadow-error-container/30 scale-105' : 'bg-surface-container-low text-outline hover:bg-surface-container-high hover:text-error'}`}
          >
            <span className="material-symbols-outlined text-sm">block</span>
            Rejected Docs
          </button>
          
          <button 
            onClick={() => setActiveTab('VERIFIED')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'VERIFIED' ? 'bg-tertiary-container text-on-tertiary-container shadow-lg shadow-tertiary-container/30 scale-105' : 'bg-surface-container-low text-outline hover:bg-surface-container-high hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-sm">verified_user</span>
            Recently Verified
          </button>
        </div>

        {/* Verification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item, i) => (
            <div 
              key={item} 
              className="glass-card rounded-xl overflow-hidden border border-outline-variant/10 group bg-surface-container-lowest shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-primary/30 animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* ID Preview Box */}
              <div className="relative h-40 bg-surface-container flex flex-col items-center justify-center overflow-hidden border-b border-outline/10">
                <span className="material-symbols-outlined text-5xl text-outline/30 mb-2 group-hover:text-primary/50 transition-colors">badge</span>
                <p className="text-[10px] font-label uppercase tracking-widest text-outline">Encrypted ID Document</p>
                <button className="absolute inset-0 w-full h-full bg-surface-container-highest/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <span className="bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl shadow-primary/20">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    View Secure Document
                  </span>
                </button>
                
                {activeTab === 'REJECTED' && (
                  <div className="absolute top-3 right-3 bg-error text-on-error text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                    Declined
                  </div>
                )}
                
                {activeTab === 'PENDING' && (
                  <div className="absolute top-3 right-3 bg-primary-container text-on-primary-container text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                    Awaiting Review
                  </div>
                )}

                {activeTab === 'VERIFIED' && (
                  <div className="absolute top-3 right-3 bg-tertiary text-on-tertiary text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                    Approved
                  </div>
                )}
              </div>
              
              {/* User Info */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-outline/20 overflow-hidden relative group-hover:border-primary/50 transition-colors bg-surface">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHAlaRdiimN0kwhN49DkYsCYawwy-MT7hiqRvoMlNcg31IOixdrxh4oKSluhuLjEDfNjDID8uOXye-GJ3OtCE_YFobKYjWbEwf8IUNvTKHxi9RdZqpSwLS7HcRWFAVFk9iuvLP55v-99cqVgFtS0Kv5LToYVvDdwoaDV9Jk5GgZDt4NagagCUXphoMUvOwjSNvH-Fbi5gjpd9YnSoOjsSAXzU42F1fdCapbPGKvjfraxfi4er3r4oCSx5bQiuYePECUbOn1xTqtd90" alt="Avatar" className="w-full h-full object-cover grayscale opacity-80" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface leading-none hover:text-primary cursor-pointer transition-colors">Alexander Thorne</p>
                    <p className="text-[10px] text-outline mt-1 font-label tracking-wide uppercase">@alex_t &bull; Registered 1hr ago</p>
                  </div>
                </div>
                
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between items-center bg-surface-container-low p-2 rounded-lg border border-outline/5 hover:border-outline/20 transition-colors">
                    <span className="text-[10px] font-label text-outline uppercase tracking-wider">Date of Birth</span>
                    <span className="text-xs font-bold text-on-surface">1998-04-12 (27 y/o)</span>
                  </div>
                  <div className="flex justify-between items-center bg-surface-container-low p-2 rounded-lg border border-outline/5 hover:border-outline/20 transition-colors">
                    <span className="text-[10px] font-label text-outline uppercase tracking-wider">Document Type</span>
                    <span className="text-xs font-bold text-on-surface">Passport</span>
                  </div>
                </div>
                
                {/* Moderator Actions */}
                <div className="flex gap-3 pt-4 border-t border-outline/10">
                  <Button variant="outline" className="flex-1 text-[11px] h-10 border-error/30 text-error hover:bg-error-container hover:text-on-error-container hover:border-error transition-all font-bold">
                    Reject ID
                  </Button>
                  <Button variant="gradient" className="flex-1 text-[11px] h-10 shadow-lg shadow-primary/20">
                    Verify Age (18+)
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
