import React from 'react';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { SideNavBar } from '@/components/layout/SideNavBar';

export default function ModerationQueuePage() {
  const reports = [
    { id: 'RPT-1042', targetUser: '@voss_archive', reason: 'Copyright Violation', confidence: '94%', status: 'Pending', time: '1h ago', severity: 'High' },
    { id: 'RPT-1043', targetUser: '@siennavelour', reason: 'Explicit Content (Non-Tier)', confidence: '82%', status: 'Under Review', time: '3h ago', severity: 'Medium' },
    { id: 'RPT-1044', targetUser: '@curator_01', reason: 'Spam / Bot Behavior', confidence: '99%', status: 'Resolved', time: '1d ago', severity: 'Low' },
    { id: 'RPT-1045', targetUser: '@shadow_fax', reason: 'Harassment', confidence: '45%', status: 'Pending', time: '2d ago', severity: 'High' },
  ];

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <SideNavBar />
      <TopNavBar />
      
      <main className="ml-64 mt-16 p-8 min-h-screen">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">Moderation <span className="text-error">Queue</span></h2>
            <p className="text-outline mt-2 max-w-xl">Curate and protect the Fanvior ecosystem. Review flagged content, appeals, and system alerts.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-surface-container flex flex-col px-6 py-2 rounded-lg border border-outline-variant/10">
                <span className="text-error font-headline text-xl font-bold">14</span>
                <span className="text-[10px] font-label uppercase tracking-widest text-outline">Open Reports</span>
             </div>
             <div className="bg-surface-container flex flex-col px-6 py-2 rounded-lg border border-outline-variant/10">
                <span className="text-primary font-headline text-xl font-bold">2.4m</span>
                <span className="text-[10px] font-label uppercase tracking-widest text-outline">Avg Res Time</span>
             </div>
          </div>
        </div>

        <div className="glass-card bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-xl overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/50">
            <div className="flex gap-4">
              <button className="bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-full text-xs font-bold font-label uppercase tracking-widest hover:bg-primary/30 transition-colors">Pending</button>
              <button className="text-outline border border-transparent hover:border-outline-variant/20 px-4 py-2 rounded-full text-xs font-bold font-label uppercase tracking-widest transition-colors">Under Review</button>
              <button className="text-outline border border-transparent hover:border-outline-variant/20 px-4 py-2 rounded-full text-xs font-bold font-label uppercase tracking-widest transition-colors">Resolved</button>
            </div>

            <div className="flex gap-3">
               <div className="relative">
                 <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/50">search</span>
                 <input type="text" placeholder="Search report ID or creator..." className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors w-64" />
               </div>
               <button className="px-4 py-2 border border-outline-variant/20 rounded-lg flex items-center gap-2 hover:bg-surface-container-highest transition-colors text-sm font-bold text-on-surface-variant">
                 <span className="material-symbols-outlined text-[18px]">filter_list</span>
                 Filters
               </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/50 border-b border-outline-variant/10 text-[10px] font-label uppercase tracking-widest text-outline">
                  <th className="p-6 font-semibold">Report ID</th>
                  <th className="p-6 font-semibold">Target User</th>
                  <th className="p-6 font-semibold">Reason</th>
                  <th className="p-6 font-semibold">AI Confidence</th>
                  <th className="p-6 font-semibold">Severity</th>
                  <th className="p-6 font-semibold">Time</th>
                  <th className="p-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {reports.map((report, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-lowest/50 transition-colors group">
                    <td className="p-6">
                      <span className="font-mono text-xs font-bold text-on-surface">{report.id}</span>
                    </td>
                    <td className="p-6 flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline/10 flex-shrink-0"></div>
                       <span className="text-sm font-bold text-on-surface-variant hover:text-primary cursor-pointer transition-colors">{report.targetUser}</span>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-body">{report.reason}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                         <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden w-16">
                            <div className="h-full bg-primary" style={{ width: report.confidence }}></div>
                         </div>
                         <span className="text-xs font-bold font-mono">{report.confidence}</span>
                      </div>
                    </td>
                    <td className="p-6">
                       <span className={`px-2 py-1 rounded text-[10px] font-bold font-label uppercase tracking-widest ${
                         report.severity === 'High' ? 'bg-error/20 text-error border border-error/30' :
                         report.severity === 'Medium' ? 'bg-tertiary/20 text-tertiary border border-tertiary/30' :
                         'bg-primary/20 text-primary border border-primary/30'
                       }`}>
                         {report.severity}
                       </span>
                    </td>
                    <td className="p-6">
                      <span className="text-xs text-outline whitespace-nowrap">{report.time}</span>
                    </td>
                    <td className="p-6 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-4 py-1.5 rounded-lg border border-outline/20 hover:border-error/50 hover:text-error transition-colors text-xs font-bold">
                        Reject
                      </button>
                      <button className="px-4 py-1.5 rounded-lg brand-gradient shadow-lg text-on-primary-container text-xs font-bold">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-outline-variant/10 text-center flex justify-between items-center text-xs text-outline px-6">
             <span>Showing 4 of 14 reports</span>
             <div className="flex gap-2">
               <button className="hover:text-on-surface">Prev</button>
               <span>•</span>
               <button className="text-primary font-bold">Next</button>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}
