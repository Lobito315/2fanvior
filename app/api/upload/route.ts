import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePresignedUrl } from '@/lib/s3';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as { fileName: string, contentType: string };
    const { fileName, contentType } = body;

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'Missing fileName or contentType' }, { status: 400 });
    }

    // Add a unique prefix to prevent overwriting
    const uniqueFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.\-]/g, "")}`;
    const urls = await generatePresignedUrl(`uploads/${uniqueFileName}`, contentType);

    return NextResponse.json(urls);
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
