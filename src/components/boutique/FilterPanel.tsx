import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LuxeButton } from "./Button";
import type { Product } from "@/data/catalog";

export type FilterState = {
  priceRange: [number, number];
  sort: string;
  colors: string[];
  sizes: string[];
  fabrics: string[];
  styles: string[];
  fits: string[];
};

export const defaultFilterState: FilterState = {
  priceRange: [0, 200],
  sort: "newest",
  colors: [],
  sizes: [],
  fabrics: [],
  styles: [],
  fits: [],
};

const COLORS = [
  { label: "Pink", class: "bg-pastel-pink-deep" },
  { label: "Lilac", class: "bg-pastel-lavender-deep" },
  { label: "Blue", class: "bg-pastel-blue-deep" },
  { label: "Mint", class: "bg-pastel-mint-deep" },
  { label: "Peach", class: "bg-pastel-peach-deep" },
  { label: "Gold", class: "bg-gold" },
  { label: "White", class: "bg-white border border-border" },
  { label: "Grey", class: "bg-gray-300" },
];

const SIZES = ["0–3M", "3–6M", "6–12M", "12–18M", "18–24M", "2Y", "3Y", "4Y", "5Y", "6Y"];
const FABRICS = ["Organic Cotton", "French Linen", "Cashmere Blend", "Wool Blend"];
const STYLES = ["Casual", "Occasion", "Everyday"];
const FITS = ["Regular", "Relaxed", "Fitted"];
const SORTS = [
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price Low–High" },
  { key: "price-desc", label: "Price High–Low" },
  { key: "featured", label: "Best Sellers" },
];

interface FilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appliedFilters: FilterState;
  onApply: (filters: FilterState) => void;
  products: Product[];
  activeCategorySlug?: string;
}

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 px-6 text-[0.6875rem] uppercase tracking-[0.24em] text-foreground/80 hover:text-foreground transition-colors"
      >
        {title}
        <ChevronRight
          className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-90")}
          strokeWidth={1.5}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 px-6",
          isOpen ? "max-h-[800px] pb-6 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function FilterPanel({
  open,
  onOpenChange,
  appliedFilters,
  onApply,
  products,
  activeCategorySlug,
}: FilterPanelProps) {
  const [draft, setDraft] = useState<FilterState>(appliedFilters);

  // Reset draft to applied when opened
  useEffect(() => {
    if (open) {
      setDraft(appliedFilters);
    }
  }, [open, appliedFilters]);

  const toggleArray = (key: keyof FilterState, value: string) => {
    setDraft((prev) => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((item) => item !== value) : [...arr, value],
      };
    });
  };

  const clearAll = () => {
    setDraft(defaultFilterState);
  };

  // Simulate calculating live count
  const calculateLiveCount = (f: FilterState) => {
    let list = activeCategorySlug
      ? products.filter((p) => p.categories?.includes(activeCategorySlug))
      : products;

    // Price
    list = list.filter((p) => p.price >= f.priceRange[0] && p.price <= f.priceRange[1]);

    // Simulating match logic: since our products lack exact sizes/colors/fabrics,
    // we randomly include some if filter is applied to show UI functioning
    if (f.colors.length > 0) list = list.filter((_, i) => i % 2 === 0);
    if (f.sizes.length > 0) list = list.filter((_, i) => i % 2 !== 0 || i === 0);
    if (f.fabrics.length > 0) list = list.filter((_, i) => i % 3 === 0);
    if (f.styles.length > 0) list = list.filter((_, i) => i % 3 !== 0);
    if (f.fits.length > 0) list = list.filter((_, i) => i % 4 === 0);

    return list.length;
  };

  const liveCount = calculateLiveCount(draft);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-[450px] p-0 flex flex-col border-l border-border/70 bg-cream shadow-2xl z-[100]"
        hideClose
      >
        <SheetHeader className="px-6 py-6 border-b border-border/70 flex flex-row items-center justify-between sticky top-0 bg-cream z-10">
          <SheetTitle className="font-serif text-[1.125rem] tracking-wide m-0 leading-none mt-1">
            Filter & Sort
          </SheetTitle>
          <SheetClose className="grid h-8 w-8 place-items-center border border-foreground text-foreground hover:bg-foreground hover:text-primary-foreground transition-colors m-0">
            <X className="h-4 w-4" strokeWidth={1} />
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto pb-24">
          <CollapsibleSection title="Price Range" defaultOpen={true}>
            <div className="flex items-center justify-between text-xs tracking-wider font-sans mb-4 text-foreground/80">
              <span>€{draft.priceRange[0]}</span>
              <span>€{draft.priceRange[1]}</span>
            </div>
            <Slider
              defaultValue={[0, 200]}
              max={200}
              step={5}
              value={draft.priceRange}
              onValueChange={(val) => setDraft({ ...draft, priceRange: val as [number, number] })}
              className="py-2"
            />
          </CollapsibleSection>

          <CollapsibleSection title="Sort By">
            <div className="flex flex-col gap-3">
              {SORTS.map((sort) => (
                <label key={sort.key} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 rounded-full border border-border group-hover:border-foreground/50 transition-colors">
                    {draft.sort === sort.key && (
                      <div className="w-2 h-2 rounded-full bg-foreground" />
                    )}
                  </div>
                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                    {sort.label}
                  </span>
                  <input
                    type="radio"
                    className="hidden"
                    checked={draft.sort === sort.key}
                    onChange={() => setDraft({ ...draft, sort: sort.key })}
                  />
                </label>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Color">
            <div className="flex flex-wrap gap-4">
              {COLORS.map((color) => {
                const isSelected = draft.colors.includes(color.label);
                return (
                  <button
                    key={color.label}
                    onClick={() => toggleArray("colors", color.label)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full transition-all duration-300 ring-offset-2 ring-offset-cream flex items-center justify-center",
                        color.class,
                        isSelected ? "ring-1 ring-foreground scale-110" : "ring-0 hover:scale-110",
                      )}
                    >
                      {isSelected && color.label !== "White" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white/40 backdrop-blur-sm" />
                      )}
                      {isSelected && color.label === "White" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                      )}
                    </div>
                    <span className="text-[0.625rem] uppercase tracking-wider text-muted-foreground">
                      {color.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Size">
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => {
                const isSelected = draft.sizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleArray("sizes", size)}
                    className={cn(
                      "px-4 py-2 border rounded-full text-xs transition-colors",
                      isSelected
                        ? "border-foreground bg-pastel-blush/30 text-foreground"
                        : "border-border text-foreground/70 hover:border-foreground/40",
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Fabric">
            <div className="flex flex-col gap-3">
              {FABRICS.map((fabric) => {
                const isSelected = draft.fabrics.includes(fabric);
                return (
                  <label key={fabric} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={cn(
                        "w-4 h-4 border rounded-[2px] transition-colors flex items-center justify-center",
                        isSelected
                          ? "border-foreground bg-foreground text-primary-foreground"
                          : "border-border group-hover:border-foreground/50",
                      )}
                    >
                      {isSelected && <span className="text-[10px]">✓</span>}
                    </div>
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                      {fabric}
                    </span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isSelected}
                      onChange={() => toggleArray("fabrics", fabric)}
                    />
                  </label>
                );
              })}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Style">
            <div className="flex flex-col gap-3">
              {STYLES.map((style) => {
                const isSelected = draft.styles.includes(style);
                return (
                  <label key={style} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={cn(
                        "w-4 h-4 border rounded-[2px] transition-colors flex items-center justify-center",
                        isSelected
                          ? "border-foreground bg-foreground text-primary-foreground"
                          : "border-border group-hover:border-foreground/50",
                      )}
                    >
                      {isSelected && <span className="text-[10px]">✓</span>}
                    </div>
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                      {style}
                    </span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isSelected}
                      onChange={() => toggleArray("styles", style)}
                    />
                  </label>
                );
              })}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Fit">
            <div className="flex flex-col gap-3">
              {FITS.map((fit) => {
                const isSelected = draft.fits.includes(fit);
                return (
                  <label key={fit} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={cn(
                        "w-4 h-4 border rounded-[2px] transition-colors flex items-center justify-center",
                        isSelected
                          ? "border-foreground bg-foreground text-primary-foreground"
                          : "border-border group-hover:border-foreground/50",
                      )}
                    >
                      {isSelected && <span className="text-[10px]">✓</span>}
                    </div>
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                      {fit}
                    </span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isSelected}
                      onChange={() => toggleArray("fits", fit)}
                    />
                  </label>
                );
              })}
            </div>
          </CollapsibleSection>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-cream border-t border-border/70 flex items-center justify-between z-10">
          <button
            onClick={clearAll}
            className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            Clear
          </button>
          <LuxeButton
            onClick={() => {
              onApply(draft);
              onOpenChange(false);
            }}
            className="w-48 bg-pastel-blush/40 hover:bg-pastel-blush/60 text-foreground border-foreground/10"
          >
            View [{liveCount}]
          </LuxeButton>
        </div>
      </SheetContent>
    </Sheet>
  );
}
