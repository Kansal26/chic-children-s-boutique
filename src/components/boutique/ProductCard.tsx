import { Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LuxeButton } from "./Button";
import { formatPrice, categoryBySlug, type Product } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { QuickAddModal } from "./QuickAddModal";

export function ProductCard({ product }: { product: Product }) {
  const cat = categoryBySlug(product.categories?.[0] || "");
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsQuickAddOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsQuickAddOpen(true);
  };

  return (
    <>
      <Link
        to="/product/$productId"
        params={{ productId: product.id }}
        className="group flex flex-col h-full"
      >
      <div className="relative overflow-hidden rounded-[12px] bg-background p-4 shadow-[var(--shadow-soft)] transition-shadow duration-500 group-hover:shadow-[var(--shadow-lift)]">
        {/* Images with crossfade */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[8px]">
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.07]",
              product.hoverImg ? "group-hover:opacity-0" : "",
            )}
          />
          {product.hoverImg && (
            <img
              src={product.hoverImg}
              alt={`${product.name} lifestyle`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.07] group-hover:opacity-100"
            />
          )}
        </div>

        {/* Tags */}
        {product.tag && (
          <span
            className={`absolute left-6 top-6 rounded-[6px] border px-2.5 py-1 text-[0.5625rem] uppercase tracking-[0.22em] backdrop-blur-sm ${product.tagStyle}`}
          >
            {product.tag}
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={handleWishlist}
          className="absolute right-6 top-6 text-muted-foreground/70 transition-colors duration-300 hover:text-foreground"
        >
          <Heart
            className="h-5 w-5"
            strokeWidth={1.5}
            fill={wishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* Add to Cart Button */}
        <div className="pointer-events-none absolute inset-x-6 bottom-6 translate-y-4 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 flex justify-center">
          <LuxeButton
            size="sm"
            variant="outline"
            onClick={handleAddToCart}
            className="w-[85%] bg-background/90 backdrop-blur-sm"
          >
            ADD TO CART
          </LuxeButton>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 font-serif text-[1.0625rem] leading-snug text-foreground">
            {product.name}
            {cat && (
              <span
                className={cn("h-1.5 w-1.5 shrink-0 rounded-full", cat.tint)}
                aria-hidden="true"
              />
            )}
          </h3>
          <p className="mt-1 text-[0.5625rem] uppercase tracking-[0.2em] text-muted-foreground">
            {product.material}
          </p>
        </div>
        <p className="shrink-0 font-sans text-xs tracking-[0.12em] text-muted-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
      </Link>
      <QuickAddModal
        product={product}
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-20 text-center text-sm text-muted-foreground">
        Nothing in this edit just yet — please check back soon.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
      {products.map((p) => (
        <ProductCard key={p.id + p.name} product={p} />
      ))}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section
      className="border-b border-border/70 px-6 pb-16 pt-40 sm:px-8"
      style={{ backgroundImage: "var(--gradient-pastel)" }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-[2.25rem] leading-[1.1] text-foreground sm:text-[3.25rem]">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
          {intro}
        </p>
        <div className="mx-auto mt-7 w-24">
          <div className="foil-rule" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
