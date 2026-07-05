const { createClient } = require("@supabase/supabase-js");
const https = require("https");

const supabase = createClient(
  "https://srmgovjwphjcjtcynuwe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybWdvdmp3cGhqY2p0Y3ludXdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA4OTQ1MSwiZXhwIjoyMDk4NjY1NDUxfQ.PJdzHQ5-qmrk4rR5pARtSCK3qW80EfoQHYX9iHi1I8w"
);

// Working Unsplash photo IDs
const fixImages = {
  "fresh-potatoes": "https://images.unsplash.com/photo-1508313880080-c4bef0e3e846?w=600&h=600&fit=crop&q=80",
  "fresh-onions": "https://images.unsplash.com/photo-1618512496248-a07fe8398f57?w=600&h=600&fit=crop&q=80",
  "pepsi-1-5l": "https://images.unsplash.com/photo-1629203851122-3770f0e5e51e?w=600&h=600&fit=crop&q=80",
  "dalda-oil": "https://images.unsplash.com/photo-1474979266404-7f28f3f28030?w=600&h=600&fit=crop&q=80",
  "sugar": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop&q=80",
  "fresh-chicken": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&h=600&fit=crop&q=80",
  "fresh-potatoes": "https://images.unsplash.com/photo-1518977676601-b53f82ber500?w=600&h=600&fit=crop&q=80",
};

// Use Pixabay CDN which is more reliable
const pixabayImages = {
  "fresh-potatoes": "https://cdn.pixabay.com/photo/2016/01/05/13/58/potatoes-1121698_640.jpg",
  "fresh-onions": "https://cdn.pixabay.com/photo/2017/02/15/12/12/onions-2068846_640.jpg",
  "pepsi-1-5l": "https://cdn.pixabay.com/photo/2019/11/14/12/29/pepsi-4626858_640.jpg",
  "dalda-oil": "https://cdn.pixabay.com/photo/2017/01/11/11/33/cake-1971552_640.jpg",
  "sugar": "https://cdn.pixabay.com/photo/2017/04/17/15/49/sugar-2238423_640.jpg",
  "fresh-chicken": "https://cdn.pixabay.com/photo/2014/10/23/19/22/chicken-499148_640.jpg",
  "fresh-tomatoes": "https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834559_640.jpg",
  "fresh-apples": "https://cdn.pixabay.com/photo/2016/12/03/19/34/apple-1886098_640.jpg",
  "fresh-mangoes": "https://cdn.pixabay.com/photo/2017/06/02/09/56/mango-2367594_640.jpg",
  "fresh-eggs": "https://cdn.pixabay.com/photo/2016/07/07/16/33/eggs-1504758_640.jpg",
  "olpers-milk": "https://cdn.pixabay.com/photo/2016/08/16/08/55/milk-1597853_640.jpg",
  "dawn-bread": "https://cdn.pixabay.com/photo/2017/04/04/18/07/bread-2203597_640.jpg",
  "sooper-cookies": "https://cdn.pixabay.com/photo/2015/05/13/22/43/biscuits-765420_640.jpg",
  "coca-cola-1-5l": "https://cdn.pixabay.com/photo/2019/11/14/12/31/pepsi-4626743_640.jpg",
  "aquafina-water": "https://cdn.pixabay.com/photo/2014/09/13/18/23/bottle-444542_640.jpg",
  "shan-biryani-masala": "https://cdn.pixabay.com/photo/2016/11/13/18/45/spices-1820115_640.jpg",
  "basmati-rice": "https://cdn.pixabay.com/photo/2017/01/11/11/33/rice-1973606_640.jpg",
  "tapal-danedar": "https://cdn.pixabay.com/photo/2015/09/09/19/56/tea-932679_640.jpg",
  "lipton-tea": "https://cdn.pixabay.com/photo/2016/04/20/07/44/tea-1339367_640.jpg",
  "maida-flour": "https://cdn.pixabay.com/photo/2017/04/17/15/44/flour-2238424_640.jpg",
  "knorr-cubes": "https://cdn.pixabay.com/photo/2015/11/03/08/56/spices-1020836_640.jpg",
  "surf-excel": "https://cdn.pixabay.com/photo/2016/01/18/16/43/laundry-1146092_640.png",
  "ariel": "https://cdn.pixabay.com/photo/2014/11/26/20/22/detergent-546563_640.jpg",
  "lifebuoy-handwash": "https://cdn.pixabay.com/photo/2016/01/13/21/34/bubbles-1138663_640.jpg",
  "lux-soap": "https://cdn.pixabay.com/photo/2015/06/19/16/34/soap-814609_640.jpg",
  "dettol-soap": "https://cdn.pixabay.com/photo/2015/06/19/16/34/soap-814608_640.jpg",
  "lays-chips": "https://cdn.pixabay.com/photo/2017/01/11/11/33/snack-1972739_640.jpg",
  "mamypoko": "https://cdn.pixabay.com/photo/2016/02/18/09/29/baby-1205838_640.jpg",
  "panadol": "https://cdn.pixabay.com/photo/2015/12/09/17/11/medications-1085150_640.jpg",
};

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

async function main() {
  console.log("Fixing remaining broken images with Pixabay CDN...\n");

  for (const [slug, url] of Object.entries(pixabayImages)) {
    try {
      const buffer = await downloadImage(url);
      if (buffer.length < 1000) {
        console.log(`SKIP ${slug}: too small`);
        continue;
      }
      console.log(`${slug}: ${(buffer.length / 1024).toFixed(0)}KB`);

      const path = `${slug}.jpg`;
      const { error } = await supabase.storage
        .from("products")
        .upload(path, buffer, { contentType: "image/jpeg", upsert: true });

      if (error) { console.error(`  Upload error: ${error.message}`); continue; }

      const { data } = supabase.storage.from("products").getPublicUrl(path);
      await supabase.from("products").update({ images: [data.publicUrl] }).eq("slug", slug);
      console.log(`  Done -> ${data.publicUrl}`);
    } catch (err) {
      console.error(`  FAIL ${slug}: ${err.message}`);
    }
  }

  console.log("\nAll done!");
}

main();
