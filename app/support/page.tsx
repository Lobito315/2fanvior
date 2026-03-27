"use client";

import React from 'react';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { SideNavBar } from '@/components/layout/SideNavBar';

const SUPPORT_LINKS = [
  {
    icon: 'article',
    title: 'Documentation',
    description: 'Read the platform guides and how-to articles.',
    href: 'https://github.com/Lobito315/2fanvior',
    label: 'View Docs',
  },
  {
    icon: 'mail',
    title: 'Email Support',
    description: 'Contact the Fanvior team directly for help.',
    href: 'mailto:support@fanvior.com',
    label: 'Send Email',
  },
  {
    icon: 'bug_report',
    title: 'Report a Bug',
    description: 'Found an issue? Let us know so we can fix it.',
    href: 'https://github.com/Lobito315/2fanvior/issues',
    label: 'Open Issue',
  },
];

export default function SupportPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <SideNavBar />
      <TopNavBar />

      <main className="ml-64 mt-16 p-8 max-w-3xl">
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
            <span>Account</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary font-bold">Support</span>
          </nav>
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
            Need <span className="text-primary">Help?</span>
          </h2>
          <p className="text-outline mt-2">We're here for you. Browse the options below to find the support you need.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {SUPPORT_LINKS.map(item => (
            <a
              key={item.title}
              href={item.href}
              target={item.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="flex items-start gap-6 p-6 bg-surface-container-high rounded-2xl border border-outline-variant/10 glass-card hover:border-primary/30 hover:bg-surface-container-highest transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-container/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-container/50 transition-colors">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-headline font-bold text-on-surface mb-1">{item.title}</h3>
                <p className="text-sm text-outline">{item.description}</p>
              </div>
              <div className="flex items-center gap-2 text-primary text-sm font-bold flex-shrink-0 self-center">
                <span>{item.label}</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
