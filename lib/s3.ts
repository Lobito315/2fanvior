import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Creates a presigned URL that allows a client to upload a file directly to R2.
 */
export async function generatePresignedUrl(
  fileName: string, 
  contentType: string, 
  envVariables: Record<string, string | undefined>
) {
  const r2AccessKeyId = envVariables.R2_ACCESS_KEY_ID || '';
  const r2SecretAccessKey = envVariables.R2_SECRET_ACCESS_KEY || '';
  const bucketName = envVariables.R2_BUCKET_NAME || '';
  const publicUrlBase = envVariables.R2_PUBLIC_URL || '';
  const endpoint = envVariables.R2_ENDPOINT || '';

  if (!endpoint) {
    throw new Error('R2_ENDPOINT is not configured (received empty)');
  }
  if (!bucketName) {
    throw new Error(`R2_BUCKET_NAME is not configured (received empty)`);
  }

  // Use official AWS SDK to handle robust S3/R2 presigning without hash mismatches
  const s3Client = new S3Client({
    region: 'auto',
    endpoint: endpoint.replace(/\/$/, ''),
    credentials: {
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
    },
  });

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    ContentType: contentType,
  });

  // Generate URL valid for 1 hour, safely bypassing explicit payload hash enforcing
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = `${publicUrlBase.replace(/\/$/, '')}/${fileName}`;

  return { uploadUrl, publicUrl };
}
