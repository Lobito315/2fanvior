import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    take: 20,
    include: { profile: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <DashboardShell>
      <Card>
        <h1 className="text-3xl font-bold">User management</h1>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-4">User</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Subscription price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-4">
                    <p className="font-semibold">{user.profile?.displayName || user.username}</p>
                    <p className="text-slate-400">{user.email}</p>
                  </td>
                  <td className="py-4">{user.role}</td>
                  <td className="py-4">{user.profile?.subscriptionPrice?.toString() || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}
