import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";

export default function UploadPage() {
  return (
    <DashboardShell>
      <div>
        <h1 className="text-4xl font-black">Publish new media</h1>
        <p className="mt-2 text-slate-400">Upload image or video posts and control who can unlock them.</p>
      </div>
      <Card>
        <form action="/api/posts" method="post" encType="multipart/form-data" className="grid gap-4">
          <Input name="title" placeholder="Post title" required />
          <Textarea name="description" placeholder="Describe this drop" />
          <input
            type="file"
            name="file"
            accept="image/*,video/*"
            className="block w-full rounded-2xl border border-dashed border-white/20 bg-black/20 px-4 py-6 text-sm text-slate-300"
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <select name="visibility" defaultValue="PUBLIC" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white">
              <option value="PUBLIC">Public</option>
              <option value="SUBSCRIBER_ONLY">Subscriber only</option>
              <option value="PAID">Paid unlock</option>
            </select>
            <Input name="price" type="number" min="0" step="0.01" placeholder="Unlock price (optional)" />
          </div>
          <Button type="submit">Publish post</Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
