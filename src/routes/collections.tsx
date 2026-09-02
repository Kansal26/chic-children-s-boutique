import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/boutique/Header";
import { Footer, Newsletter } from "@/components/boutique/sections";
import { PageHero } from "@/components/boutique/ProductCard";
import { CATEGORIES, PRODUCTS, formatPrice } from "@/data/catalog";

const title = "Collections — Maison Petit";
const description =
  "Six considered edits: newborn, girls, boys, accessories, shoes and gifting — each made in small runs in our Lisbon atelier.";

export const Route = createFileRoute("/collections")({
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
  component: CollectionsPage,
});

function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero
          eyebrow="The Edits"
          title="Our collections"
          intro="Each edit is designed as a small wardrobe — pieces that layer together and pass down beautifully."
        />

        <section className="mx-auto max-w-[88rem] space-y-6 px-6 py-16 sm:px-8 sm:py-24">
          {CATEGORIES.map((c, i) => {
            const items = PRODUCTS.filter((p) => p.category === c.slug);
            const from = Math.min(...items.map((p) => p.price));
            return (
              <Link
                key={c.slug}
                to="/shop"
                search={{ category: c.slug }}
                className="group grid overflow-hidden rounded-[16px] border border-border/70 shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)] lg:grid-cols-2"
              >
                <div
                  className={`relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[22rem] ${i % 2 ? "lg:order-2" : ""}`}
                >
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.06]"
                  />
                </div>
                <div
                  className={`flex flex-col justify-center gap-5 p-8 sm:p-14 ${c.tint}/40`}
                >
                  <p className="eyebrow">{c.note}</p>
                  <h2 className="font-serif text-[2rem] leading-tight text-foreground sm:text-[2.5rem]">
                    {c.name}
                  </h2>
                  <div className="w-20">
                    <div className="foil-rule" aria-hidden="true" />
                  </div>
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                    {c.blurb}
                  </p>
                  <p className="text-[0.625rem] uppercase tracking-[0.22em] text-muted-foreground">
                    {items.length} pieces · from {formatPrice(from)}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.24em] text-foreground transition-all duration-500 group-hover:gap-4">
                    Explore the edit
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.25} />
                  </span>
                </div>
              </Link>
            );
          })}
        </section>

        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
