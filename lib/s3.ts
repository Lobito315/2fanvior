import { AwsClient } from 'aws4fetch';

const s3Client = new AwsClient({
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  service: 's3',
  region: 'auto',
});

export const BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
export const PUBLIC_URL = process.env.R2_PUBLIC_URL || '';
const ENDPOINT = process.env.R2_ENDPOINT || '';

/**
 * Creates a presigned URL that allows a client to upload a file directly to R2.
 */
export async function generatePresignedUrl(fileName: string, contentType: string) {
  if (!ENDPOINT) {
    throw new Error('R2_ENDPOINT is not configured in Environment Variables');
  }
  if (!BUCKET_NAME) {
    throw new Error('R2_BUCKET_NAME is not configured in Environment Variables');
  }

  // Construct the target URL correctly for Cloudflare R2
  // Usually the endpoint has no trailing slash, so we append /bucket-name/fileName
  const urlString = `${ENDPOINT.replace(/\/$/, '')}/${BUCKET_NAME}/${fileName}`;
  
  let url;
  try {
    url = new URL(urlString);
  } catch (error) {
    throw new Error(`Invalid R2_ENDPOINT format. Expected an HTTP/HTTPS URL, got: ${ENDPOINT}`);
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
  const publicUrl = `${PUBLIC_URL}/${fileName}`;

  return { uploadUrl, publicUrl };
}
