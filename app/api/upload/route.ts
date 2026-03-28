import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePresignedUrl } from '@/lib/s3';

// Helper to reliably retrieve env vars avoiding Next.js static substitution during build
function getEnvSafe(key: string): string {
  // Using dynamic property access so Webpack doesn't inline undefined at build time
  return (process.env[key] as string) || '';
}

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

    // Collect variables natively bypassing the faulty getCloudflareContext which might be empty
    const envVars = {
      R2_ACCESS_KEY_ID: getEnvSafe('R2_ACCESS_KEY_ID'),
      R2_SECRET_ACCESS_KEY: getEnvSafe('R2_SECRET_ACCESS_KEY'),
      R2_BUCKET_NAME: getEnvSafe('R2_BUCKET_NAME'),
      R2_PUBLIC_URL: getEnvSafe('R2_PUBLIC_URL'),
      R2_ENDPOINT: getEnvSafe('R2_ENDPOINT'),
    };

    // Add a unique prefix to prevent overwriting
    const uniqueFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.\-]/g, "")}`;
    const urls = await generatePresignedUrl(`uploads/${uniqueFileName}`, contentType, envVars);

    return NextResponse.json(urls);
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
