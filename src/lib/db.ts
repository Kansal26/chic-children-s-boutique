import { Product, CategorySlug, CATEGORIES } from "@/data/catalog";
import { useSyncExternalStore } from "react";
import { supabase } from "./supabase";

export type Collection = {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  status?: "published" | "archived";
};

export type Coupon = {
  id: string;
  code: string;
  description?: string;
  discount_type: "percentage" | "fixed_amount" | "free_gift";
  discount_value: number;
  min_order_value?: number;
  min_items_count?: number;
  free_gift_product_id?: string;
  status: "active" | "inactive";
};

// Internal memory store
let products: Product[] = [];
let categories: typeof CATEGORIES = [];
let collections: Collection[] = [];
let coupons: Coupon[] = [];

// Fetch initial data
async function initDb() {
  const [
    { data: prods },
    { data: cats },
    { data: cols },
    { data: prodCats },
    { data: vars },
    { data: coups }
  ] = await Promise.all([
    supabase.from('products').select('*'),
    supabase.from('categories').select('*'),
    supabase.from('collections').select('*'),
    supabase.from('product_categories').select('*'),
    supabase.from('product_variants').select('*'),
    supabase.from('coupons').select('*')
  ]);

  if (cats) {
    categories = cats.map(c => ({
      slug: c.slug,
      name: c.name,
      note: c.note,
      img: c.img,
      tint: c.tint,
      ring: c.ring,
      text: c.text_color,
      blurb: c.blurb,
      heroDetails: c.hero_details,
      status: c.status
    }));
  }
  
  if (cols) collections = cols;
  if (coups) coupons = coups;

  if (prods) {
    products = prods.map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      categories: prodCats?.filter(pc => pc.product_id === p.id).map(pc => pc.category_slug) || [],
      img: p.img,
      hoverImg: p.hover_img,
      tag: p.tag,
      tagStyle: p.tag_style,
      isNew: p.is_new,
      material: p.material,
      status: p.status,
      sku: p.sku,
      description: p.description,
      metaTitle: p.meta_title,
      metaDescription: p.meta_description,
      compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
      currency: p.currency,
      tags: p.tags,
      fabricTags: p.fabric_tags,
      styleTags: p.style_tags,
      primaryImage: p.primary_image,
      images: p.images,
      adminImages: p.admin_images,
      careInstructions: p.care_instructions,
      weight: p.weight ? Number(p.weight) : undefined,
      featured: p.featured,
      colors: p.colors,
      variants: vars?.filter(v => v.product_id === p.id).map(v => ({
        id: v.id,
        color: v.color || undefined,
        size: v.size,
        stock: v.stock_quantity
      })) || [],
    }));
  }

  notify();
}

// Start fetching
initDb();

type Subscriber = () => void;
const subscribers = new Set<Subscriber>();

function notify() {
  subscribers.forEach((s) => s());
}

export const db = {
  subscribe: (callback: Subscriber) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },
  
  // Products
  getProducts: () => products,
  getProduct: (id: string) => products.find((p) => p.id === id),
  createProduct: async (data: Product) => {
    products = [data, ...products];
    notify();
    
    await supabase.from('products').insert({
      id: data.id,
      name: data.name,
      price: data.price,
      img: data.img,
      hover_img: data.hoverImg,
      tag: data.tag,
      tag_style: data.tagStyle,
      is_new: data.isNew,
      material: data.material,
      status: data.status || 'published',
      sku: data.sku,
      description: data.description,
      meta_title: data.metaTitle,
      meta_description: data.metaDescription,
      compare_at_price: data.compareAtPrice,
      currency: data.currency,
      tags: data.tags,
      fabric_tags: data.fabricTags,
      style_tags: data.styleTags,
      primary_image: data.primaryImage,
      images: data.images,
      admin_images: data.adminImages,
      care_instructions: data.careInstructions,
      weight: data.weight,
      featured: data.featured,
      colors: data.colors,
    });

    if (data.categories && data.categories.length > 0) {
      await supabase.from('product_categories').insert(
        data.categories.map(c => ({ product_id: data.id, category_slug: c }))
      );
    }
    
    if (data.variants && data.variants.length > 0) {
      await supabase.from('product_variants').insert(
        data.variants.map(v => ({
          product_id: data.id,
          color: v.color || null,
          size: v.size,
          stock_quantity: v.stock
        }))
      );
    }
    
    return data;
  },
  updateProduct: async (id: string, updates: Partial<Product>) => {
    products = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    notify();
    
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.img !== undefined) dbUpdates.img = updates.img;
    if (updates.hoverImg !== undefined) dbUpdates.hover_img = updates.hoverImg;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.metaTitle !== undefined) dbUpdates.meta_title = updates.metaTitle;
    if (updates.metaDescription !== undefined) dbUpdates.meta_description = updates.metaDescription;
    
    if (Object.keys(dbUpdates).length > 0) {
      await supabase.from('products').update(dbUpdates).eq('id', id);
    }

    if (updates.categories !== undefined) {
      await supabase.from('product_categories').delete().eq('product_id', id);
      if (updates.categories.length > 0) {
        await supabase.from('product_categories').insert(
          updates.categories.map(c => ({ product_id: id, category_slug: c }))
        );
      }
    }

    if (updates.variants !== undefined) {
      await supabase.from('product_variants').delete().eq('product_id', id);
      if (updates.variants.length > 0) {
        await supabase.from('product_variants').insert(
          updates.variants.map(v => ({
            product_id: id,
            color: v.color || null,
            size: v.size,
            stock_quantity: v.stock
          }))
        );
      }
    }
  },
  deleteProduct: async (id: string) => {
    products = products.filter((p) => p.id !== id);
    notify();
    await supabase.from('products').delete().eq('id', id);
  },

  // Categories
  getCategories: () => categories,
  getCategory: (slug: string) => categories.find((c) => c.slug === slug),
  updateCategory: async (slug: string, updates: Partial<typeof CATEGORIES[0]>) => {
    categories = categories.map((c) => (c.slug === slug ? { ...c, ...updates } : c));
    notify();
    
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.note !== undefined) dbUpdates.note = updates.note;
    if (updates.img !== undefined) dbUpdates.img = updates.img;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    
    await supabase.from('categories').update(dbUpdates).eq('slug', slug);
  },
  createCategory: async (data: typeof CATEGORIES[0]) => {
    categories = [...categories, data];
    notify();
    
    await supabase.from('categories').insert({
      slug: data.slug,
      name: data.name,
      note: data.note,
      img: data.img,
      tint: data.tint,
      ring: data.ring,
      text_color: data.text,
      blurb: data.blurb,
      hero_details: data.heroDetails,
      status: data.status || 'published'
    });
  },
  deleteCategory: async (slug: string) => {
    categories = categories.filter((c) => c.slug !== slug);
    products = products.map((p) => ({
      ...p,
      categories: p.categories?.filter(c => c !== slug) || []
    }));
    notify();
    
    await supabase.from('categories').delete().eq('slug', slug);
    // Cascade delete handles product_categories in Supabase
  },

  // Collections
  getCollections: () => collections,
  createCollection: async (data: Collection) => {
    collections = [...collections, data];
    notify();
    await supabase.from('collections').insert(data);
  },
  updateCollection: async (id: string, updates: Partial<Collection>) => {
    collections = collections.map((c) => (c.id === id ? { ...c, ...updates } : c));
    notify();
    await supabase.from('collections').update(updates).eq('id', id);
  },
  deleteCollection: async (id: string) => {
    collections = collections.filter((c) => c.id !== id);
    notify();
    await supabase.from('collections').delete().eq('id', id);
  },
  getCollection: (id: string) => collections.find((c) => c.id === id),

  // Coupons
  getCoupons: () => coupons,
  createCoupon: async (data: Omit<Coupon, 'id'>) => {
    const tempId = crypto.randomUUID();
    const newCoupon = { ...data, id: tempId };
    coupons = [...coupons, newCoupon];
    notify();
    
    const { data: insertedData, error } = await supabase.from('coupons').insert(data).select().single();
    if (insertedData) {
      coupons = coupons.map(c => c.id === tempId ? insertedData : c);
      notify();
    }
  },
  updateCoupon: async (id: string, updates: Partial<Coupon>) => {
    coupons = coupons.map((c) => (c.id === id ? { ...c, ...updates } : c));
    notify();
    await supabase.from('coupons').update(updates).eq('id', id);
  },
  deleteCoupon: async (id: string) => {
    coupons = coupons.filter((c) => c.id !== id);
    notify();
    await supabase.from('coupons').delete().eq('id', id);
  },
};

export function useProducts() {
  return useSyncExternalStore(db.subscribe, db.getProducts);
}

export function useCategories() {
  return useSyncExternalStore(db.subscribe, db.getCategories);
}

export function useCategory(slug: string) {
  return useSyncExternalStore(db.subscribe, () => db.getCategory(slug));
}

export function useCollections() {
  return useSyncExternalStore(db.subscribe, db.getCollections);
}

export function useCollection(id: string) {
  return useSyncExternalStore(db.subscribe, () => db.getCollection(id));
}

export function useCoupons() {
  return useSyncExternalStore(db.subscribe, db.getCoupons);
}
