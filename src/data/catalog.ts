import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import cNewborn from "@/assets/c-newborn.jpg";
import cGirls from "@/assets/c-girls.jpg";
import cBoys from "@/assets/c-boys.jpg";
import cAcc from "@/assets/c-acc.jpg";
import cShoes from "@/assets/c-shoes.jpg";
import cGift from "@/assets/c-gift.jpg";

import heroNewborn from "@/assets/hero_newborn.png";
import heroGirls from "@/assets/hero_girls.png";
import heroBoys from "@/assets/hero_boys.png";
import heroAcc from "@/assets/hero_accessories.png";
import heroShoes from "@/assets/hero_shoes.png";

export type CategorySlug = "newborn" | "girls" | "boys" | "accessories" | "shoes" | "uncategorized" | string;

export type AdminImage = {
  url: string;
  role: "primary" | "hover" | "secondary_hover" | "gallery";
  altText: string;
  order: number;
};

export type ProductVariant = {
  id?: string;
  color?: string;
  size: string;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  categories: CategorySlug[];
  img: string;
  hoverImg?: string;
  tag?: string;
  tagStyle?: string;
  isNew?: boolean;
  material: string;
  colors?: { name: string; hex: string; img: string; hoverImg?: string }[];
  variants?: ProductVariant[];
  
  // Admin fields
  collections?: string[];
  status?: "published" | "draft" | "archived";
  sku?: string;
  description?: string;
  compareAtPrice?: number;
  currency?: string;
  tags?: string[];
  fabricTags?: string[];
  styleTags?: string[];
  primaryImage?: string;
  images?: string[];
  adminImages?: AdminImage[];
  careInstructions?: string;
  weight?: number;
  metaTitle?: string;
  metaDescription?: string;
  featured?: boolean;
};

export const CATEGORIES: {
  slug: CategorySlug;
  name: string;
  note: string;
  img: string;
  tint: string;
  ring: string;
  text: string;
  blurb: string;
  heroDetails?: {
    eyebrow: string;
    headline: string;
    description: string;
    ctaLabel: string;
    heroImg: string;
  };
  status?: "published" | "archived";
}[] = [
  {
    slug: "newborn",
    name: "Newborn",
    note: "0 – 12 m",
    img: cNewborn,
    tint: "bg-pastel-pink",
    ring: "group-hover:ring-pastel-pink-deep",
    text: "group-hover:text-pastel-pink-deep",
    blurb: "Featherweight cotton layettes, bonnets and first-wardrobe essentials.",
    heroDetails: {
      eyebrow: "ESSENTIALS",
      headline: "Newborn, softly held",
      description: "Featherweight cotton layettes, bonnets, and first-wardrobe essentials.",
      ctaLabel: "Shop Newborn",
      heroImg: heroNewborn,
    },
  },
  {
    slug: "girls",
    name: "Girls",
    note: "2 – 12 y",
    img: cGirls,
    tint: "bg-pastel-lavender",
    ring: "group-hover:ring-pastel-lavender-deep",
    text: "group-hover:text-pastel-lavender-deep",
    blurb: "Smocked dresses, hand-knit cardigans and softly pleated silks.",
    heroDetails: {
      eyebrow: "SPRING · SUMMER",
      headline: "Girls, in soft tones",
      description: "Smocked dresses, hand-knit cardigans, and delicately pleated silks.",
      ctaLabel: "Shop All Girls",
      heroImg: heroGirls,
    },
  },
  {
    slug: "boys",
    name: "Boys",
    note: "2 – 12 y",
    img: cBoys,
    tint: "bg-pastel-blue",
    ring: "group-hover:ring-pastel-blue-deep",
    text: "group-hover:text-pastel-blue-deep",
    blurb: "Washed linen shirting, tailored shorts and everyday merino knits.",
    heroDetails: {
      eyebrow: "SPRING · SUMMER",
      headline: "Boys, dressed gently",
      description: "Washed linen shirting, tailored shorts, and quiet everyday knits.",
      ctaLabel: "Shop All Boys",
      heroImg: heroBoys,
    },
  },
  {
    slug: "accessories",
    name: "Accessories",
    note: "Bonnets & bows",
    img: cAcc,
    tint: "bg-pastel-peach",
    ring: "group-hover:ring-pastel-peach-deep",
    text: "group-hover:text-pastel-peach-deep",
    blurb: "Hand-finished bows, bonnets, socks and heirloom hair ribbons.",
    heroDetails: {
      eyebrow: "THE DETAILS",
      headline: "Finishing touches",
      description: "Hand-finished bows, bonnets, and heirloom silk ribbons.",
      ctaLabel: "Explore Accessories",
      heroImg: heroAcc,
    },
  },
  {
    slug: "shoes",
    name: "Shoes",
    note: "Soft leather",
    img: cShoes,
    tint: "bg-pastel-lemon",
    ring: "group-hover:ring-pastel-lemon-deep",
    text: "group-hover:text-pastel-lemon-deep",
    blurb: "Vegetable-tanned Mary Janes, first-walker booties and sandals.",
    heroDetails: {
      eyebrow: "FOOTWEAR",
      headline: "First steps, considered",
      description: "Vegetable-tanned soft leather booties and classic Mary Janes.",
      ctaLabel: "Shop Shoes",
      heroImg: heroShoes,
    },
  },
];

const NEW_STYLE = "border-pastel-pink-deep/40 bg-pastel-pink/85 text-pastel-pink-deep";
const LTD_STYLE = "border-pastel-lavender-deep/40 bg-pastel-lavender/85 text-pastel-lavender-deep";
const FEW_STYLE = "border-pastel-blue-deep/40 bg-pastel-blue/85 text-pastel-blue-deep";

export const PRODUCTS: Product[] = [
  {
    id: "amelie-cardigan",
    name: "Amélie Hand-Knit Cardigan",
    price: 148,
    categories: ["girls"],
    img: p1,
    hoverImg: p2,
    tag: "New",
    tagStyle: NEW_STYLE,
    isNew: true,
    material: "Pyrenean merino",
  },
  {
    id: "colette-dress",
    name: "Colette Pleated Silk Dress",
    price: 216,
    categories: ["girls"],
    img: p2,
    hoverImg: p3,
    tag: "Limited Edition",
    tagStyle: LTD_STYLE,
    isNew: true,
    material: "Mulberry silk",
  },
  {
    id: "margaux-mary-janes",
    name: "Margaux Leather Mary Janes",
    price: 132,
    categories: ["shoes"],
    img: p3,
    hoverImg: p4,
    material: "Vegetable-tanned calf",
  },
  {
    id: "henri-linen-shirt",
    name: "Henri Washed Linen Shirt",
    price: 96,
    categories: ["boys"],
    img: p4,
    hoverImg: p1,
    tag: "New",
    tagStyle: NEW_STYLE,
    isNew: true,
    material: "French linen",
  },
  {
    id: "juliette-layette",
    name: "Juliette Pointelle Layette Set",
    price: 124,
    categories: ["newborn"],
    img: cNewborn,
    hoverImg: cGirls,
    tag: "New",
    tagStyle: NEW_STYLE,
    isNew: true,
    material: "Organic pima cotton",
  },
  {
    id: "lou-bonnet",
    name: "Lou Scalloped Bonnet",
    price: 58,
    categories: ["newborn"],
    img: cAcc,
    hoverImg: cShoes,
    material: "Organic cotton voile",
  },
  {
    id: "capucine-pinafore",
    name: "Capucine Smocked Pinafore",
    price: 168,
    categories: ["girls"],
    img: cGirls,
    hoverImg: cBoys,
    tag: "Few Left",
    tagStyle: FEW_STYLE,
    material: "Handloom cotton",
  },
  {
    id: "gaspard-shorts",
    name: "Gaspard Tailored Linen Shorts",
    price: 88,
    categories: ["boys"],
    img: cBoys,
    hoverImg: cGift,
    material: "French linen",
  },
  {
    id: "noe-merino-jumper",
    name: "Noé Ribbed Merino Jumper",
    price: 118,
    categories: ["boys"],
    img: p1,
    hoverImg: cBoys,
    tag: "New",
    tagStyle: NEW_STYLE,
    isNew: true,
    material: "Pyrenean merino",
    colors: [
      { name: "Cream", hex: "#f5f5dc", img: p1, hoverImg: cBoys },
      { name: "Navy", hex: "#1a2436", img: p2, hoverImg: cBoys },
    ],
    variants: [
      { size: "0-3M", stock: 5 },
      { size: "6-12M", stock: 3 },
      { size: "2-4Y", stock: 2 }
    ],
  },
  {
    id: "sylvie-hair-bows",
    name: "Sylvie Silk Hair Bow Trio",
    price: 42,
    categories: ["accessories"],
    img: cAcc,
    hoverImg: p2,
    material: "Silk satin",
  },
  {
    id: "odette-socks",
    name: "Odette Lace-Trim Socks",
    price: 24,
    categories: ["accessories"],
    img: cShoes,
    hoverImg: cAcc,
    material: "Combed cotton",
  },
  {
    id: "romy-booties",
    name: "Romy First-Walker Booties",
    price: 98,
    categories: ["shoes"],
    img: cShoes,
    hoverImg: p3,
    tag: "New",
    tagStyle: NEW_STYLE,
    isNew: true,
    material: "Nappa leather",
  },
  {
    id: "louis-sandals",
    name: "Louis Buckled Sandals",
    price: 112,
    categories: ["shoes"],
    img: p3,
    hoverImg: cShoes,
    material: "Vegetable-tanned calf",
  },
  {
    id: "blanche-blanket",
    name: "Blanche Cashmere Pram Blanket",
    price: 186,
    categories: ["newborn"],
    img: cNewborn,
    hoverImg: cGift,
    tag: "Few Left",
    tagStyle: FEW_STYLE,
    material: "Mongolian cashmere",
  },
];

export const NEW_ARRIVALS = PRODUCTS.filter((p) => p.isNew);

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

export const formatPrice = (n: number) => `€${n}`;
