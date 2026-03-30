import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createPayPalOrder, capturePayPalOrder } from '@/lib/paypal';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();

    // --- CREATE ORDER ACTION ---
    if (action === 'create-order') {
      const { postId, amount, type } = body as { postId?: string; amount?: number; type?: string };

      // TIP flow
      if (type === 'TIP') {
        if (!amount || amount <= 0) {
          return NextResponse.json({ error: 'Invalid tip amount' }, { status: 400 });
        }
        const paypalOrder = await createPayPalOrder(amount, 'USD');
        return NextResponse.json({ orderId: paypalOrder.id, status: paypalOrder.status });
      }

      // UNLOCK flow
      if (!postId) {
        return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
      }

      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (!post || !post.isLocked) {
        return NextResponse.json({ error: 'Post not found or not for sale' }, { status: 404 });
      }

      const paypalOrder = await createPayPalOrder(post.price, 'USD');
      return NextResponse.json({ orderId: paypalOrder.id, status: paypalOrder.status });
    }

    // --- CAPTURE ORDER ACTION ---
    if (action === 'capture-order') {
      const { orderId, postId, amount, type } = body as { orderId: string; postId?: string; amount?: string; type?: string };

      if (!orderId) {
        return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
      }

      const captureData = await capturePayPalOrder(orderId) as any;
      if (captureData.status !== 'COMPLETED') {
        return NextResponse.json({ error: 'Payment not completed', details: captureData }, { status: 400 });
      }

      const capturedAmount = parseFloat(
        captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value ?? amount ?? '0'
      );

      // Save payment based on type
      if (type === 'TIP') {
        const payment = await prisma.payment.create({
          data: {
            userId: user.id,
            postId: postId ?? null,
            amount: capturedAmount,
            currency: 'USD',
            type: 'TIP',
            status: 'COMPLETED',
          }
        });
        return NextResponse.json({ success: true, message: 'Tip sent!', paymentId: payment.id });
      } else {
        // Assume UNLOCK if not tip
        if (!postId) return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

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
        return NextResponse.json({ success: true, message: 'Content unlocked!', paymentId: payment.id });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Payment API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
