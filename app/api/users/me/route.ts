import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  
  // Exclude passwordHash from the response
  const { passwordHash, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  handle: z.string().min(3, "Handle must be at least 3 characters").optional(),
  bio: z.string().max(160, "Bio cannot exceed 160 characters").optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional().or(z.literal(''))
});

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const result = updateProfileSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, handle, bio, avatar } = result.data;
    const userId = (session.user as any).id;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, handle, bio, avatar: avatar || null }
    });
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
