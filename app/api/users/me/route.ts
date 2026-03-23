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

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as any;
  const { name, handle, bio, avatar } = body;
  const userId = (session.user as any).id;
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, handle, bio, avatar }
    });
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
