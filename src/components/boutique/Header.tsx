import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

const linkClass =
  "relative text-[0.6875rem] uppercase tracking-[0.22em] text-foreground/70 transition-colors duration-300 hover:text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-500 hover:after:w-full";

const NAV = [
  { label: "Shop", to: "/shop", search: {} },
  { label: "Collections", to: "/collections", search: {} },
  { label: "New Arrivals", to: "/new-arrivals", search: {} },
  { label: "Gifting", to: "/shop", search: { category: "gifting" } },
  { label: "About", to: "/", search: {} },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
        scrolled
          ? "border-b border-border/70 bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <p className="bg-cream/80 py-2 text-center text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
        Complimentary gift wrapping · Worldwide delivery
      </p>

      <div className="mx-auto grid max-w-[88rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-8 lg:grid-cols-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-foreground/70 transition-colors hover:text-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.slice(0, 3).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search}
                className={linkClass}
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link to="/" className="min-w-0 text-center">
          <span className="block truncate font-serif text-base tracking-[0.1em] text-foreground sm:text-2xl sm:tracking-[0.16em]">
            MAISON PETIT
          </span>
          <span className="mt-0.5 hidden text-[0.5rem] uppercase tracking-[0.44em] text-muted-foreground sm:block">
            Paris · Est. 1974
          </span>
        </Link>

        <div className="flex items-center justify-end gap-1 sm:gap-3">
          <nav className="mr-2 hidden items-center gap-8 lg:flex">
            {NAV.slice(3).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search}
                className={linkClass}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {[
            { icon: Search, label: "Search" },
            { icon: User, label: "Account" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-foreground/70 transition-all duration-300 hover:bg-cream hover:text-foreground"
            >
              <Icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.25} />
            </button>
          ))}
          <button
            type="button"
            aria-label="Cart, 2 items"
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-foreground/70 transition-all duration-300 hover:bg-cream hover:text-foreground"
          >
            <ShoppingBag className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.25} />
            <span className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-gold text-[0.5625rem] font-medium text-primary-foreground">
              2
            </span>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] lg:hidden",
          open ? "max-h-80" : "max-h-0 border-transparent",
        )}
      >
        <nav className="flex flex-col px-6 py-3">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              search={item.search}
              onClick={() => setOpen(false)}
              className="border-b border-border/50 py-3.5 text-[0.6875rem] uppercase tracking-[0.24em] text-foreground/75 last:border-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
