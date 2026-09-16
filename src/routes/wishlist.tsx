import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/boutique/Header";
import { Footer } from "@/components/boutique/sections";
import { ProductGrid } from "@/components/boutique/ProductCard";
import { PRODUCTS } from "@/data/catalog";
import { LuxeButton } from "@/components/boutique/Button";
import { useStore } from "@/lib/store";
import { Heart } from "lucide-react";

const title = "Wishlist — Maison Petit";
const description = "Pieces you're considering.";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{ title }, { name: "description", content: description }],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useStore();

  const wishlistedProducts = wishlist
    .map((item) => PRODUCTS.find((p) => p.id === item.productId))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        {/* Breadcrumb & Header */}
        <section className="px-6 text-center sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center">
            <nav className="mb-6 text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Wishlist</span>
            </nav>

            <h1 className="font-serif text-[2.75rem] leading-[1.1] text-foreground sm:text-[3.5rem] tracking-tight">
              Your Wishlist
            </h1>
            <p className="mt-4 font-serif text-lg italic text-muted-foreground">
              Pieces you're considering.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[88rem] px-6 py-16 sm:px-8">
          {wishlistedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <Heart className="h-12 w-12 text-muted-foreground/30" strokeWidth={1} />
              <p className="font-serif text-xl text-foreground">Your wishlist is empty.</p>
              <LuxeButton variant="outline" className="mt-4" asChild>
                <Link to="/shop">Explore Collections</Link>
              </LuxeButton>
            </div>
          ) : (
            <ProductGrid products={wishlistedProducts} />
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
