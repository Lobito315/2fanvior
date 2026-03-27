import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createPayPalOrder } from '@/lib/paypal';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json() as { postId: string };
    const { postId } = body;
    
    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || !post.isLocked) {
      return NextResponse.json({ error: 'Post not found or not for sale' }, { status: 404 });
    }

    // Create real PayPal order
    const paypalOrder = await createPayPalOrder(post.price, "USD");

    return NextResponse.json({ 
      orderId: paypalOrder.id,
      status: paypalOrder.status
    });

  } catch (error: any) {
    console.error('Create PayPal Order Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
