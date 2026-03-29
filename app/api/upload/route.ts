import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { AwsClient } from 'aws4fetch';

export const dynamic = 'force-dynamic';

function getEnvFallback(key: string): string {
  try {
    const { env } = getCloudflareContext() as any;
    if (env && env[key]) {
      return env[key] as string;
    }
  } catch (e) {
  }
  return (process.env[key] as string) || '';
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Missing file payload' }, { status: 400 });
    }

    const r2AccessKeyId = getEnvFallback('R2_ACCESS_KEY_ID');
    const r2SecretAccessKey = getEnvFallback('R2_SECRET_ACCESS_KEY');
    const bucketName = getEnvFallback('R2_BUCKET_NAME');
    const publicUrlBase = getEnvFallback('R2_PUBLIC_URL');
    const endpoint = getEnvFallback('R2_ENDPOINT');

    if (!endpoint || !bucketName) {
      return NextResponse.json({ error: 'R2 Server Configuration Missing' }, { status: 500 });
    }

    const s3Client = new AwsClient({
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
      service: 's3',
      region: 'auto',
    });

    const uniqueFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, "")}`;
    
    // Normalize the endpoint. Cloudflare UI provides bucket-specific endpoints, 
    // so we must prevent duplicating the bucket name in the path.
    let baseEndpoint = endpoint.replace(/\/$/, '');
    if (!baseEndpoint.endsWith(bucketName)) {
      baseEndpoint += `/${bucketName}`;
    }
    const urlString = `${baseEndpoint}/uploads/${uniqueFileName}`;
    
    // Direct Server-to-Server upload bypassing browser CORS policies
    const fileBuffer = await file.arrayBuffer();

    const uploadRes = await s3Client.fetch(urlString, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: fileBuffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      return NextResponse.json({ error: `R2 Upload Failed: ${uploadRes.status} ${errText}` }, { status: 500 });
    }

    const publicUrl = `${publicUrlBase.replace(/\/$/, '')}/uploads/${uniqueFileName}`;

    return NextResponse.json({ publicUrl, success: true });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal failure' }, { status: 500 });
  }
}
