import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/boutique/Header";
import { Footer, Newsletter } from "@/components/boutique/sections";
import { PageHero, ProductGrid } from "@/components/boutique/ProductCard";
import { CATEGORIES, PRODUCTS, categoryBySlug } from "@/data/catalog";
import { cn } from "@/lib/utils";

const title = "Shop All — Maison Petit";
const description =
  "Browse the complete Maison Petit wardrobe: newborn layettes, girls' and boys' pieces, soft leather shoes, accessories and curated gift boxes.";

type Search = { category?: string | undefined; sort?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category:
      typeof search["category"] === "string" ? search["category"] : undefined,
    sort: typeof search["sort"] === "string" ? search["sort"] : undefined,
  }),
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
  component: ShopPage,
});

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price · Low" },
  { key: "price-desc", label: "Price · High" },
  { key: "newest", label: "Newest" },
];

function ShopPage() {
  const { category, sort } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const active = category ? categoryBySlug(category) : undefined;

  let products = active
    ? PRODUCTS.filter((p) => p.category === active.slug)
    : PRODUCTS;
  products = [...products];
  if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
  if (sort === "newest")
    products.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero
          eyebrow="The Wardrobe"
          title={active ? active.name : "Shop all"}
          intro={
            active
              ? active.blurb
              : "Every piece we make, in one place — small runs, natural fibres and finishing done by hand."
          }
        />

        <section className="mx-auto max-w-[88rem] px-6 py-14 sm:px-8">
          <div className="flex flex-col gap-6 border-b border-border/70 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="-mx-1 flex flex-wrap gap-2">
              <Link
                to="/shop"
                search={(prev) => ({ sort: prev.sort })}
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.625rem] uppercase tracking-[0.2em] transition-all duration-300",
                  !active
                    ? "border-gold bg-gold/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                )}
              >
                All
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to="/shop"
                  search={(prev) => ({ ...prev, category: c.slug })}
                  className={cn(
                    "rounded-full border px-4 py-2 text-[0.625rem] uppercase tracking-[0.2em] transition-all duration-300",
                    active?.slug === c.slug
                      ? `border-transparent text-foreground ${c.tint}`
                      : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                  )}
                >
                  {c.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-muted-foreground">
                {products.length} pieces
              </span>
              <label htmlFor="sort" className="sr-only">
                Sort by
              </label>
              <select
                id="sort"
                value={sort ?? "featured"}
                onChange={(e) =>
                  navigate({
                    search: (prev) => ({ ...prev, sort: e.target.value }),
                  })
                }
                className="h-10 rounded-[10px] border border-input bg-background px-3 text-[0.625rem] uppercase tracking-[0.18em] text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-12">
            <ProductGrid products={products} />
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
