import { ArrowRight, Leaf, Scissors, Sparkles, Truck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { LuxeButton } from "./Button";
import { CATEGORIES, NEW_ARRIVALS, formatPrice } from "@/data/catalog";

import hero from "@/assets/hero.jpg";
import craft from "@/assets/craft.jpg";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import cNewborn from "@/assets/c-newborn.jpg";
import cGirls from "@/assets/c-girls.jpg";
import cBoys from "@/assets/c-boys.jpg";
import cAcc from "@/assets/c-acc.jpg";
import cShoes from "@/assets/c-shoes.jpg";
import cGift from "@/assets/c-gift.jpg";

export function FoilRule({ className = "" }: { className?: string }) {
  return <div className={`foil-rule ${className}`} aria-hidden="true" />;
}

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-foreground sm:text-[2.75rem]">
        {title}
      </h2>
      {intro ? (
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
          {intro}
        </p>
      ) : null}
      <div className="mx-auto mt-7 w-24">
        <FoilRule />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[92vh] w-full overflow-hidden">
      <img
        src={hero}
        alt="Child wearing a cream knit cardigan and blush pleated dress in a sunlit room"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover object-[74%_center] lg:object-[70%_center]"
      />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{ backgroundImage: "var(--gradient-veil)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 lg:hidden"
        style={{ backgroundImage: "var(--gradient-veil-vertical)" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-[92vh] max-w-[88rem] items-end px-6 pb-24 pt-40 sm:px-8 lg:items-center lg:pb-20">
        <div className="reveal max-w-xl">
          <p className="eyebrow">Spring · Summer Collection</p>
          <h1 className="mt-6 font-serif text-[2.75rem] leading-[1.05] text-foreground sm:text-6xl lg:text-[4.25rem]">
            Quiet elegance,
            <em className="block not-italic text-blush-deep">tailored small.</em>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Heirloom pieces cut from organic cotton, French linen and hand-finished
            knit — made to be worn, loved and passed along.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <LuxeButton size="lg" asChild>
              <Link to="/shop">Shop the Collection</Link>
            </LuxeButton>
            <LuxeButton variant="ghost" size="lg" asChild>
              <a href="#story">
                Our Atelier <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.25} />
              </a>
            </LuxeButton>
          </div>
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  { icon: Leaf, text: "Organic & OEKO-TEX certified", color: "text-pastel-mint-deep" },
  { icon: Scissors, text: "Hand-finished in Portugal", color: "text-pastel-pink-deep" },
  { icon: Sparkles, text: "Complimentary gift wrapping", color: "text-pastel-lavender-deep" },
  { icon: Truck, text: "Express worldwide delivery", color: "text-pastel-blue-deep" },
];

export function ServiceStrip() {
  return (
    <section className="border-y border-border/70 bg-pastel-lemon/35">
      <div className="mx-auto grid max-w-[88rem] grid-cols-2 gap-y-6 px-6 py-8 sm:px-8 lg:grid-cols-4">
        {SERVICES.map(({ icon: Icon, text, color }) => (
          <div key={text} className="flex min-w-0 items-center justify-center gap-3">
            <Icon className={`h-4 w-4 shrink-0 ${color}`} strokeWidth={1.5} />
            <span className="text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
              {text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Categories() {
  return (
    <section id="collections" className="mx-auto max-w-[88rem] px-6 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        eyebrow="The Wardrobe"
        title="Shop by category"
        intro="Six edits, each considered down to the last mother-of-pearl button."
      />
      <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            to="/shop"
            search={{ category: c.slug }}
            className="group text-center"
          >
            <div className={`rounded-full p-2 transition-colors duration-500 ${c.tint}`}>
              <div className={`relative mx-auto aspect-square w-full overflow-hidden rounded-full ring-1 ring-border transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:ring-2 ${c.ring}`}>
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  width={700}
                  height={700}
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-110"
                />
              </div>
            </div>
            <p className={`mt-5 font-serif text-lg text-foreground transition-colors duration-300 ${c.text}`}>
              {c.name}
            </p>
            <p className="mt-0.5 text-[0.5625rem] uppercase tracking-[0.24em] text-muted-foreground">
              {c.note}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Arrivals() {
  return (
    <section id="arrivals" className="bg-pastel-blue/25 py-24 sm:py-32">
      <div className="mx-auto max-w-[88rem] px-6 sm:px-8">
        <SectionHeading
          eyebrow="Just Arrived"
          title="New this season"
          intro="Small-run pieces released in limited quantity, restocked rarely."
        />
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
          {NEW_ARRIVALS.slice(0, 4).map((p) => (
            <article key={p.id} className="group">
              <div className="relative overflow-hidden rounded-[12px] bg-background shadow-[var(--shadow-soft)] transition-shadow duration-500 group-hover:shadow-[var(--shadow-lift)]">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.07]"
                />
                {p.tag ? (
                  <span className={`absolute left-4 top-4 rounded-[6px] border px-2.5 py-1 text-[0.5625rem] uppercase tracking-[0.22em] backdrop-blur-sm ${p.tagStyle}`}>
                    {p.tag}
                  </span>
                ) : null}
                <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  <LuxeButton size="sm" variant="solid" className="w-full">
                    Add to Bag
                  </LuxeButton>
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <h3 className="min-w-0 font-serif text-[1.0625rem] leading-snug text-foreground">
                  {p.name}
                </h3>
                <p className="shrink-0 text-xs tracking-[0.12em] text-muted-foreground">
                  {formatPrice(p.price)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-16 text-center">
          <LuxeButton asChild>
            <Link to="/new-arrivals">View All New Arrivals</Link>
          </LuxeButton>
        </div>
      </div>
    </section>
  );
}

export function Story() {
  return (
    <section id="story" className="mx-auto max-w-[88rem] px-6 py-24 sm:px-8 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="overflow-hidden rounded-[12px] shadow-[var(--shadow-soft)]">
          <img
            src={craft}
            alt="Hands folding delicate organic cotton children's garments in an atelier"
            loading="lazy"
            width={1408}
            height={1008}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:scale-[1.04]"
          />
        </div>
        <div className="max-w-lg">
          <p className="eyebrow">Since 1974</p>
          <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-foreground sm:text-[2.75rem]">
            Fifty years of small,
            <br />
            careful stitches.
          </h2>
          <div className="mt-7 w-24">
            <FoilRule />
          </div>
          <p className="mt-7 text-sm leading-[1.9] text-muted-foreground">
            Every Maison Petit piece begins in our Lisbon atelier, where a team of
            eleven seamstresses works with long-staple organic cotton, French linen
            and merino spun in the Pyrenees. Nothing is rushed; a single smocked
            bodice takes four hours by hand.
          </p>
          <p className="mt-4 text-sm leading-[1.9] text-muted-foreground">
            We make in small runs, mend for free, and design so that the second child
            wears it as beautifully as the first.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/70 pt-8">
            {[
              ["50", "Years", "text-pastel-pink-deep"],
              ["11", "Artisans", "text-pastel-blue-deep"],
              ["100%", "Natural fibres", "text-pastel-mint-deep"],
            ].map(([n, l, c]) => (
              <div key={l}>
                <p className={`font-serif text-3xl ${c}`}>{n}</p>
                <p className="mt-1 text-[0.5625rem] uppercase tracking-[0.2em] text-muted-foreground">
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const QUOTES = [
  {
    quote:
      "The rare children's label that parents covet as much as their children do.",
    source: "Vogue Bambini",
    color: "text-pastel-pink-deep",
    wash: "bg-pastel-pink/30",
  },
  {
    quote:
      "Impeccably made, quietly beautiful — the christening gown became a family heirloom.",
    source: "Éloïse M., Paris",
    color: "text-pastel-blue-deep",
    wash: "bg-pastel-blue/30",
  },
  {
    quote: "A masterclass in restraint. Nothing shouts, everything lasts.",
    source: "Milk Magazine",
    color: "text-pastel-lavender-deep",
    wash: "bg-pastel-lavender/30",
  },
];

const PRESS = ["VOGUE BAMBINI", "MILK", "T MAGAZINE", "KINFOLK", "MONOCLE"];

export function Testimonials() {
  return (
    <section className="border-y border-border/70 bg-pastel-peach/25 py-24 sm:py-32">
      <div className="mx-auto max-w-[88rem] px-6 sm:px-8">
        <SectionHeading eyebrow="Well Received" title="In good company" />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {QUOTES.map((q) => (
            <figure
              key={q.source}
              className={`hover-lift rounded-[12px] border border-border/70 p-8 shadow-[var(--shadow-soft)] ${q.wash}`}
            >
              <span className={`font-serif text-4xl leading-none ${q.color}`}>“</span>
              <blockquote className="mt-3 font-serif text-lg leading-relaxed text-foreground">
                {q.quote}
              </blockquote>
              <figcaption className="mt-6 text-[0.5625rem] uppercase tracking-[0.26em] text-muted-foreground">
                {q.source}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {PRESS.map((p) => (
            <span
              key={p}
              className="text-[0.6875rem] uppercase tracking-[0.3em] text-muted-foreground/70 transition-colors duration-300 hover:text-foreground"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="mx-auto max-w-[88rem] px-6 py-24 sm:px-8 sm:py-32">
      <div
        className="mx-auto max-w-3xl rounded-[24px] border border-border/60 px-6 py-16 text-center shadow-[var(--shadow-soft)] sm:px-16"
        style={{ backgroundImage: "var(--gradient-pastel)" }}
      >
        <p className="eyebrow">The List</p>
        <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-foreground sm:text-[2.75rem]">
          Join for early access
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Private previews of each collection, atelier notes, and first choice on
          limited pieces — twice a season, never more.
        </p>
        <form
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="your@email.com"
            className="h-11 min-w-0 flex-1 rounded-[10px] border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
          />
          <LuxeButton type="submit" className="shrink-0">
            Subscribe
          </LuxeButton>
        </form>
        <p className="mt-4 text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground/70">
          Unsubscribe any time
        </p>
      </div>
    </section>
  );
}

const FOOTER = [
  {
    title: "Customer Care",
    links: ["Contact", "Shipping & Returns", "Size Guide", "Garment Care", "Repairs"],
  },
  { title: "About", links: ["Our Story", "The Atelier", "Sustainability", "Journal", "Stockists"] },
  { title: "Policies", links: ["Terms", "Privacy", "Cookies", "Accessibility"] },
  { title: "Social", links: ["Instagram", "Pinterest", "Newsletter"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-pastel-mint/30">
      <div className="mx-auto max-w-[88rem] px-6 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <p className="font-serif text-lg tracking-[0.16em] text-foreground">
              MAISON PETIT
            </p>
            <p className="mt-2 text-[0.5625rem] uppercase tracking-[0.3em] text-muted-foreground">
              Paris · Est. 1974
            </p>
            <div className="mt-6 w-16">
              <FoilRule />
            </div>
          </div>
          {FOOTER.map((col) => (
            <div key={col.title}>
              <h3 className="text-[0.625rem] uppercase tracking-[0.26em] text-foreground">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#top"
                      className="text-xs text-muted-foreground transition-colors duration-300 hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center gap-3 border-t border-border/70 pt-8 sm:flex-row sm:justify-between">
          <p className="text-[0.5625rem] uppercase tracking-[0.22em] text-muted-foreground">
            © {new Date().getFullYear()} Maison Petit
          </p>
          <p className="text-[0.5625rem] uppercase tracking-[0.22em] text-muted-foreground">
            Made slowly in Lisbon
          </p>
        </div>
      </div>
    </footer>
  );
}
