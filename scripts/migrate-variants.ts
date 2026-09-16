import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../src/data/catalog";

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateVariants() {
  console.log("Starting variants migration...");
  
  const allVariants = [];
  
  for (const product of PRODUCTS) {
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        allVariants.push({
          product_id: product.id,
          color: variant.color || null,
          size: variant.size,
          stock_quantity: variant.stock
        });
      }
    }
  }

  if (allVariants.length === 0) {
    console.log("No variants found in catalog to migrate.");
    return;
  }

  // Clear existing variants to avoid conflicts during seed
  await supabase.from("product_variants").delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { error } = await supabase.from("product_variants").insert(allVariants);
  
  if (error) {
    console.error("Error inserting variants:", error);
  } else {
    console.log(`Successfully migrated ${allVariants.length} variants!`);
  }
}

migrateVariants();
