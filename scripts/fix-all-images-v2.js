const { createClient } = require("@supabase/supabase-js");
const https = require("https");
const http = require("http");

const supabase = createClient(
  "https://srmgovjwphjcjtcynuwe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybWdvdmp3cGhqY2p0Y3ludXdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA4OTQ1MSwiZXhwIjoyMDk4NjY1NDUxfQ.PJdzHQ5-qmrk4rR5pARtSCK3qW80EfoQHYX9iHi1I8w"
);

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const options = { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", "Accept": "image/webp,image/apng,image/*,*/*;q=0.8" } };
    mod.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

// Use Unsplash source which allows direct linking
const productImages = {
  "fresh-beef": "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=600&fit=crop&q=80",
  "fresh-apples": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop&q=80",
  "sooper-cookies": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop&q=80",
  "fresh-onions": "https://images.unsplash.com/photo-1618512496248-a07fe8398f57?w=600&h=600&fit=crop&q=80",
  "fresh-eggs": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=600&fit=crop&q=80",
  "fresh-mangoes": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=600&fit=crop&q=80",
  "fresh-chicken": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&h=600&fit=crop&q=80",
  "pepsi-1-5l": "https://images.unsplash.com/photo-1629203851122-3770f0e5e51e?w=600&h=600&fit=crop&q=80",
  "olpers-milk": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=600&fit=crop&q=80",
  "dawn-bread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop&q=80",
};

async function main() {
  // Fix background - use UPDATE not upsert
  const latestBgUrl = "https://srmgovjwphjcjtcynuwe.supabase.co/storage/v1/object/public/banners/hero-bg-1783163962140.png";
  const { error: bgErr } = await supabase.from("settings").update({ value: latestBgUrl }).eq("key", "heroBgImage");
  if (bgErr) console.error("BG update error:", bgErr);
  else console.log("Background updated to latest:", latestBgUrl);

  console.log("\nUploading real product images...\n");

  for (const [slug, url] of Object.entries(productImages)) {
    try {
      const buffer = await downloadImage(url);
      if (buffer.length < 1000) {
        console.log(`SKIP ${slug}: too small (${buffer.length} bytes)`);
        continue;
      }
      console.log(`${slug}: ${(buffer.length / 1024).toFixed(0)}KB`);

      const path = `${slug}.jpg`;
      const { error } = await supabase.storage
        .from("products")
        .upload(path, buffer, { contentType: "image/jpeg", upsert: true });

      if (error) {
        console.error(`  Upload error: ${error.message}`);
        continue;
      }

      const { data } = supabase.storage.from("products").getPublicUrl(path);
      const { error: updateErr } = await supabase.from("products").update({ images: [data.publicUrl] }).eq("slug", slug);
      if (updateErr) console.error(`  DB update error: ${updateErr.message}`);
      else console.log(`  Done -> ${data.publicUrl}`);
    } catch (err) {
      console.error(`  FAIL ${slug}: ${err.message}`);
    }
  }

  console.log("\nAll done!");
}

main();
