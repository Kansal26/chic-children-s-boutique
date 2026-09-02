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

export type CategorySlug =
  | "newborn"
  | "girls"
  | "boys"
  | "accessories"
  | "shoes"
  | "gifting";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: CategorySlug;
  img: string;
  tag?: string;
  tagStyle?: string;
  isNew?: boolean;
  material: string;
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
  },
  {
    slug: "gifting",
    name: "Gifting",
    note: "Curated boxes",
    img: cGift,
    tint: "bg-pastel-mint",
    ring: "group-hover:ring-pastel-mint-deep",
    text: "group-hover:text-pastel-mint-deep",
    blurb: "Ribbon-tied boxes assembled by hand in our Lisbon atelier.",
  },
];

const NEW_STYLE = "border-pastel-pink-deep/40 bg-pastel-pink/85 text-pastel-pink-deep";
const LTD_STYLE =
  "border-pastel-lavender-deep/40 bg-pastel-lavender/85 text-pastel-lavender-deep";
const FEW_STYLE = "border-pastel-blue-deep/40 bg-pastel-blue/85 text-pastel-blue-deep";

export const PRODUCTS: Product[] = [
  { id: "amelie-cardigan", name: "Amélie Hand-Knit Cardigan", price: 148, category: "girls", img: p1, tag: "New", tagStyle: NEW_STYLE, isNew: true, material: "Pyrenean merino" },
  { id: "colette-dress", name: "Colette Pleated Silk Dress", price: 216, category: "girls", img: p2, tag: "Limited Edition", tagStyle: LTD_STYLE, isNew: true, material: "Mulberry silk" },
  { id: "margaux-mary-janes", name: "Margaux Leather Mary Janes", price: 132, category: "shoes", img: p3, material: "Vegetable-tanned calf" },
  { id: "henri-linen-shirt", name: "Henri Washed Linen Shirt", price: 96, category: "boys", img: p4, tag: "New", tagStyle: NEW_STYLE, isNew: true, material: "French linen" },
  { id: "juliette-layette", name: "Juliette Pointelle Layette Set", price: 124, category: "newborn", img: cNewborn, tag: "New", tagStyle: NEW_STYLE, isNew: true, material: "Organic pima cotton" },
  { id: "lou-bonnet", name: "Lou Scalloped Bonnet", price: 58, category: "newborn", img: cAcc, material: "Organic cotton voile" },
  { id: "capucine-pinafore", name: "Capucine Smocked Pinafore", price: 168, category: "girls", img: cGirls, tag: "Few Left", tagStyle: FEW_STYLE, material: "Handloom cotton" },
  { id: "gaspard-shorts", name: "Gaspard Tailored Linen Shorts", price: 88, category: "boys", img: cBoys, material: "French linen" },
  { id: "noe-merino-jumper", name: "Noé Ribbed Merino Jumper", price: 118, category: "boys", img: p1, tag: "New", tagStyle: NEW_STYLE, isNew: true, material: "Pyrenean merino" },
  { id: "sylvie-hair-bows", name: "Sylvie Silk Hair Bow Trio", price: 42, category: "accessories", img: cAcc, material: "Silk satin" },
  { id: "odette-socks", name: "Odette Lace-Trim Socks", price: 24, category: "accessories", img: cShoes, material: "Combed cotton" },
  { id: "romy-booties", name: "Romy First-Walker Booties", price: 98, category: "shoes", img: cShoes, tag: "New", tagStyle: NEW_STYLE, isNew: true, material: "Nappa leather" },
  { id: "louis-sandals", name: "Louis Buckled Sandals", price: 112, category: "shoes", img: p3, material: "Vegetable-tanned calf" },
  { id: "arrivee-gift-box", name: "L'Arrivée Newborn Gift Box", price: 245, category: "gifting", img: cGift, tag: "Limited Edition", tagStyle: LTD_STYLE, isNew: true, material: "Six-piece layette" },
  { id: "premier-ete-box", name: "Premier Été Summer Box", price: 298, category: "gifting", img: cGift, material: "Four-piece edit" },
  { id: "blanche-blanket", name: "Blanche Cashmere Pram Blanket", price: 186, category: "newborn", img: cNewborn, tag: "Few Left", tagStyle: FEW_STYLE, material: "Mongolian cashmere" },
];

export const NEW_ARRIVALS = PRODUCTS.filter((p) => p.isNew);

export const categoryBySlug = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);

export const formatPrice = (n: number) => `€${n}`;
