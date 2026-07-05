const { createClient } = require("@supabase/supabase-js");
const https = require("https");

const supabase = createClient(
  "https://srmgovjwphjcjtcynuwe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybWdvdmp3cGhqY2p0Y3ludXdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA4OTQ1MSwiZXhwIjoyMDk4NjY1NDUxfQ.PJdzHQ5-qmrk4rR5pARtSCK3qW80EfoQHYX9iHi1I8w"
);

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", "Accept": "image/webp,image/apng,image/*,*/*;q=0.8" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

const remaining = {
  "fresh-onions": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop&q=80",
  "pepsi-1-5l": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop&q=80",
};

async function main() {
  for (const [slug, url] of Object.entries(remaining)) {
    try {
      const buffer = await downloadImage(url);
      if (buffer.length < 1000) { console.log(`SKIP ${slug}: too small`); continue; }
      console.log(`${slug}: ${(buffer.length / 1024).toFixed(0)}KB`);
      const path = `${slug}.jpg`;
      const { error } = await supabase.storage.from("products").upload(path, buffer, { contentType: "image/jpeg", upsert: true });
      if (error) { console.error(`  Upload error: ${error.message}`); continue; }
      const { data } = supabase.storage.from("products").getPublicUrl(path);
      const { error: uErr } = await supabase.from("products").update({ images: [data.publicUrl] }).eq("slug", slug);
      if (uErr) console.error(`  DB error: ${uErr.message}`);
      else console.log(`  Done -> ${data.publicUrl}`);
    } catch (err) { console.error(`  FAIL ${slug}: ${err.message}`); }
  }
}

main();
