const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://srmgovjwphjcjtcynuwe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybWdvdmp3cGhqY2p0Y3ludXdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA4OTQ1MSwiZXhwIjoyMDk4NjY1NDUxfQ.PJdzHQ5-qmrk4rR5pARtSCK3qW80EfoQHYX9iHi1I8w"
);

async function main() {
  const { data: products } = await supabase.from("products").select("id, name, slug, images").order("created_at");
  console.log("Products in database:\n");
  for (const p of products || []) {
    console.log(`${p.name} (${p.slug})`);
    console.log(`  images: ${JSON.stringify(p.images)}`);
  }

  const { data: settings } = await supabase.from("settings").select("key, value").in("key", ["heroBgImage", "heroBgColor", "heroTextColor"]);
  console.log("\nHero settings:");
  for (const s of settings || []) {
    console.log(`  ${s.key}: ${s.value}`);
  }

  const { data: banners } = await supabase.storage.from("products").list("");
  console.log("\nProduct images in storage:");
  for (const f of banners || []) {
    console.log(`  ${f.name} (${f.metadata?.size || "?"} bytes)`);
  }
}

main();
