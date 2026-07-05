const { createClient } = require("@supabase/supabase-js");
const https = require("https");

const supabase = createClient(
  "https://srmgovjwphjcjtcynuwe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybWdvdmp3cGhqY2p0Y3ludXdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA4OTQ1MSwiZXhwIjoyMDk4NjY1NDUxfQ.PJdzHQ5-qmrk4rR5pARtSCK3qW80EfoQHYX9iHi1I8w"
);

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const options = { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } };
    https.get(url, options, (res) => {
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

// Real working image URLs for Pakistani grocery products
const productImages = {
  "fresh-beef": "https://cdn.pixabay.com/photo/2016/11/17/17/43/beef-1833881_640.jpg",
  "fresh-apples": "https://cdn.pixabay.com/photo/2016/12/03/19/34/apple-1886098_640.jpg",
  "sooper-cookies": "https://cdn.pixabay.com/photo/2020/08/16/09/28/cookies-5492320_640.jpg",
  "fresh-onions": "https://cdn.pixabay.com/photo/2017/02/15/12/12/onions-2068846_640.jpg",
  "fresh-eggs": "https://cdn.pixabay.com/photo/2016/07/07/16/33/eggs-1504758_640.jpg",
  "fresh-mangoes": "https://cdn.pixabay.com/photo/2017/06/02/09/56/mango-2367594_640.jpg",
  "fresh-chicken": "https://cdn.pixabay.com/photo/2014/10/23/19/22/chicken-499148_640.jpg",
  "pepsi-1-5l": "https://cdn.pixabay.com/photo/2019/11/14/12/29/pepsi-4626858_640.jpg",
  "olpers-milk": "https://cdn.pixabay.com/photo/2016/08/16/08/55/milk-1597853_640.jpg",
  "dawn-bread": "https://cdn.pixabay.com/photo/2017/04/04/18/07/bread-2203597_640.jpg",
};

async function main() {
  console.log("Fixing background image to latest upload...\n");

  // Update heroBgImage to the latest uploaded image
  const latestBgUrl = "https://srmgovjwphjcjtcynuwe.supabase.co/storage/v1/object/public/banners/hero-bg-1783163962140.png";
  const { error: bgErr } = await supabase.from("settings").upsert({ key: "heroBgImage", value: latestBgUrl });
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
