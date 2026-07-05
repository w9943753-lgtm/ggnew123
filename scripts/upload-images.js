const { createClient } = require("@supabase/supabase-js");
const https = require("https");
const http = require("http");
const path = require("path");

const supabase = createClient(
  "https://srmgovjwphjcjtcynuwe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybWdvdmp3cGhqY2p0Y3ludXdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA4OTQ1MSwiZXhwIjoyMDk4NjY1NDUxfQ.PJdzHQ5-qmrk4rR5pARtSCK3qW80EfoQHYX9iHi1I8w"
);

// Product slug -> Unsplash search query (free to use images)
const productImages = {
  "fresh-potatoes": "https://images.unsplash.com/photo-1518977676601-b53f82ber500?w=600&h=600&fit=crop",
  "fresh-tomatoes": "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=600&h=600&fit=crop",
  "fresh-onions": "https://images.unsplash.com/photo-1618512496248-a07fe8398f57?w=600&h=600&fit=crop",
  "fresh-bananas": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop",
  "fresh-apples": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop",
  "fresh-mangoes": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=600&fit=crop",
  "fresh-chicken": "https://images.unsplash.com/photo-1604503468506-a8da13d82571?w=600&h=600&fit=crop",
  "fresh-beef": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop",
  "fresh-mutton": "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=600&fit=crop",
  "olpers-milk": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=600&fit=crop",
  "fresh-eggs": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=600&fit=crop",
  "dawn-bread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop",
  "sooper-cookies": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop",
  "coca-cola-1-5l": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=600&fit=crop",
  "pepsi-1-5l": "https://images.unsplash.com/photo-1629203851122-3770f0e5e51e?w=600&h=600&fit=crop",
  "aquafina-water": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=600&fit=crop",
  "shan-biryani-masala": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop",
  "dalda-oil": "https://images.unsplash.com/photo-1474979266404-7f28f3f28030?w=600&h=600&fit=crop",
  "basmati-rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop",
  "sugar": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop",
  "tapal-danedar": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop",
  "lipton-tea": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop",
  "maida-flour": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop",
  "knorr-cubes": "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600&h=600&fit=crop",
  "surf-excel": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
  "ariel": "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&h=600&fit=crop",
  "lifebuoy-handwash": "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600&h=600&fit=crop",
  "lux-soap": "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&h=600&fit=crop",
  "dettol-soap": "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600&h=600&fit=crop",
  "lays-chips": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&h=600&fit=crop",
  "mamypoko": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop",
  "panadol": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop",
};

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
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

async function uploadToStorage(slug, buffer) {
  const ext = "jpg";
  const path = `products/${slug}.${ext}`;
  
  const { error } = await supabase.storage
    .from("products")
    .upload(path, buffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.error(`  Upload error for ${slug}:`, error.message);
    return null;
  }

  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return data.publicUrl;
}

async function main() {
  console.log("Starting product image upload...\n");

  for (const [slug, imageUrl] of Object.entries(productImages)) {
    try {
      console.log(`Processing: ${slug}`);
      
      // Download
      const buffer = await downloadImage(imageUrl);
      console.log(`  Downloaded: ${(buffer.length / 1024).toFixed(1)}KB`);

      // Upload to Supabase Storage
      const publicUrl = await uploadToStorage(slug, buffer);
      if (!publicUrl) continue;
      console.log(`  Uploaded: ${publicUrl}`);

      // Update product in database
      const { error } = await supabase
        .from("products")
        .update({ images: [publicUrl] })
        .eq("slug", slug);

      if (error) {
        console.error(`  DB update error:`, error.message);
      } else {
        console.log(`  Updated in DB\n`);
      }
    } catch (err) {
      console.error(`  Failed: ${err.message}\n`);
    }
  }

  console.log("Done! All product images uploaded.");
}

main();
