import { createFileRoute, Link } from "@tanstack/react-router";
import { useProducts, db, useCategory } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Plus, Archive, ArchiveRestore } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export const Route = createFileRoute("/admin/categories/$categorySlug")({
  component: CategoryProductsPage,
});

function CategoryProductsPage() {
  const { categorySlug } = Route.useParams();
  const category = useCategory(categorySlug);
  const allProducts = useProducts();
  const products = allProducts.filter((p) => p.categories?.includes(categorySlug));
  const availableProducts = allProducts.filter((p) => !p.categories?.includes(categorySlug));
  
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleRemoveFromCategory = (productId: string) => {
    if (confirm("Are you sure you want to remove this product from the category?")) {
      const product = allProducts.find(p => p.id === productId);
      const newCategories = product?.categories?.filter(c => c !== categorySlug) || [];
      db.updateProduct(productId, { categories: newCategories });
      toast.success("Product removed from category");
    }
  };

  const handleArchiveProduct = (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === "archived" ? "published" : "archived";
    db.updateProduct(productId, { status: newStatus as any });
    toast.success(`Product ${newStatus}`);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to permanently delete this product? This action cannot be undone.")) {
      db.deleteProduct(productId);
      toast.success("Product deleted");
    }
  };

  const handleAddToCategory = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    const newCategories = [...(product?.categories || []), categorySlug];
    db.updateProduct(productId, { categories: newCategories });
    toast.success("Product added to category");
  };

  if (!category) {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/admin/categories">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Category Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/admin/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Manage Products: {category.name}
          </h2>
          <p className="text-muted-foreground text-sm">
            Viewing all products currently assigned to this category.
          </p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product to Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Existing Product</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {availableProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No available products to add.</div>
              ) : (
                <div className="space-y-4">
                  {availableProducts.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded overflow-hidden">
                          {p.img ? <img src={p.img} alt={p.name} className="w-full h-full object-cover" /> : null}
                        </div>
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">Categories: {p.categories?.join(", ") || "None"}</div>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleAddToCategory(p.id)}>Add</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No products found in this category.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                      {p.img ? (
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-xs text-slate-400">No Img</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {p.name}
                    <div className="text-xs text-slate-400">{p.id}</div>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: p.currency || "EUR" }).format(p.price)}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${p.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {p.status === "published" ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleArchiveProduct(p.id, p.status || "published")}
                    >
                      {p.status === "archived" ? <ArchiveRestore className="h-4 w-4 mr-2" /> : <Archive className="h-4 w-4 mr-2" />}
                      {p.status === "archived" ? "Unarchive" : "Archive"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveFromCategory(p.id)}
                      title="Remove from category"
                    >
                      <Trash2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      Remove
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
