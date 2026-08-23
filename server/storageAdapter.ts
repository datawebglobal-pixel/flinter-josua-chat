import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { storagePut } from "./storage";

function selfHostedClient() {
  if (!process.env.S3_BUCKET || !process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) return null;
  return new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  });
}

export async function putMediaFile(key: string, body: Buffer, contentType: string) {
  const client = selfHostedClient();
  const bucket = process.env.S3_BUCKET;
  if (!client || !bucket) return storagePut(key, body, contentType);
  await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
  const base = process.env.PUBLIC_STORAGE_URL?.replace(/\/$/, "");
  if (!base) throw new Error("PUBLIC_STORAGE_URL wajib diisi saat memakai storage S3 mandiri.");
  return { key, url: `${base}/${key.split("/").map(encodeURIComponent).join("/")}` };
}
