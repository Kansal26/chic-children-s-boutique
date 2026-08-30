import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/boutique/Header";
import {
  Arrivals,
  Categories,
  Footer,
  Hero,
  Newsletter,
  ServiceStrip,
  Story,
  Testimonials,
} from "@/components/boutique/sections";

const title = "Maison Petit — Luxury Children's Clothing & Accessories";
const description =
  "Heirloom children's clothing in organic cotton, French linen and hand-finished knit. Shop newborn, girls, boys, shoes, accessories and curated gifting.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ServiceStrip />
        <Categories />
        <Arrivals />
        <Story />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
