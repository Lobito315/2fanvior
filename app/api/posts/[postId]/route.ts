import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = params;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if post exists and if user is owner or admin
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { creatorId: true }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.creatorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete post and its related data (likes, comments)
    // Payments are kept for record keeping (postId becomes null if not cascaded, 
    // but Prisma relation needs to be handled if not optional)
    await prisma.$transaction([
      prisma.like.deleteMany({ where: { postId: postId } }),
      prisma.comment.deleteMany({ where: { postId: postId } }),
      prisma.post.delete({ where: { id: postId } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: 'Failed to delete post', details: error.message }, { status: 500 });
  }
}
