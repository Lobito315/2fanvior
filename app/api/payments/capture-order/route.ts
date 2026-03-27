import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { capturePayPalOrder } from '@/lib/paypal';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json() as { orderId: string, postId: string };
    const { orderId, postId } = body;

    if (!orderId || !postId) {
      return NextResponse.json({ error: 'Missing orderId or postId' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    // 1. Capture PayPal payment
    const captureData = await capturePayPalOrder(orderId) as any;
    
    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Payment not completed', details: captureData }, { status: 400 });
    }

    // 2. Register success and unlock content
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        postId: postId,
        amount: post.price,
        currency: 'USD',
        type: 'UNLOCK_POST',
        status: 'COMPLETED',
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Payment captured and content unlocked',
      paymentId: payment.id 
    });

  } catch (error: any) {
    console.error('Capture PayPal Order Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
