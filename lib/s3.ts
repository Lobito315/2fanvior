import { AwsClient } from 'aws4fetch';

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

  const s3Client = new AwsClient({
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
    service: 's3',
    region: 'auto',
  });

  // Construct the target URL correctly for Cloudflare R2
  const urlString = `${endpoint.replace(/\/$/, '')}/${bucketName}/${fileName}`;
  
  let url;
  try {
    url = new URL(urlString);
  } catch (error) {
    throw new Error(`Invalid R2_ENDPOINT format. Expected an HTTP/HTTPS URL, got: ${endpoint}`);
  }

  // Sign the request to create a presigned query URL (signQuery: true)
  // Enforce UNSIGNED-PAYLOAD to bypass S3 body hashing, which generates 403 Forbidden on uploads
  const signedRequest = await s3Client.sign(url.toString(), {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'X-Amz-Content-Sha256': 'UNSIGNED-PAYLOAD'
    },
    aws: { signQuery: true }
  });

  const uploadUrl = signedRequest.url;
  const publicUrl = `${publicUrlBase.replace(/\/$/, '')}/${fileName}`;

  return { uploadUrl, publicUrl };
}
