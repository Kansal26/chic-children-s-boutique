import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function fixUrl(url: string | null | undefined): string | null | undefined {
  if (!url) return url;
  if (typeof url !== 'string') return url;
  return url.replace('/Users/adikansal2608/Desktop/Chic/src', '');
}

async function fix() {
  console.log("Fixing image URLs in DB...");

  // Fix Categories
  const { data: categories } = await supabase.from('categories').select('*');
  if (categories) {
    for (const cat of categories) {
      await supabase.from('categories').update({
        img: fixUrl(cat.img),
      }).eq('slug', cat.slug);
    }
  }

  // Fix Products
  const { data: products } = await supabase.from('products').select('*');
  if (products) {
    for (const prod of products) {
      
      const imagesFixed = Array.isArray(prod.images) ? prod.images.map(fixUrl) : prod.images;

      await supabase.from('products').update({
        img: fixUrl(prod.img),
        hover_img: fixUrl(prod.hover_img),
        primary_image: fixUrl(prod.primary_image),
        images: imagesFixed
      }).eq('id', prod.id);
    }
  }

  console.log("✅ Fixed image URLs!");
}

fix();
