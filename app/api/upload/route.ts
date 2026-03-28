import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePresignedUrl } from '@/lib/s3';
// OpenNext Cloudflare specific context
import { getCloudflareContext } from '@opennextjs/cloudflare';

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

    // Attempt to get environment variables from Cloudflare context, fallback to process.env for local dev
    let envVars: Record<string, string | undefined> = {};
    try {
      const { env } = getCloudflareContext();
      envVars = env as Record<string, string | undefined>;
    } catch (e) {
      // In local dev, getCloudflareContext might fail if not using the wrapper, use process.env
      envVars = process.env;
    }

    // Add a unique prefix to prevent overwriting
    const uniqueFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.\-]/g, "")}`;
    const urls = await generatePresignedUrl(`uploads/${uniqueFileName}`, contentType, envVars);

    return NextResponse.json(urls);
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
