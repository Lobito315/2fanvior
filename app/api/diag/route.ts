import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const dynamic = 'force-dynamic';

export async function GET() {
  let cfEnvKeys: string[] = [];
  let processEnvKeys: string[] = [];
  let R2_BUCKET_NAME_PROCESS = typeof process.env.R2_BUCKET_NAME;
  let R2_BUCKET_NAME_CF = 'not-checked';

  try {
    const { env } = getCloudflareContext() as any;
    if (env) {
      cfEnvKeys = Object.keys(env);
      R2_BUCKET_NAME_CF = typeof env.R2_BUCKET_NAME;
    }
  } catch (e: any) {
    cfEnvKeys = ['ERROR: ' + e.message];
  }

  processEnvKeys = Object.keys(process.env);

  return NextResponse.json({
    R2_BUCKET_NAME_PROCESS,
    R2_BUCKET_NAME_CF,
    processEnvKeys,
    cfEnvKeys,
    cloudFlareContextAvailable: !!getCloudflareContext
  });
}
