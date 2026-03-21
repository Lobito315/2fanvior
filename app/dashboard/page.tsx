"use client";

import React from 'react';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { StatCard } from '@/components/cards/StatCard';
import { UserCard } from '@/components/cards/UserCard';

export default function DashboardPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <SideNavBar />
      <TopNavBar />
      
      <main className="ml-64 mt-16 p-8 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
              <a href="#" className="hover:text-primary">Admin</a>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary font-bold">User Management</span>
            </nav>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">Community <span className="text-primary">Curators</span></h2>
            <p className="text-outline mt-2 max-w-lg">Oversee, moderate, and empower your creator ecosystem from one unified control center.</p>
          </div>
          
          <button className="flex items-center gap-2 bg-gradient-to-br from-primary-container to-on-primary-fixed-variant text-on-primary-container px-6 py-3 rounded-full font-bold shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all">
            <span className="material-symbols-outlined">person_add</span>
            <span>Add New User</span>
          </button>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value="12,842" trend="+4.2%" trendUp glowColor="primary" />
          <StatCard title="Active Creators" value="842" trend="+12%" trendUp glowColor="primary" />
          <StatCard title="Monthly Volume" value="$2.4M" trend="VIP Priority" trendUp glowColor="tertiary" />
          <StatCard title="Flagged Accounts" value="14" icon="priority_high" glowColor="error" className="border-tertiary-container/30" />
        </div>

        {/* Filters & Table */}
        <div className="bg-surface-container-high rounded-lg overflow-hidden glass-card border border-outline-variant/10">
          {/* Filter Bar */}
          <div className="p-6 border-b border-outline-variant/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button className="px-5 py-2 rounded-full bg-primary-container text-on-primary-container text-xs font-bold transition-all">All Users</button>
              <button className="px-5 py-2 rounded-full bg-surface-container-low text-outline text-xs font-bold hover:bg-surface-bright transition-all">Creators</button>
              <button className="px-5 py-2 rounded-full bg-surface-container-low text-outline text-xs font-bold hover:bg-surface-bright transition-all">Subscribers</button>
              <button className="px-5 py-2 rounded-full bg-surface-container-low text-outline text-xs font-bold hover:bg-surface-bright transition-all flex items-center gap-1">
                  Flagged
                  <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 text-outline text-xs font-medium bg-surface-container-lowest px-4 py-2 rounded-lg hover:text-on-surface transition-all">
                <span className="material-symbols-outlined text-sm">tune</span>
                Advanced Filters
              </button>
              <button className="flex items-center gap-2 text-outline text-xs font-medium bg-surface-container-lowest px-4 py-2 rounded-lg hover:text-on-surface transition-all">
                <span className="material-symbols-outlined text-sm">file_download</span>
                Export
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 gap-4">
             <UserCard 
                name="Sienna Velour"
                handle="@siennavelour • ID: 82910"
                avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBHAlaRdiimN0kwhN49DkYsCYawwy-MT7hiqRvoMlNcg31IOixdrxh4oKSluhuLjEDfNjDID8uOXye-GJ3OtCE_YFobKYjWbEwf8IUNvTKHxi9RdZqpSwLS7HcRWFAVFk9iuvLP55v-99cqVgFtS0Kv5LToYVvDdwoaDV9Jk5GgZDt4NagagCUXphoMUvOwjSNvH-Fbi5gjpd9YnSoOjsSAXzU42F1fdCapbPGKvjfraxfi4er3r4oCSx5bQiuYePECUbOn1xTqtd90"
                role="CREATOR"
                isOnline
                actionButton={
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-on-surface">$142,500.00</span>
                    <span className="text-[10px] text-outline">Total Earned</span>
                  </div>
                }
             />
             <UserCard 
                name="Marcus Chen"
                handle="@m_chen88 • ID: 10423"
                avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBtJUJpqdgMkyRPfEJQvQVlyUYRMsKl9n-SVdrU8zPs_JYaoLxzwPMO4V4igARWsSX5bHazyvyRv28b2bA3v5dZPasbnW_pNepz3422fYj6eR8HhZUDr4qSZR9vdcNqjLKj786m6Mc3Xlw8zSStIgPNeZt3Ji2UaOcSp0dXCOGhjVCAaejH_tYoBV0_DxCiKeM5Lkbkc1kJ6YahbAArU5KtKGnTzS1Khf10e1E1Wa-Vv5fKAHnKP-tGF-hxLz_hG02DfQoBsIZx_QUi"
                role="SUBSCRIBER"
                isOnline
                actionButton={
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-on-surface">$12,840.50</span>
                    <span className="text-[10px] text-outline">Total Spent</span>
                  </div>
                }
             />
             <UserCard 
                name="Julian Thorne"
                handle="@thorney_99 • ID: 55210"
                avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBLRBUcN4Mia_YWqLd1aDEyvpQbDDZv1KSUaJSVT5kf1FSHZKOZ-ayiMdR0FQOPBJsmvE597jKEHx-PecQXXNpvZuz-TDBEgnqxcJ-5oiCBtIftYSFoFtYi3AlM90NVFB2E4kzXFlDiWnNaPuPc_vEXqF0eo0O-d4hzg7ZCbgqukklXN-THDchgsjPQhXLcQN35_-WIaQ_k8ZpKTypzSwO-_mEJDaUXBoWbu4VLZfEn0mHYp97s-J091dhzo8-ODf4Rto9KM0DlyjCC"
                role="SUBSCRIBER"
                className="bg-error-container/10 border-error/20"
                statusBadge={<span className="text-[10px] text-error font-bold uppercase tracking-widest bg-error-container/30 px-2 py-[2px] rounded-full">Flagged</span>}
                actionButton={
                  <div className="flex flex-col items-end text-error">
                    <span className="text-sm font-bold">$0.00</span>
                    <span className="text-[10px]">Chargeback Risk</span>
                  </div>
                }
             />
          </div>
          
          <div className="p-6 flex items-center justify-between border-t border-outline-variant/10">
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Showing 1 to 3 of 12,842 curators</p>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-low text-outline hover:text-on-surface transition-all">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-container text-on-primary-container text-[10px] font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-bright text-outline text-[10px] font-bold">2</button>
              <span className="text-outline">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-low text-outline hover:text-on-surface transition-all">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
