import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// GET: Fetch user profile (authenticated) or public profile via query param ?handle=xyz
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const handle = searchParams.get('handle');

    if (handle) {
      // Public profile fetch
      const user = await prisma.user.findUnique({
        where: { handle },
        select: {
          id: true,
          name: true,
          handle: true,
          avatar: true,
          bio: true,
          role: true,
          subscriptionPrice: true,
          posts: {
            // Only return posts logic depending on viewer's subscription status would go here
            // For now, return basic info
            take: 10,
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      return NextResponse.json(user);
    }

    // Authenticated profile fetch
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: true, // Subscriptions this user has bought
        subscribers: true,   // Subscribers paying this creator
      }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    
    // Do not return password hash
    const { passwordHash, ...safeUser } = user;
    return NextResponse.json(safeUser);
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
