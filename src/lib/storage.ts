import "server-only";
import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export function storageConfig() {
  // R2_ENDPOINT lets you point at any S3-compatible provider (E2E Networks, AWS S3, MinIO...).
  // Without it, Cloudflare R2's endpoint is built from R2_ACCOUNT_ID.
  const accountId = process.env.R2_ACCOUNT_ID ?? "";
  const endpoint = process.env.R2_ENDPOINT?.replace(/\/+$/, "") || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "");
  const region = process.env.R2_REGION || "auto";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "");
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) return null;
  return { endpoint, region, accessKeyId, secretAccessKey, bucket, publicUrl };
}

let client: S3Client | null = null;
function s3() {
  const cfg = storageConfig();
  if (!cfg) throw new Error("Storage is not configured");
  client ??= new S3Client({
    region: cfg.region,
    endpoint: cfg.endpoint,
    forcePathStyle: !!process.env.R2_ENDPOINT, // most non-R2 providers use path-style URLs
    credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
    // R2 does not support the SDK's default CRC checksum headers
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  return client;
}

export const publicUrlFor = (key: string) => `${storageConfig()?.publicUrl ?? ""}/${key}`;

/** Presigned PUT the browser uses to upload straight to R2 (content type and length are signed). */
export function presignUpload(key: string, contentType: string, size: number) {
  const cfg = storageConfig()!;
  return getSignedUrl(
    s3(),
    new PutObjectCommand({ Bucket: cfg.bucket, Key: key, ContentType: contentType, ContentLength: size }),
    { expiresIn: 60 * 30 },
  );
}

/** Returns the stored object's size, or null if it does not exist. */
export async function objectSize(key: string): Promise<number | null> {
  try {
    const r = await s3().send(new HeadObjectCommand({ Bucket: storageConfig()!.bucket, Key: key }));
    return r.ContentLength ?? null;
  } catch {
    return null;
  }
}

export async function deleteObjects(keys: string[]) {
  const cfg = storageConfig();
  if (!cfg) return;
  await Promise.allSettled(keys.map((Key) => s3().send(new DeleteObjectCommand({ Bucket: cfg.bucket, Key }))));
}
