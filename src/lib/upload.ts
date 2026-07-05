import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function uploadImage(
  file: File,
  bucket: string,
  folder: string = ""
): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const name = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(name, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(name);
  return data.publicUrl;
}

export async function uploadMultipleImages(
  files: File[],
  bucket: string,
  folder: string = ""
): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const url = await uploadImage(file, bucket, folder);
    if (url) urls.push(url);
  }
  return urls;
}

export async function deleteImage(url: string, bucket: string): Promise<void> {
  const path = url.split(`${bucket}/`).pop();
  if (path) {
    await supabase.storage.from(bucket).remove([path]);
  }
}
