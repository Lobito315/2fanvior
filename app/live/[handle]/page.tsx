import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import LiveStreamView from "@/components/video/LiveStreamView";
import { Metadata } from "next";

interface Props {
  params: { handle: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: { handle: params.handle },
  });

  if (!user) return { title: "Stream not found" };

  return {
    title: `Live Stream - ${user.name} | Fanvior`,
    description: `Watch ${user.name} streaming live on Fanvior.`,
  };
}

export default async function CreatorLivePage({ params }: Props) {
  const user = await prisma.user.findUnique({
    where: { handle: params.handle },
  });

  if (!user) {
    notFound();
  }

  return (
    <LiveStreamView 
        creatorHandle={user.handle}
        creatorName={user.name}
        creatorId={user.id}
    />
  );
}
