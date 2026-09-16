import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/boutique/Header";
import { Footer, FoilRule } from "@/components/boutique/sections";
import { ProductGrid } from "@/components/boutique/ProductCard";
import { NEW_ARRIVALS, PRODUCTS } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { Grid, List, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const title = "New Arrivals — Maison Petit";
const description =
  "The latest small-run pieces from our Lisbon atelier: hand-knit cardigans, pleated silks, washed linen and first-walker leather.";

type Search = { sort?: string | undefined };

export const Route = createFileRoute("/new-arrivals")({
  validateSearch: (search: Record<string, unknown>): Search => ({
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
  component: NewArrivalsPage,
});

const SORTS = [
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price Low–High" },
  { key: "price-desc", label: "Price High–Low" },
];

const FILTERS = ["Size", "Color", "Price Range", "Fabric"];

function NewArrivalsPage() {
  const { sort } = Route.useSearch();
  const navigate = useNavigate({ from: "/new-arrivals" });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter],
    );
  };

  const products = [...NEW_ARRIVALS];
  if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
  // Default is newest, which NEW_ARRIVALS implicitly is

  const pageTitle = "New Arrivals";
  const pageSubheading =
    "Released in limited quantity and restocked rarely — each piece is cut, sewn and finished by hand.";

  const filterPills = (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map((filter) => {
        const isActive = activeFilters.includes(filter);
        return (
          <button
            key={filter}
            onClick={() => toggleFilter(filter)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-[0.625rem] uppercase tracking-[0.2em] transition-all duration-300",
              isActive
                ? "border-transparent bg-pastel-pink/30 text-foreground shadow-sm"
                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
          >
            {filter} {isActive && "✓"}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32">
        {/* Category Header Block */}
        <section className="px-6 text-center sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center">
            {/* Breadcrumb */}
            <nav className="mb-6 text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{pageTitle}</span>
            </nav>

            {/* Title & Subheading */}
            <h1 className="font-serif text-[2.75rem] leading-[1.1] text-foreground sm:text-[3.5rem] tracking-tight">
              {pageTitle}
            </h1>
            <p className="mt-4 font-serif text-lg italic text-muted-foreground">{pageSubheading}</p>

            {/* Decorative Divider */}
            <div className="mt-8 w-24">
              <FoilRule />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[88rem] px-6 py-12 sm:px-8">
          {/* Filter and Sort Bar */}
          <div className="mb-10 flex flex-col gap-6 border-y border-border/60 py-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Mobile: Filter & Sort Button (Sheet) */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex w-full items-center justify-between rounded-[10px] border border-input px-4 py-3 text-[0.6875rem] uppercase tracking-[0.2em] text-foreground hover:bg-cream/50">
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filter & Sort
                    </span>
                    <span className="text-muted-foreground">{products.length} Items</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-[20px] bg-background">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-xl font-normal text-left">
                      Filter
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <p className="text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                      Filters
                    </p>
                    {filterPills}
                  </div>
                  <div className="mt-8">
                    <p className="text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                      Sort By
                    </p>
                    <div className="flex flex-col gap-2">
                      {SORTS.map((s) => (
                        <button
                          key={s.key}
                          onClick={() => navigate({ search: (prev) => ({ ...prev, sort: s.key }) })}
                          className={cn(
                            "text-left py-2 text-sm tracking-wide transition-colors",
                            sort === s.key
                              ? "text-foreground font-medium"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop: Filter Pills */}
            <div className="hidden lg:flex items-center gap-6">
              <span className="text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                Filter:
              </span>
              {filterPills}
            </div>

            {/* Right Side: Sort & View Toggle */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                Showing <span className="text-foreground font-medium">{products.length}</span> of{" "}
                {NEW_ARRIVALS.length} items
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Sort By
                </span>
                <div className="relative">
                  <select
                    value={sort ?? "newest"}
                    onChange={(e) =>
                      navigate({ search: (prev) => ({ ...prev, sort: e.target.value }) })
                    }
                    className="appearance-none bg-transparent py-1 pr-6 pl-2 text-[0.6875rem] uppercase tracking-[0.18em] text-foreground focus:outline-none cursor-pointer"
                  >
                    {SORTS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center gap-1 border-l border-border/60 pl-6">
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
    </div>
  );
}
