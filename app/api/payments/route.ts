export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import { z } from "zod";

const paymentSchema = z.object({
  targetUserId: z.string().min(1, "Target User ID is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  type: z.enum(["TIP", "UNLOCK", "SUBSCRIPTION"]),
  paymentMethodId: z.string().optional(),
  subscriptionId: z.string().optional()
});

// POST: Initialize a payment (Tip, Unlock, or Subscribe)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const result = paymentSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() }, 
        { status: 400 }
      );
    }
    
    const { targetUserId, amount, type, paymentMethodId, subscriptionId } = result.data;

    // Record the pending payment in database
    const payment = await prisma.payment.create({
      data: {
        userId: user.id, // The person paying
        amount: amount,
        currency: 'USD',
        type: type,
        status: 'PENDING',
      }
    });

    // In a real application, you would generate a PayPal Order ID here 
    // using the @paypal/checkout-server-sdk and return it to the frontend.
    // For now, we simulate success and return our internal payment record.

    return NextResponse.json({ 
      success: true, 
      paymentId: payment.id,
      message: "Payment initialized. Await PayPal confirmation." 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to process payment', details: error.message }, { status: 500 });
  }
}

// PATCH: Webhook / Confirm payment success
export async function PATCH(req: Request) {
   // Logic to confirm PayPal capture ID and update Payment status to COMPLETED
   // and apply the corresponding Subscription or Content unlock logic
   return NextResponse.json({ success: true });
}
