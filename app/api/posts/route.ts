export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


// GET: Fetch all visible posts
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const posts = await prisma.post.findMany({
      include: { 
        creator: { 
          select: { name: true, handle: true, avatar: true } 
        } 
      },
      orderBy: { createdAt: 'desc' },
    });

    // If user is logged in, mark which posts they have access to
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (user) {
        const userPayments = await prisma.payment.findMany({
          where: { userId: user.id, status: 'COMPLETED' },
          select: { postId: true }
        }) as any[];
        
        const unlockedPostIds = new Set(userPayments.map(p => p.postId).filter(Boolean));
        
        const processedPosts = posts.map(post => ({
          ...post,
          isLocked: post.isLocked && !unlockedPostIds.has(post.id) && post.creatorId !== user.id,
          hasAccess: !post.isLocked || unlockedPostIds.has(post.id) || post.creatorId === user.id
        }));
        
        return NextResponse.json(processedPosts);
      }
    }

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

import { z } from "zod";

const postSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  mediaUrl: z.string().url().optional().or(z.literal('')),
  mediaType: z.string().optional(),
  isLocked: z.boolean().optional().default(false),
  price: z.number().nonnegative().optional().default(0),
  tags: z.array(z.string()).optional().default([]),
  schedulePublish: z.string().datetime().optional().nullable(),
}).refine(data => data.mediaUrl || data.content, {
  message: "Media URL or content is required",
  path: ["content"]
});

// POST: Create a new post (Requires authentication)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });

    // In a real app, only creators might be allowed to post.
    if (user.role !== 'CREATOR' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only approved creators can publish posts.' }, { status: 403 });
    }

    const body = await req.json();
    const result = postSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() }, 
        { status: 400 }
      );
    }

    const { title, description, content, mediaUrl, mediaType, isLocked, price, tags, schedulePublish } = result.data;

    const post = await prisma.post.create({
      data: {
        title: title || "",
        description,
        content,
        mediaUrl: mediaUrl || null,
        mediaType,
        isLocked,
        price,
        tags: JSON.stringify(tags),
        schedulePublish: schedulePublish ? new Date(schedulePublish) : null,
        creatorId: user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to publish post', details: error.message }, { status: 500 });
  }
}
