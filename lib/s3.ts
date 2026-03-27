import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || "", 
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export const BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
export const PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

/**
 * Creates a presigned URL that allows a client to upload a file directly to R2.
 */
export async function generatePresignedUrl(fileName: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = `${PUBLIC_URL}/${fileName}`;

  return { uploadUrl, publicUrl };
}
