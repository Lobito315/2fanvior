import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: params.postId },
      include: {
        user: { select: { name: true, handle: true, avatar: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(comments);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json() as { content?: string };
    const { content } = body;
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        postId: params.postId,
        content: content.trim(),
      },
      include: {
        user: { select: { name: true, handle: true, avatar: true } },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    console.error('Comment Error:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
