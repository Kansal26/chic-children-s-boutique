import { LuxeButton } from "./Button";
import { formatPrice, type Product } from "@/data/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-[12px] bg-background shadow-[var(--shadow-soft)] transition-shadow duration-500 group-hover:shadow-[var(--shadow-lift)]">
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          width={800}
          height={1000}
          className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.07]"
        />
        {product.tag ? (
          <span
            className={`absolute left-4 top-4 rounded-[6px] border px-2.5 py-1 text-[0.5625rem] uppercase tracking-[0.22em] backdrop-blur-sm ${product.tagStyle}`}
          >
            {product.tag}
          </span>
        ) : null}
        <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <LuxeButton size="sm" variant="solid" className="w-full">
            Add to Bag
          </LuxeButton>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif text-[1.0625rem] leading-snug text-foreground">
            {product.name}
          </h3>
          <p className="mt-1 text-[0.5625rem] uppercase tracking-[0.2em] text-muted-foreground">
            {product.material}
          </p>
        </div>
        <p className="shrink-0 text-xs tracking-[0.12em] text-muted-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-20 text-center text-sm text-muted-foreground">
        Nothing in this edit just yet — please check back soon.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
      {products.map((p) => (
        <ProductCard key={p.id + p.name} product={p} />
      ))}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section
      className="border-b border-border/70 px-6 pb-16 pt-40 sm:px-8"
      style={{ backgroundImage: "var(--gradient-pastel)" }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-[2.25rem] leading-[1.1] text-foreground sm:text-[3.25rem]">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
          {intro}
        </p>
        <div className="mx-auto mt-7 w-24">
          <div className="foil-rule" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
