export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json() as { orderId: string, postId: string, amount: string };
    const { orderId, postId, amount } = body;

    // Register the successful payment and unlock the post for this user
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        postId: postId,
        amount: parseFloat(amount),
        currency: 'USD',
        type: 'UNLOCK',
        status: 'COMPLETED',
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Payment captured and content unlocked',
      paymentId: payment.id 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
