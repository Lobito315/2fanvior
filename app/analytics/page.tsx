"use client";

import React from 'react';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { StatCard } from '@/components/cards/StatCard';
import Image from 'next/image';

export default function AnalyticsPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <TopNavBar />
      <SideNavBar />

      <main className="flex-1 lg:ml-72 pt-24 px-8 pb-12 w-full max-w-7xl mx-auto">
        {/* Hero Stats Header */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="Total Subscribers" 
            value="42,891" 
            trend="+12%" 
            glowColor="primary" 
          />
          <StatCard 
            title="Active Engagement" 
            value="8.4%" 
            trend="+1.2%" 
            glowColor="tertiary" 
          />
          <StatCard 
            title="Estimated Earnings" 
            value="$14,202" 
            trend="Payout" 
            icon="payments" 
            glowColor="primary" 
            className="border-b-4 border-primary-container/20"
          />
        </section>

        {/* Revenue Over Time - Large Card */}
        <section className="bg-surface-container-high rounded-lg p-8 shadow-2xl relative overflow-hidden mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-1">Revenue Over Time</h2>
              <p className="text-outline text-sm">Monthly performance breakdown of your premium collections.</p>
            </div>
            <div className="flex bg-surface-container-low p-1 rounded-full">
              <button className="px-4 py-1.5 rounded-full text-xs font-label uppercase tracking-widest bg-primary-container text-on-primary-container shadow-lg">Weekly</button>
              <button className="px-4 py-1.5 rounded-full text-xs font-label uppercase tracking-widest text-outline hover:text-on-surface">Monthly</button>
            </div>
          </div>

          <div className="h-64 w-full relative">
            <svg className="w-full h-full preserve-3d" viewBox="0 0 1000 300">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6c5ce7" stopOpacity="0.4"></stop>
                  <stop offset="100%" stopColor="#6c5ce7" stopOpacity="0"></stop>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"></feGaussianBlur>
                  <feMerge>
                    <feMergeNode in="coloredBlur"></feMergeNode>
                    <feMergeNode in="SourceGraphic"></feMergeNode>
                  </feMerge>
                </filter>
              </defs>
              <line stroke="#474554" strokeOpacity="0.2" x1="0" y1="50" x2="1000" y2="50"></line>
              <line stroke="#474554" strokeOpacity="0.2" x1="0" y1="150" x2="1000" y2="150"></line>
              <line stroke="#474554" strokeOpacity="0.2" x1="0" y1="250" x2="1000" y2="250"></line>
              
              <path d="M0,250 L100,210 L250,230 L400,120 L550,150 L700,60 L850,90 L1000,40 L1000,300 L0,300 Z" fill="url(#chartGradient)"></path>
              
              <path d="M0,250 L100,210 L250,230 L400,120 L550,150 L700,60 L850,90 L1000,40" fill="none" stroke="#c6bfff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)"></path>
              
              <circle cx="400" cy="120" r="6" fill="#c6bfff" className="drop-shadow-[0_0_8px_#c6bfff]"></circle>
              <circle cx="700" cy="60" r="6" fill="#c6bfff" className="drop-shadow-[0_0_8px_#c6bfff]"></circle>
              <circle cx="1000" cy="40" r="6" fill="#ffb1c4" className="drop-shadow-[0_0_8px_#ffb1c4]"></circle>
            </svg>
            
            <div className="flex justify-between mt-6 text-[10px] font-label text-outline uppercase tracking-widest px-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </section>

        {/* Content Performance & Subscriber Growth */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-surface-container-low rounded-lg overflow-hidden">
            <div className="p-8 border-b border-outline-variant/10">
              <h3 className="text-xl font-headline font-bold text-on-surface">Content Performance</h3>
              <p className="text-sm text-outline">Deep dive into individual post ROI.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-high/50">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-label uppercase tracking-widest text-outline">Content Title</th>
                    <th className="px-4 py-4 text-[10px] font-label uppercase tracking-widest text-outline">Views</th>
                    <th className="px-4 py-4 text-[10px] font-label uppercase tracking-widest text-outline">Engagement</th>
                    <th className="px-8 py-4 text-[10px] font-label uppercase tracking-widest text-outline text-right">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  <tr className="hover:bg-surface-container-highest/50 transition-colors">
                    <td className="px-8 py-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container-highest relative">
                        <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXwXqt9SZ68UqVfhSd-LSeSzw0w8xfjSJwl-FKwIP_EMtZG-FGSKy-UtM9aA39oIJUXW0MNXX-aqFT790fTU2uLPHE1topgJ1_iciU3a5wETPk3kYdpgxVf8_ur_DpwB9A4INe4bcyv4kewppq2T849kq-kP-5oCKQyMhbXJDkuSU61BB8s0ulhMmobP-SQs8Lj0kOKJXxmUucoyxrBOob8PP9Pznvo8BTXyh_rPA0h1kUjKkd4RKdDJRuciQabrwdnTLCXd2JACBq" alt="Thumbnail" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">Midnight Aesthetics Vol. 4</p>
                        <p className="text-xs text-outline">Premium Gallery</p>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-sm text-on-surface-variant">12.4K</td>
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-16 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-[72%]"></div>
                        </div>
                        <span className="text-xs text-on-surface-variant">7.2%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-headline font-bold text-primary">$1,240.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="bg-surface-container-high rounded-lg p-8 flex-1 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-headline font-bold text-on-surface">Subscriber Growth</h3>
                <p className="text-xs text-outline uppercase tracking-widest mt-1">Acquisition Velocity</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center py-8">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-surface-container-highest"></circle>
                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray="440" strokeDashoffset="110" strokeLinecap="round" className="text-primary"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-headline font-black text-on-surface">75%</span>
                    <span className="text-[8px] uppercase tracking-tighter text-outline">Retention</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
