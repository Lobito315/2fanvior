import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PostDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { id: slug },
    include: {
      author: { include: { profile: true } }
    }
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="shell py-16">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <h1 className="text-4xl font-black">{post.title}</h1>
          <p className="mt-4 text-slate-300">{post.description}</p>
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
            {post.mediaType === "VIDEO" ? (
              <video src={post.mediaUrl} controls className="w-full" />
            ) : (
              <img src={post.mediaUrl} alt={post.title} className="w-full object-cover" />
            )}
          </div>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Creator</p>
          <p className="mt-2 text-2xl font-bold">{post.author.profile?.displayName || post.author.username}</p>
          <p className="mt-3 text-sm text-slate-300">{post.author.profile?.bio}</p>
        </Card>
      </div>
    </main>
  );
}
