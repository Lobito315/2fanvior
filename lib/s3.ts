import { AwsClient } from 'aws4fetch';

/**
 * Creates a presigned URL that allows a client to upload a file directly to R2.
 */
export async function generatePresignedUrl(fileName: string, contentType: string) {
  // Read variables inside the function to ensure they are evaluated dynamically 
  // at runtime under Cloudflare Edge, not statically at module load time.
  const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID || '';
  const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
  const bucketName = process.env.R2_BUCKET_NAME || '';
  const publicUrlBase = process.env.R2_PUBLIC_URL || '';
  const endpoint = process.env.R2_ENDPOINT || '';

  if (!endpoint) {
    throw new Error('R2_ENDPOINT is not configured in Environment Variables');
  }
  if (!bucketName) {
    throw new Error('R2_BUCKET_NAME is not configured in Environment Variables');
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
  const signedRequest = await s3Client.sign(url.toString(), {
    method: 'PUT',
    headers: {
      'Content-Type': contentType
    },
    aws: { signQuery: true }
  });

  const uploadUrl = signedRequest.url;
  const publicUrl = `${publicUrlBase.replace(/\/$/, '')}/${fileName}`;

  return { uploadUrl, publicUrl };
}
