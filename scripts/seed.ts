import { createClient } from "@supabase/supabase-js";
import { PRODUCTS, CATEGORIES } from "../src/data/catalog";


const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const collections = [
  { id: "spring-summer", name: "Spring · Summer", description: "Warm weather edits", status: "published" },
  { id: "heritage", name: "Heritage Knitwear", description: "Timeless knits", status: "published" },
  { id: "occasion", name: "Occasion Wear", description: "For special moments", status: "published" },
];

async function seed() {
  console.log("🌱 Starting seed...");

  // 1. Seed Categories
  console.log("Seeding categories...");
  for (const cat of CATEGORIES) {
    const { error } = await supabase.from('categories').upsert({
      slug: cat.slug,
      name: cat.name,
      note: cat.note,
      img: cat.img,
      tint: cat.tint,
      ring: cat.ring,
      text_color: cat.text,
      blurb: cat.blurb,
      hero_details: cat.heroDetails,
      status: cat.status || 'published'
    });
    if (error) console.error("Error inserting category", cat.slug, error);
  }

  // 2. Seed Collections
  console.log("Seeding collections...");
  for (const col of collections) {
    const { error } = await supabase.from('collections').upsert(col);
    if (error) console.error("Error inserting collection", col.id, error);
  }

  // 3. Seed Products
  console.log("Seeding products...");
  for (const prod of PRODUCTS) {
    const productPayload = {
      id: prod.id,
      name: prod.name,
      price: prod.price,
      category_slug: prod.category,
      img: prod.img,
      hover_img: prod.hoverImg,
      tag: prod.tag,
      tag_style: prod.tagStyle,
      is_new: prod.isNew || false,
      material: prod.material,
      status: prod.status || 'published',
      sku: prod.sku || `SKU-${prod.id.toUpperCase()}`,
      description: prod.description || `Detailed description for ${prod.name}`,
      compare_at_price: prod.compareAtPrice,
      currency: prod.currency || 'EUR',
      tags: prod.tags || (prod.isNew ? ["New Arrival"] : []),
      fabric_tags: prod.fabricTags || [],
      style_tags: prod.styleTags || [],
      primary_image: prod.primaryImage || prod.img,
      images: prod.images || [prod.img, ...(prod.hoverImg ? [prod.hoverImg] : [])],
      care_instructions: prod.careInstructions || "Machine wash cold",
      weight: prod.weight || 0.5,
      featured: prod.featured || prod.isNew || false,
      colors: prod.colors || null,
      inventory: prod.inventory || null,
      variant_matrix: prod.variantMatrix || (prod.colors?.length ? prod.colors.map(c => Object.keys(prod.inventory || {}).map(s => ({
        color: c.name, size: s, stock: prod.inventory?.[s] || 10
      }))).flat() : Object.keys(prod.inventory || {}).map(s => ({
        size: s, stock: prod.inventory?.[s] || 10
      }))) || [],
      admin_images: prod.adminImages || null,
    };
    
    const { error } = await supabase.from('products').upsert(productPayload);
    if (error) {
      console.error("Error inserting product", prod.id, error.message);
    }
  }

  console.log("✅ Seeding complete!");
}

seed();
