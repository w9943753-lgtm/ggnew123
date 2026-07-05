const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://srmgovjwphjcjtcynuwe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybWdvdmp3cGhqY2p0Y3ludXdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA4OTQ1MSwiZXhwIjoyMDk4NjY1NDUxfQ.PJdzHQ5-qmrk4rR5pARtSCK3qW80EfoQHYX9iHi1I8w"
);

async function main() {
  // Check all heroBgImage entries
  const { data: heroEntries } = await supabase.from("settings").select("*").eq("key", "heroBgImage");
  console.log("heroBgImage entries:", heroEntries);

  // List all images in banners storage
  const { data: files } = await supabase.storage.from("banners").list("");
  console.log("\nBanner storage files:");
  for (const f of files || []) {
    const { data: urlData } = supabase.storage.from("banners").getPublicUrl(f.name);
    console.log(`  ${f.name} -> ${urlData.publicUrl}`);
  }

  // Check all product images in storage
  const { data: prodFiles } = await supabase.storage.from("products").list("");
  console.log("\nProduct storage files:");
  for (const f of (prodFiles || []).filter(f => f.name !== "products")) {
    const { data: urlData } = supabase.storage.from("products").getPublicUrl(f.name);
    console.log(`  ${f.name} (${f.metadata?.size || "?"} bytes) -> ${urlData.publicUrl}`);
  }
}

main();
