"use client";

import React, { useEffect, useState } from 'react';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { SideNavBar } from '@/components/layout/SideNavBar';

interface User {
  id: string;
  name: string | null;
  email: string;
  handle: string | null;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then((data: any) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const RoleBadge = ({ role }: { role: string }) => {
    const colors: Record<string, string> = {
      ADMIN: 'bg-error-container/30 text-error',
      CREATOR: 'bg-primary-container/40 text-primary',
      SUBSCRIBER: 'bg-surface-container-high text-outline',
    };
    return (
      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-[2px] rounded-full ${colors[role] ?? colors.SUBSCRIBER}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <SideNavBar />
      <TopNavBar />

      <main className="ml-64 mt-16 p-8 min-h-screen">
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
            <span>Admin</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary font-bold">User Management</span>
          </nav>
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
            Community <span className="text-primary">Users</span>
          </h2>
          <p className="text-outline mt-2">Manage all registered users, roles, and access levels.</p>
        </div>

        <div className="bg-surface-container-high rounded-2xl border border-outline-variant/10 overflow-hidden glass-card">
          {/* Header */}
          <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
            <p className="text-sm font-bold uppercase tracking-widest text-outline">
              {loading ? 'Loading...' : `${users.length} registered users`}
            </p>
          </div>

          {/* User list */}
          <div className="divide-y divide-outline-variant/10">
            {loading && [1, 2, 3].map(i => (
              <div key={i} className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-container-highest rounded animate-pulse w-40" />
                  <div className="h-3 bg-surface-container-highest rounded animate-pulse w-24" />
                </div>
              </div>
            ))}

            {error && (
              <div className="p-10 text-center text-outline">
                <span className="material-symbols-outlined text-3xl mb-2 block">error</span>
                {error}
              </div>
            )}

            {!loading && !error && users.length === 0 && (
              <div className="p-12 text-center text-outline">
                <span className="material-symbols-outlined text-5xl mb-4 block">group</span>
                <p className="font-label uppercase tracking-widest text-sm">No users found</p>
              </div>
            )}

            {!loading && users.map(user => (
              <div key={user.id} className="p-6 flex items-center gap-4 hover:bg-surface-container-highest/30 transition-colors">
                <div className="w-10 h-10 rounded-full brand-gradient flex items-center justify-center text-on-primary-container font-bold text-sm flex-shrink-0">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-on-surface truncate">{user.name || '(no name)'}</p>
                  <p className="text-xs text-outline truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {user.handle && <span className="text-xs text-outline hidden md:block">{user.handle}</span>}
                  <RoleBadge role={user.role} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
