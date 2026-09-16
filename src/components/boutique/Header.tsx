import { useEffect, useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  Heart,
  Plus,
  Minus,
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/data/catalog";
import { LuxeButton } from "./Button";
import craft from "@/assets/craft.jpg";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const linkClass =
  "relative text-[0.6875rem] uppercase tracking-[0.22em] text-foreground/70 transition-colors duration-300 hover:text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-500 hover:after:w-full";

const NAV = [
  { label: "Shop", to: "/shop", search: {} },
  { label: "Collections", to: "/collections", search: {} },
  { label: "New Arrivals", to: "/new-arrivals", search: {} },
  { label: "About", to: "/", search: {} },
] as const;

const MEGA_COLLECTIONS = [
  { label: "Spring · Summer Collection", to: "/collections" },
  { label: "Heritage Knitwear", to: "/collections" },
  { label: "Occasion Wear", to: "/collections" },
  { label: "Everyday Essentials", to: "/collections" },
  { label: "Limited Editions", to: "/collections" },
];

const MEGA_CATEGORIES = [
  { label: "Newborn", to: "/shop", search: { category: "newborn" }, color: "bg-pastel-pink-deep" },
  { label: "Girls", to: "/shop", search: { category: "girls" }, color: "bg-pastel-lavender-deep" },
  { label: "Boys", to: "/shop", search: { category: "boys" }, color: "bg-pastel-blue-deep" },
  {
    label: "Accessories",
    to: "/shop",
    search: { category: "accessories" },
    color: "bg-pastel-mint-deep",
  },
  { label: "Shoes", to: "/shop", search: { category: "shoes" }, color: "bg-pastel-peach-deep" },
];

const MEGA_EDITS = [
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Best Sellers", to: "/shop" },
  { label: "Organic Cotton Edit", to: "/collections" },
  { label: "French Linen Edit", to: "/collections" },
];

const ANNOUNCEMENTS = [
  "New Season Arrivals Now Live",
  "Free Returns Within 30 Days",
  "Sign Up for 10% Off Your First Order",
  "Hand-Finished in Portugal · Organic & OEKO-TEX Certified",
];

function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      className="relative bg-black py-2 group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-5xl px-8 flex justify-center items-center relative h-4">
        {ANNOUNCEMENTS.map((msg, index) => {
          const isActive = index === currentIndex;
          return (
            <p
              key={index}
              className={cn(
                "absolute inset-x-8 text-center text-[0.625rem] uppercase tracking-[0.3em] text-white transition-all duration-[800ms] ease-in-out",
                isActive
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none",
              )}
              aria-hidden={!isActive}
            >
              {msg}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);

  const { cart, wishlist, updateCartQuantity, removeFromCart } = useStore();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistItemCount = wishlist.length;

  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] bg-background/85 backdrop-blur-xl",
        scrolled ? "border-b border-border/70" : "border-b border-transparent",
      )}
    >
      <AnnouncementBar />

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
            {NAV.slice(0, 3).map((item) => {
              if (item.label === "Collections") {
                return (
                  <div
                    key={item.label}
                    className="relative py-4"
                    onMouseEnter={() => setMegaMenuOpen(true)}
                    onMouseLeave={() => setMegaMenuOpen(false)}
                  >
                    <Link
                      to={item.to}
                      search={item.search}
                      className={cn(linkClass, megaMenuOpen && "text-foreground after:w-full")}
                      activeProps={{ className: "text-foreground" }}
                      aria-expanded={megaMenuOpen}
                    >
                      {item.label}
                    </Link>
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  search={item.search}
                  className={linkClass}
                  activeProps={{ className: "text-foreground" }}
                >
                  {item.label}
                </Link>
              );
            })}
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
              <Link key={item.label} to={item.to} search={item.search} className={linkClass}>
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Search"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-foreground/70 transition-all duration-300 hover:bg-cream hover:text-foreground"
          >
            <Search className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.25} />
          </button>

          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${wishlistItemCount} items`}
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-foreground/70 transition-all duration-300 hover:bg-cream hover:text-foreground"
          >
            <Heart className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.25} />
            {wishlistItemCount > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-gold text-[0.5625rem] font-medium text-primary-foreground">
                {wishlistItemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label="Account"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-foreground/70 transition-all duration-300 hover:bg-cream hover:text-foreground"
          >
            <User className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.25} />
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={`Cart, ${cartItemCount} items`}
                className="relative grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-foreground/70 transition-all duration-300 hover:bg-cream hover:text-foreground"
              >
                <ShoppingBag className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.25} />
                {cartItemCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-gold text-[0.5625rem] font-medium text-primary-foreground">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border/70 bg-background/95 backdrop-blur-xl">
              <SheetHeader className="px-6 py-6 border-b border-border/70 flex flex-row items-center justify-between">
                <SheetTitle className="font-serif text-2xl font-normal tracking-tight">
                  Your Bag ({cartItemCount})
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-6 text-center space-y-6">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/30" strokeWidth={1} />
                    <p className="font-serif text-xl text-foreground">Your bag is empty.</p>
                    <SheetClose asChild>
                      <LuxeButton variant="outline" className="mt-4">
                        Continue Shopping
                      </LuxeButton>
                    </SheetClose>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {cart.map((item, i) => (
                      <div
                        key={`${item.product.id}-${item.size}-${item.color}-${i}`}
                        className="flex gap-4 p-6 border-b border-border/50"
                      >
                        <Link
                          to="/product/$productId"
                          params={{ productId: item.product.id }}
                          className="shrink-0"
                        >
                          <div className="w-24 aspect-[4/5] rounded-[8px] overflow-hidden bg-cream border border-border/30">
                            <img
                              src={item.product.img}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>

                        <div className="flex flex-col flex-1 min-w-0">
                          <Link
                            to="/product/$productId"
                            params={{ productId: item.product.id }}
                            className="hover:opacity-80 transition-opacity"
                          >
                            <h4 className="font-serif text-[1.125rem] leading-snug text-foreground truncate">
                              {item.product.name}
                            </h4>
                          </Link>
                          <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-1.5">
                            {item.color && (
                              <span
                                className={cn(
                                  "inline-block w-2 h-2 rounded-full ring-1 ring-border",
                                  item.color,
                                )}
                              />
                            )}
                            {item.size || "One Size"}
                          </p>
                          <p className="mt-3 font-sans text-xs tracking-wider text-muted-foreground">
                            {formatPrice(item.product.price)}
                          </p>

                          <div className="mt-auto pt-4 flex items-center justify-between">
                            <div className="flex items-center rounded-[6px] border border-border h-8">
                              <button
                                onClick={() =>
                                  item.quantity > 1
                                    ? updateCartQuantity(
                                        item.product.id,
                                        item.size,
                                        item.color,
                                        item.quantity - 1,
                                      )
                                    : removeFromCart(item.product.id, item.size, item.color)
                                }
                                className="px-2.5 h-full text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-[0.6875rem] font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateCartQuantity(
                                    item.product.id,
                                    item.size,
                                    item.color,
                                    item.quantity + 1,
                                  )
                                }
                                className="px-2.5 h-full text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                              className="text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-border/70 bg-background sticky bottom-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-foreground">
                      Subtotal
                    </span>
                    <span className="font-sans text-sm tracking-wider">
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>
                  <p className="text-[0.625rem] text-muted-foreground mb-6">
                    Shipping and taxes calculated at checkout
                  </p>

                  <SheetClose asChild>
                    <Link to="/checkout" className="block w-full">
                      <LuxeButton className="w-full bg-pastel-pink/20 hover:bg-pastel-pink/30 text-foreground border-foreground/20">
                        CHECKOUT
                      </LuxeButton>
                    </Link>
                  </SheetClose>

                  <div className="mt-4 text-center">
                    <SheetClose asChild>
                      <Link to="/cart" className="text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
                        View Full Bag
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>

          <Link
            to="/"
            aria-label="Home"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-foreground/70 transition-all duration-300 hover:bg-cream hover:text-foreground"
          >
            <Home className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.25} />
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] lg:hidden",
          open ? "max-h-screen overflow-y-auto" : "max-h-0 border-transparent",
        )}
      >
        <nav className="flex flex-col px-6 py-3">
          {NAV.map((item) => {
            if (item.label === "Collections") {
              return (
                <div key={item.label} className="border-b border-border/50 last:border-0">
                  <button
                    onClick={() => setMobileCollectionsOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between py-3.5 text-left text-[0.6875rem] uppercase tracking-[0.24em] text-foreground/75 transition-colors hover:text-foreground"
                    aria-expanded={mobileCollectionsOpen}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        mobileCollectionsOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      mobileCollectionsOpen ? "max-h-96 opacity-100 mb-2" : "max-h-0 opacity-0",
                    )}
                  >
                    <div className="flex flex-col gap-3 pl-4 pt-1 pb-2 border-l border-border/30 ml-1">
                      {MEGA_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.label}
                          to={cat.to}
                          search={cat.search}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground"
                        >
                          <span className={cn("h-1.5 w-1.5 rounded-full", cat.color)} />
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.to}
                search={item.search}
                onClick={() => setOpen(false)}
                className="border-b border-border/50 py-3.5 text-[0.6875rem] uppercase tracking-[0.24em] text-foreground/75 last:border-0 hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mega-Menu Overlay Dimmer */}
      <div
        className={cn(
          "fixed inset-0 top-[100%] bg-black/10 backdrop-blur-[2px] transition-all duration-300 ease-out z-[-1] lg:block hidden",
          megaMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      />

      {/* Desktop Mega-Menu Panel */}
      <div
        className={cn(
          "absolute left-0 top-[100%] w-full bg-cream border-t border-border/50 shadow-sm transition-all duration-300 ease-out origin-top hidden lg:block overflow-hidden z-40",
          megaMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible",
        )}
        onMouseEnter={() => setMegaMenuOpen(true)}
        onMouseLeave={() => setMegaMenuOpen(false)}
      >
        <div className="mx-auto max-w-7xl px-8 py-12">
          <div className="grid grid-cols-12 gap-8">
            {/* Columns 1-3 */}
            <div className="col-span-8 grid grid-cols-3 gap-8">
              {/* Column 1 */}
              <div>
                <h3 className="font-serif text-[0.75rem] uppercase tracking-[0.15em] text-muted-foreground mb-6">
                  Collections
                </h3>
                <ul className="flex flex-col gap-4">
                  {MEGA_COLLECTIONS.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-sm text-foreground/80 hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-border"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2 */}
              <div className="border-l border-border/70 pl-8">
                <h3 className="font-serif text-[0.75rem] uppercase tracking-[0.15em] text-muted-foreground mb-6">
                  Categories
                </h3>
                <ul className="flex flex-col gap-4">
                  {MEGA_CATEGORIES.map((cat) => (
                    <li key={cat.label}>
                      <Link
                        to={cat.to}
                        search={cat.search}
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-sm text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2 group"
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-125",
                            cat.color,
                          )}
                        />
                        <span className="group-hover:underline underline-offset-4 decoration-border">
                          {cat.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3 */}
              <div className="border-l border-border/70 pl-8">
                <h3 className="font-serif text-[0.75rem] uppercase tracking-[0.15em] text-muted-foreground mb-6">
                  Curated Edits
                </h3>
                <ul className="flex flex-col gap-4">
                  {MEGA_EDITS.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        search={"search" in link ? link.search : {}}
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-sm text-foreground/80 hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-border"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 4: Visual Panel */}
            <div className="col-span-4 border-l border-border/70 pl-8">
              <Link
                to="/#story"
                onClick={() => setMegaMenuOpen(false)}
                className="group block overflow-hidden rounded-[8px] bg-background"
              >
                <div className="aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={craft}
                    alt="Artisan crafting a garment"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-4 bg-background">
                  <h4 className="font-serif text-base text-foreground group-hover:text-gold transition-colors">
                    The Artisan Edit
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">Hand-finished in Portugal</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
