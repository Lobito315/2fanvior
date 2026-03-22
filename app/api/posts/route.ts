import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// GET: Fetch all visible posts
export async function GET(req: Request) {
  try {
    const posts = await prisma.post.findMany({
      include: { 
        creator: { 
          select: { name: true, handle: true, avatar: true } 
        } 
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST: Create a new post (Requires authentication)
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });

    // In a real app, only creators might be allowed to post.
    if (user.role !== 'CREATOR' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only approved creators can publish posts.' }, { status: 403 });
    }

    const body = (await req.json()) as any;
    const { title, description, content, mediaUrl, mediaType, isLocked, price, tags, schedulePublish } = body;

    if (!mediaUrl && !content) {
      return NextResponse.json({ error: 'Media URL or content is required.' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        description,
        content,
        mediaUrl,
        mediaType,
        isLocked: isLocked || false,
        price: price || 0,
        tags: tags || [],
        schedulePublish: schedulePublish ? new Date(schedulePublish) : null,
        creatorId: user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to publish post' }, { status: 500 });
  }
}
