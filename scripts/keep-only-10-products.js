const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://srmgovjwphjcjtcynuwe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybWdvdmp3cGhqY2p0Y3ludXdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA4OTQ1MSwiZXhwIjoyMDk4NjY1NDUxfQ.PJdzHQ5-qmrk4rR5pARtSCK3qW80EfoQHYX9iHi1I8w"
);

async function main() {
  const { data: products } = await supabase
    .from("products")
    .select("id, name")
    .order("created_at", { ascending: false });

  if (!products || products.length <= 10) {
    console.log(`Only ${products?.length || 0} products exist. Nothing to delete.`);
    return;
  }

  const toDelete = products.slice(10);
  console.log(`Keeping first 10 products, deleting ${toDelete.length} excess products...\n`);

  for (const p of toDelete) {
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      console.error(`  FAIL: ${p.name} - ${error.message}`);
    } else {
      console.log(`  Deleted: ${p.name}`);
    }
  }

  const { count } = await supabase.from("products").select("id", { count: "exact" });
  console.log(`\nDone! ${count} products remaining.`);
}

main();
