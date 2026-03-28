import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePresignedUrl } from '@/lib/s3';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const dynamic = 'force-dynamic';

function getEnvFallback(key: string): string {
  try {
    const { env } = getCloudflareContext() as any;
    if (env && env[key]) {
      return env[key] as string;
    }
  } catch (e) {
    // getCloudflareContext might throw in local dev or specific runtimes
  }
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

    // Explicitly read each variable to avoid Proxy spread issues {...env}
    const envVars = {
      R2_ACCESS_KEY_ID: getEnvFallback('R2_ACCESS_KEY_ID'),
      R2_SECRET_ACCESS_KEY: getEnvFallback('R2_SECRET_ACCESS_KEY'),
      R2_BUCKET_NAME: getEnvFallback('R2_BUCKET_NAME'),
      R2_PUBLIC_URL: getEnvFallback('R2_PUBLIC_URL'),
      R2_ENDPOINT: getEnvFallback('R2_ENDPOINT'),
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
