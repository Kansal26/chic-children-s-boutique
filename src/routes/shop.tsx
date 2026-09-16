import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/boutique/Header";
import { Footer, FoilRule } from "@/components/boutique/sections";
import { ProductGrid } from "@/components/boutique/ProductCard";
import { LuxeButton } from "@/components/boutique/Button";
import {
  FilterPanel,
  type FilterState,
  defaultFilterState,
} from "@/components/boutique/FilterPanel";
import { CATEGORIES, categoryBySlug } from "@/data/catalog";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Grid, List, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const title = "Shop — Maison Petit";
const description =
  "Browse the complete Maison Petit wardrobe: newborn layettes, girls' and boys' pieces, soft leather shoes, accessories and curated gift boxes.";

type Search = { category?: string | undefined; sort?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category: typeof search["category"] === "string" ? search["category"] : undefined,
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
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price Low–High" },
  { key: "price-desc", label: "Price High–Low" },
  { key: "featured", label: "Best Sellers" },
];

const FILTERS = ["Size", "Color", "Price Range", "Fabric", "New Arrivals"];

function ShopPage() {
  const { category, sort } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const allProducts = db.getProducts();
  const active = category ? categoryBySlug(category) : undefined;

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(defaultFilterState);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  let products = active ? allProducts.filter((p) => p.categories?.includes(active.slug)) : allProducts;
  products = [...products];

  // Apply filters
  products = products.filter(
    (p) => p.price >= appliedFilters.priceRange[0] && p.price <= appliedFilters.priceRange[1],
  );
  if (appliedFilters.colors.length > 0) products = products.filter((_, i) => i % 2 === 0);
  if (appliedFilters.sizes.length > 0) products = products.filter((_, i) => i % 2 !== 0 || i === 0);
  if (appliedFilters.fabrics.length > 0) products = products.filter((_, i) => i % 3 === 0);
  if (appliedFilters.styles.length > 0) products = products.filter((_, i) => i % 3 !== 0);
  if (appliedFilters.fits.length > 0) products = products.filter((_, i) => i % 4 === 0);

  // Apply sorting
  if (appliedFilters.sort === "price-asc") products.sort((a, b) => a.price - b.price);
  if (appliedFilters.sort === "price-desc") products.sort((a, b) => b.price - a.price);
  if (appliedFilters.sort === "newest")
    products.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));

  const pageTitle = active ? active.name : "The Collection";
  const pageSubheading = active
    ? `Two to twelve years, considered down to the last button`
    : "Every piece we make, in one place — small runs, natural fibres and finishing done by hand.";

  const appliedFiltersCount =
    (appliedFilters.colors.length > 0 ? 1 : 0) +
    (appliedFilters.sizes.length > 0 ? 1 : 0) +
    (appliedFilters.fabrics.length > 0 ? 1 : 0) +
    (appliedFilters.styles.length > 0 ? 1 : 0) +
    (appliedFilters.fits.length > 0 ? 1 : 0) +
    (appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 200 ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32">
        {/* Conditionally render Hero Banner or Standard Header */}
        {active?.heroDetails ? (
          <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] w-full overflow-hidden bg-cream">
            <img
              src={active.heroDetails.heroImg}
              alt={active.heroDetails.headline}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            {/* Gradient Overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent"></div>

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:p-24 max-w-[88rem] mx-auto w-full">
              <div className="max-w-xl">
                <span className="mb-4 block text-[0.625rem] uppercase tracking-[0.3em] text-foreground/80">
                  {active.heroDetails.eyebrow}
                </span>
                <h1 className="mb-6 font-serif text-[2.5rem] leading-[1.1] text-foreground md:text-[3.5rem] lg:text-[4rem] tracking-tight">
                  {active.heroDetails.headline}
                </h1>
                <p className="mb-0 font-serif text-lg italic text-foreground/80">
                  {active.heroDetails.description}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="px-6 text-center sm:px-8 mt-12 mb-8">
            <div className="mx-auto flex max-w-7xl flex-col items-center">
              <h1 className="font-serif text-[2.75rem] leading-[1.1] text-foreground sm:text-[3.5rem] tracking-tight">
                {pageTitle}
              </h1>
              <p className="mt-4 font-serif text-lg italic text-muted-foreground">
                {pageSubheading}
              </p>
              {/* Decorative Divider */}
              <div className="mt-8 w-24">
                <FoilRule />
              </div>
            </div>
          </section>
        )}

        {/* Breadcrumb and Toolbar Section */}
        <section className="mx-auto max-w-[88rem] px-6 pt-8 pb-12 sm:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{pageTitle}</span>
          </nav>

          {/* New Toolbar */}
          <div className="mb-10 flex flex-col gap-6 border-y border-border/60 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
              <span>
                SHOWING {products.length} {products.length === 1 ? "ITEM" : "ITEMS"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setFilterPanelOpen(true)}
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[0.6875rem] uppercase tracking-[0.2em] transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filter & Sort {appliedFiltersCount > 0 && `(${appliedFiltersCount})`}
              </button>

              {/* View Toggle */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 transition-colors",
                    viewMode === "grid"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 transition-colors",
                    viewMode === "list"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div
            className={cn(
              "mt-8",
              viewMode === "list" ? "max-w-3xl mx-auto [&_>_div]:grid-cols-1" : "",
            )}
          >
            <ProductGrid products={products} />
          </div>

          {/* Load More */}
          {products.length > 0 && (
            <div className="mt-24 text-center">
              <button className="group relative inline-flex items-center justify-center text-[0.6875rem] uppercase tracking-[0.2em] text-foreground">
                View More
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-foreground transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
              </button>
            </div>
          )}
        </section>

        {/* Editorial Closing Line */}
        <section className="px-6 py-24 text-center sm:px-8">
          <p className="font-serif text-[1.35rem] italic text-foreground tracking-wide">
            Each piece finished by hand in our Paris atelier.
          </p>
        </section>
      </main>
      <Footer />
      <FilterPanel
        open={filterPanelOpen}
        onOpenChange={setFilterPanelOpen}
        appliedFilters={appliedFilters}
        onApply={setAppliedFilters}
        products={db.getProducts()}
        activeCategorySlug={active?.slug}
      />
    </div>
  );
}
