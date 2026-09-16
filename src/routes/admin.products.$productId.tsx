import { createFileRoute } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";
import { db } from "@/lib/db";

export const Route = createFileRoute("/admin/products/$productId")({
  component: EditProductPage,
  loader: ({ params }) => {
    const product = db.getProduct(params.productId);
    if (!product) throw new Error("Product not found");
    return product;
  }
});

function EditProductPage() {
  const product = Route.useLoaderData();
  return <ProductForm initialData={product} />;
}
