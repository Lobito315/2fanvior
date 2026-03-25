import React from 'react';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { SideNavBar } from '@/components/layout/SideNavBar';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: 'Sienna Velour',
      action: 'liked your artifact',
      target: '"Midnight reverie logic..."',
      time: '4m ago',
      read: false,
      icon: 'favorite',
      iconColor: 'text-tertiary'
    },
    {
      id: 2,
      type: 'subscription',
      user: 'Aiden Voss',
      action: 'subscribed to your tier',
      target: 'Midnight Elite',
      time: '2h ago',
      read: false,
      icon: 'star',
      iconColor: 'text-primary'
    },
    {
      id: 3,
      type: 'comment',
      user: 'Nexus Arte',
      action: 'commented on your artifact',
      target: '"Structural gradients test..."',
      time: '5h ago',
      read: true,
      icon: 'chat_bubble',
      iconColor: 'text-outline/80'
    },
    {
      id: 4,
      type: 'system',
      user: 'Fanvior Concierge',
      action: 'Your payout of $4,240.00 was successfully processed to your linked account.',
      target: '',
      time: '1d ago',
      read: true,
      icon: 'account_balance',
      iconColor: 'text-on-surface-variant'
    }
  ];

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <SideNavBar />
      <TopNavBar />
      
      <main className="ml-64 mt-20 p-8 flex justify-center w-full max-w-7xl mx-auto">
        <div className="w-full max-w-3xl space-y-6">
          
          <div className="flex justify-between items-end border-b border-outline-variant/10 pb-6">
            <div>
              <h1 className="font-headline text-3xl font-extrabold tracking-tight">Activity Feed</h1>
              <p className="text-outline text-sm mt-1">Your curatorial network at a glance.</p>
            </div>
            <button className="text-xs font-bold text-primary font-label uppercase tracking-widest hover:text-primary-fixed transition-colors">
              Mark all as read
            </button>
          </div>

          <div className="space-y-4">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-5 rounded-xl border transition-all cursor-pointer flex gap-4 ${
                  notif.read 
                    ? 'bg-surface-container-lowest border-outline-variant/5 hover:border-outline-variant/20' 
                    : 'bg-surface-container-high border-primary/20 shadow-lg relative'
                }`}
              >
                {!notif.read && (
                  <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]"></div>
                )}
                
                <div className="w-12 h-12 rounded-full border border-outline/10 flex-shrink-0 relative overflow-hidden bg-surface-container-highest flex items-center justify-center">
                   {notif.type === 'system' ? (
                     <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 1" }}>{notif.icon}</span>
                   ) : (
                     <div className="w-full h-full bg-surface-container-lowest"></div> // Placeholder for Avatar Image
                   )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-body leading-snug">
                       <span className="font-bold text-on-surface">{notif.user}</span>{' '}
                       <span className="text-on-surface-variant">{notif.action}</span>{' '}
                       {notif.target && <span className="text-on-surface italic">{notif.target}</span>}
                    </p>
                    <span className="text-xs text-outline whitespace-nowrap ml-4">{notif.time}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center pl-2">
                   <span className={`material-symbols-outlined text-xl ${notif.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                     {notif.icon}
                   </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-8 flex justify-center">
            <button className="px-6 py-2 rounded-full border border-outline-variant/20 text-xs text-outline hover:text-on-surface hover:bg-surface-container-lowest transition-colors font-label uppercase tracking-widest">
              Load Previous Activity
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
