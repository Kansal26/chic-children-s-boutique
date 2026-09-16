import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { Header } from "@/components/boutique/Header";
import { Footer, FoilRule } from "@/components/boutique/sections";
import { ProductGrid } from "@/components/boutique/ProductCard";
import { categoryBySlug, formatPrice } from "@/data/catalog";
import { db } from "@/lib/db";
import { LuxeButton } from "@/components/boutique/Button";
import { useStore } from "@/lib/store";
import { SizeGuideTable } from "@/components/boutique/SizeGuideTable";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Heart, Minus, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/product/$productId")({
  component: ProductPage,
  loader: ({ params }) => {
    const product = db.getProduct(params.productId);
    if (!product) throw new Error("Product not found");
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Product"} — Maison Petit` },
      { name: "description", content: `Shop the ${loaderData?.name}` },
    ],
  }),
});

const SIZES = ["0-3M", "3-6M", "6-12M", "1-2Y", "2-4Y"];

function ProductPage() {
  const product = Route.useLoaderData();
  // Use the primary/first category for breadcrumbs and recommendations
  const primaryCategory = product.categories?.[0] || "";
  const cat = categoryBySlug(primaryCategory);
  const navigate = useNavigate();

  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors ? product.colors[0].name : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [showSizeError, setShowSizeError] = useState(false);

  useEffect(() => {
    setSelectedColor(product.colors ? product.colors[0].name : null);
    setSelectedSize(null);
    setQuantity(1);
    setShowSizeError(false);
    setActiveImage(0);
  }, [product.id]);

  const images = product.colors ? product.colors.map((c) => c.img) : [product.img];
  if (product.hoverImg && !product.colors) images.push(product.hoverImg);
  if (images.length === 1) images.push(product.img, product.img);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    addToCart({ product, size: selectedSize, color: selectedColor || undefined, quantity });
    toast("Added to your bag");
  };

  const handleWishlist = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    toggleWishlist(product.id, selectedSize, selectedColor || undefined);
    toast(wishlisted ? "Removed from Wishlist" : "Added to Wishlist");
  };

  const complementaryProducts = db.getProducts().filter(
    (p) => p.id !== product.id && p.categories?.includes(primaryCategory),
  ).slice(0, 4);
  if (complementaryProducts.length < 4) {
    const extra = db.getProducts().filter(
      (p) => p.id !== product.id && !complementaryProducts.includes(p as any),
    ).slice(0, 4 - complementaryProducts.length);
    complementaryProducts.push(...extra);
  }

  const activeTint = cat ? cat.tint.replace("bg-", "bg-").replace("-deep", "") : "bg-pastel-pink";
  const selectedBg =
    {
      "bg-pastel-pink": "bg-pastel-pink/40",
      "bg-pastel-lavender": "bg-pastel-lavender/40",
      "bg-pastel-blue": "bg-pastel-blue/40",
      "bg-pastel-peach": "bg-pastel-peach/40",
      "bg-pastel-lemon": "bg-pastel-lemon/40",
      "bg-pastel-mint": "bg-pastel-mint/40",
    }[activeTint] || "bg-pastel-pink/40";

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <Header />
      <main className="pt-32">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-[88rem] px-6 pb-8 sm:px-8">
          <nav className="text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              to="/shop"
              search={{ category: primaryCategory }}
              className="hover:text-foreground transition-colors"
            >
              {cat ? cat.name : "Shop"}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Product Details Section */}
        <section className="mx-auto max-w-[88rem] px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left: Image Gallery */}
            <div className="flex flex-col gap-4">
              {/* Main Image */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] bg-cream shadow-[var(--shadow-soft)]">
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:scale-[1.04]"
                />
                {product.isNew && (
                  <span className="absolute left-6 top-6 rounded-[6px] border border-pastel-pink px-3 py-1.5 text-[0.625rem] uppercase tracking-[0.2em] bg-background/80 backdrop-blur-sm text-foreground">
                    New
                  </span>
                )}
                <button
                  type="button"
                  aria-label="Wishlist"
                  onClick={handleWishlist}
                  className="absolute right-6 top-6 text-muted-foreground/70 transition-colors duration-300 hover:text-foreground"
                >
                  <Heart
                    className="h-6 w-6"
                    strokeWidth={1.5}
                    fill={wishlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>

              {/* Thumbnails (Swipeable on Mobile) */}
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 lg:pb-0 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "snap-start shrink-0 relative aspect-[4/5] w-24 overflow-hidden rounded-[8px] border transition-all duration-300",
                      activeImage === idx
                        ? "border-foreground"
                        : "border-transparent opacity-60 hover:opacity-100",
                    )}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Info & Actions */}
            <div className="flex flex-col justify-start pt-4 lg:pt-10">
              <h1 className="font-serif text-[2.25rem] leading-[1.1] text-foreground sm:text-[3rem] tracking-tight">
                {product.name}
              </h1>
              <p className="mt-4 font-sans text-lg tracking-[0.1em] text-muted-foreground">
                {formatPrice(product.price)}
              </p>

              <div className="mt-8">
                <p className="text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Color
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  {product.colors ? (
                    product.colors.map((color, idx) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setSelectedColor(color.name);
                          setActiveImage(idx);
                        }}
                        aria-label={`Color ${color.name}`}
                        className={cn(
                          "group flex items-center gap-3 transition-opacity focus-visible:outline-none",
                          selectedColor === color.name
                            ? "opacity-100"
                            : "opacity-60 hover:opacity-100",
                        )}
                      >
                        <span
                          style={{ backgroundColor: color.hex }}
                          className={cn(
                            "h-6 w-6 shrink-0 rounded-full border border-border transition-all duration-300",
                            selectedColor === color.name
                              ? "ring-2 ring-gold ring-offset-2 ring-offset-background"
                              : "",
                          )}
                        />
                        <span
                          className={cn(
                            "text-[0.6875rem] uppercase tracking-[0.2em] transition-colors",
                            selectedColor === color.name
                              ? "text-foreground font-medium"
                              : "text-muted-foreground",
                          )}
                        >
                          {color.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "h-6 w-6 shrink-0 rounded-full border-2 border-background ring-1 ring-foreground",
                          cat ? cat.tint : "bg-pastel-pink",
                        )}
                      />
                      <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-foreground">
                        {product.material}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 border-t border-border/70 pt-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <p className="text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                      Select Size
                    </p>
                    {showSizeError && (
                      <span
                        className="text-[0.625rem] uppercase tracking-[0.1em] text-destructive animate-in fade-in"
                        aria-live="polite"
                      >
                        Please select a size
                      </span>
                    )}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-[0.625rem] uppercase tracking-[0.2em] text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">
                        Size Guide
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-cream border-border/50">
                      <DialogHeader>
                        <DialogTitle className="font-serif text-2xl font-normal text-center mb-4">
                          Size Guide
                        </DialogTitle>
                      </DialogHeader>
                      <SizeGuideTable />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className={cn("flex flex-wrap gap-3", showSizeError && "animate-shake")}>
                  {SIZES.map((size) => {
                  let inStock = true;
                  if (product.variants && product.variants.length > 0) {
                    const v = product.variants.find(v => v.size === size && (!v.color || v.color === selectedColor));
                    inStock = v ? v.stock !== 0 : false;
                  }
                    return (
                      <button
                        key={size}
                        disabled={!inStock}
                        onClick={() => {
                          setSelectedSize(size);
                          setShowSizeError(false);
                        }}
                        aria-label={
                          inStock ? `Size ${size}, in stock` : `Size ${size}, out of stock`
                        }
                        className={cn(
                          "rounded-[8px] border px-6 py-2.5 text-[0.6875rem] uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold",
                          !inStock
                            ? "border-border/40 text-muted-foreground/40 bg-muted/20 cursor-not-allowed line-through"
                            : selectedSize === size
                              ? `border-transparent text-foreground shadow-sm ${selectedBg}`
                              : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <div className="flex items-center rounded-[8px] border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-[0.6875rem] font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                    className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="hidden lg:block flex-1">
                  <LuxeButton size="lg" className="w-full text-xs" onClick={handleAddToCart}>
                    ADD TO CART
                  </LuxeButton>
                </div>
              </div>

              <div className="hidden lg:block mt-6">
                <button
                  onClick={handleWishlist}
                  className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Heart className="h-4 w-4" fill={wishlisted ? "currentColor" : "none"} />
                  {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
              </div>

              {/* Accordions */}
              <div className="mt-12 lg:mt-16 border-t border-border/70">
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="description" className="border-b-border/70">
                    <AccordionTrigger className="text-[0.6875rem] uppercase tracking-[0.2em] hover:no-underline hover:text-foreground/80 py-6">
                      Description
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-6">
                      This heirloom piece is cut in a relaxed silhouette, ensuring ease of movement
                      and comfort for your little one. Meticulously finished by hand in our atelier,
                      it features subtle detailing that embodies our commitment to quiet elegance.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="fabric" className="border-b-border/70">
                    <AccordionTrigger className="text-[0.6875rem] uppercase tracking-[0.2em] hover:no-underline hover:text-foreground/80 py-6">
                      Fabric & Care
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-6">
                      Made from {product.material.toLowerCase()}. We recommend a gentle cold wash
                      and air drying in the shade to preserve the integrity of the natural fibers.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="delivery" className="border-b-border/70 border-b-0">
                    <AccordionTrigger className="text-[0.6875rem] uppercase tracking-[0.2em] hover:no-underline hover:text-foreground/80 py-6">
                      Delivery & Returns
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-6">
                      Complimentary express shipping on all orders over €200. We accept returns
                      within 14 days of delivery, provided the item is unworn and in its original
                      packaging.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* Complete the Look */}
        <section className="mx-auto max-w-[88rem] px-6 py-20 sm:px-8 border-t border-border/70">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-[2rem] text-foreground sm:text-[2.5rem]">
              Complete the Look
            </h2>
            <div className="mx-auto mt-6 w-16">
              <FoilRule />
            </div>
          </div>
          <ProductGrid products={complementaryProducts} />
        </section>

        {/* Editorial Closing Line */}
        <section className="px-6 py-20 text-center sm:px-8">
          <p className="font-serif text-[1.35rem] italic text-foreground tracking-wide">
            Finished by hand in our Paris atelier.
          </p>
        </section>
      </main>
      <Footer />

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-border/70 bg-background/90 backdrop-blur-xl px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-4 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col min-w-0">
          <span className="truncate text-[0.6875rem] uppercase tracking-[0.1em] font-medium">
            {product.name}
          </span>
          <span className="text-[0.625rem] text-muted-foreground">
            {formatPrice(product.price)}
          </span>
        </div>
        <LuxeButton size="sm" className="shrink-0 text-xs px-8" onClick={handleAddToCart}>
          ADD TO CART
        </LuxeButton>
      </div>
    </div>
  );
}
