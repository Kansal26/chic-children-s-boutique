import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/boutique/Header";
import { Footer, Newsletter, ServiceStrip } from "@/components/boutique/sections";
import { PageHero, ProductGrid } from "@/components/boutique/ProductCard";
import { LuxeButton } from "@/components/boutique/Button";
import { NEW_ARRIVALS, PRODUCTS } from "@/data/catalog";

const title = "New Arrivals — Maison Petit";
const description =
  "The latest small-run pieces from our Lisbon atelier: hand-knit cardigans, pleated silks, washed linen and first-walker leather.";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewArrivalsPage,
});

const RESTOCKED = PRODUCTS.filter((p) => !p.isNew).slice(0, 4);

function NewArrivalsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero
          eyebrow="Spring · Summer"
          title="New this season"
          intro="Released in limited quantity and restocked rarely — each piece is cut, sewn and finished by hand."
        />
        <ServiceStrip />

        <section className="mx-auto max-w-[88rem] px-6 py-16 sm:px-8 sm:py-24">
          <div className="mb-12 flex items-end justify-between gap-6 border-b border-border/70 pb-6">
            <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
              Just arrived
            </h2>
            <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-muted-foreground">
              {NEW_ARRIVALS.length} pieces
            </span>
          </div>
          <ProductGrid products={NEW_ARRIVALS} />
        </section>

        <section className="bg-pastel-lavender/25 py-16 sm:py-24">
          <div className="mx-auto max-w-[88rem] px-6 sm:px-8">
            <div className="mb-12 flex items-end justify-between gap-6 border-b border-border/70 pb-6">
              <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
                Back in stock
              </h2>
              <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-muted-foreground">
                Restocked this week
              </span>
            </div>
            <ProductGrid products={RESTOCKED} />
            <div className="mt-16 text-center">
              <LuxeButton asChild>
                <Link to="/shop">Shop the full wardrobe</Link>
              </LuxeButton>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
