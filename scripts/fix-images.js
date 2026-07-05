const { createClient } = require("@supabase/supabase-js");
const https = require("https");

const supabase = createClient(
  "https://srmgovjwphjcjtcynuwe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybWdvdmp3cGhqY2p0Y3ludXdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA4OTQ1MSwiZXhwIjoyMDk4NjY1NDUxfQ.PJdzHQ5-qmrk4rR5pARtSCK3qW80EfoQHYX9iHi1I8w"
);

// Real working Unsplash photo URLs
const productImages = {
  "fresh-potatoes": "https://images.unsplash.com/photo-1508313880080-c4bef0e3e846?w=600&h=600&fit=crop&q=80",
  "fresh-tomatoes": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=600&fit=crop&q=80",
  "fresh-onions": "https://images.unsplash.com/photo-1618512496248-a07fe8398f57?w=600&h=600&fit=crop&q=80",
  "fresh-chicken": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&h=600&fit=crop&q=80",
  "pepsi-1-5l": "https://images.unsplash.com/photo-1629203851122-3770f0e5e51e?w=600&h=600&fit=crop&q=80",
  "dalda-oil": "https://images.unsplash.com/photo-1474979266404-7f28f3f28030?w=600&h=600&fit=crop&q=80",
  "sugar": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop&q=80",
};

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function main() {
  console.log("Re-uploading failed product images...\n");

  for (const [slug, url] of Object.entries(productImages)) {
    try {
      console.log(`${slug}: downloading...`);
      const buffer = await downloadImage(url);
      if (buffer.length < 1000) {
        console.log(`  SKIP: too small (${buffer.length} bytes)`);
        continue;
      }
      console.log(`  Downloaded: ${(buffer.length / 1024).toFixed(1)}KB`);

      // Upload with correct path (no double products/)
      const path = `${slug}.jpg`;
      const { error } = await supabase.storage
        .from("products")
        .upload(path, buffer, { contentType: "image/jpeg", upsert: true });

      if (error) {
        console.error(`  Upload error:`, error.message);
        continue;
      }

      const { data } = supabase.storage.from("products").getPublicUrl(path);
      const publicUrl = data.publicUrl;
      console.log(`  URL: ${publicUrl}`);

      // Update DB
      const { error: dbErr } = await supabase
        .from("products")
        .update({ images: [publicUrl] })
        .eq("slug", slug);

      if (dbErr) console.error(`  DB error:`, dbErr.message);
      else console.log(`  Updated in DB\n`);
    } catch (err) {
      console.error(`  Failed: ${err.message}\n`);
    }
  }

  // Also fix all products that still have old broken paths
  console.log("\nFixing existing broken image paths...");
  const { data: products } = await supabase.from("products").select("id, slug, images");
  if (products) {
    for (const p of products) {
      if (p.images && p.images[0] && p.images[0].includes("products/products/")) {
        const newPath = `${p.slug}.jpg`;
        const { data: urlData } = supabase.storage.from("products").getPublicUrl(newPath);
        if (urlData) {
          await supabase.from("products").update({ images: [urlData.publicUrl] }).eq("id", p.id);
          console.log(`  Fixed: ${p.slug} -> ${urlData.publicUrl}`);
        }
      }
    }
  }

  console.log("\nDone!");
}

main();
