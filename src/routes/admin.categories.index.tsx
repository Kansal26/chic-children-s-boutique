import { createFileRoute, Link } from "@tanstack/react-router";
import { useCategories, useProducts, db } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2, Archive, ArchiveRestore, Package } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { CategorySlug } from "@/data/catalog";

export const Route = createFileRoute("/admin/categories/")({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const categories = useCategories();
  const allProducts = useProducts();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    note: "",
    img: "",
    tint: "bg-slate-100",
    ring: "group-hover:ring-slate-200",
    text: "group-hover:text-slate-600",
    blurb: ""
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setFormData(p => ({ ...p, img: url }));
      }
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.slug) {
      toast.error("Name and Slug are required");
      return;
    }
    
    if (selectedProducts.length < 3) {
      toast.error("You must select at least 3 distinct products for this category.");
      return;
    }

    if (isEditing) {
      db.updateCategory(formData.slug, formData as any);
      toast.success("Category updated successfully");
    } else {
      // Simple duplicate slug check
      if (categories.some(c => c.slug === formData.slug)) {
        toast.error("A category with this slug already exists");
        return;
      }
      db.createCategory(formData as any);
      toast.success("Category created successfully");
    }

    // Update products with this category
    selectedProducts.forEach(id => {
      const p = allProducts.find(prod => prod.id === id);
      if (p && !p.categories?.includes(formData.slug)) {
        db.updateProduct(id, { categories: [...(p.categories || []), formData.slug as any] });
      }
    });
    // Remove category from products that were unchecked during edit
    if (isEditing) {
      const previouslyIn = allProducts.filter(p => p.categories?.includes(formData.slug));
      previouslyIn.forEach(p => {
        if (!selectedProducts.includes(p.id)) {
          db.updateProduct(p.id, { categories: p.categories?.filter(c => c !== formData.slug) || [] });
        }
      });
    }

    setOpen(false);
    setFormData({
      slug: "",
      name: "",
      note: "",
      img: "",
      tint: "bg-slate-100",
      ring: "group-hover:ring-slate-200",
      text: "group-hover:text-slate-600",
      blurb: ""
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditing(false);
              setSelectedProducts([]);
              setFormData({
                slug: "", name: "", note: "", img: "", tint: "bg-slate-100",
                ring: "group-hover:ring-slate-200", text: "group-hover:text-slate-600", blurb: ""
              });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value, slug: p.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))} 
                    placeholder="e.g. Toys" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input 
                    value={formData.slug} 
                    onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))} 
                    placeholder="e.g. toys" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <Input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload} 
                />
                {formData.img && (
                  <div className="mt-2 h-20 w-20 rounded-md overflow-hidden border">
                    <img src={formData.img} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Description / Blurb</Label>
                <Input 
                  value={formData.blurb} 
                  onChange={e => setFormData(p => ({ ...p, blurb: e.target.value }))} 
                  placeholder="Curated wooden toys..." 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Select Products (Minimum 3 required) *</Label>
                <div className="border rounded-md max-h-48 overflow-y-auto p-2 space-y-2 bg-slate-50">
                  {allProducts.map(p => (
                    <div key={p.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`prod-${p.id}`} 
                        checked={selectedProducts.includes(p.id)} 
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProducts(prev => [...prev, p.id]);
                          } else {
                            setSelectedProducts(prev => prev.filter(id => id !== p.id));
                          }
                        }} 
                      />
                      <label htmlFor={`prod-${p.id}`} className="text-sm cursor-pointer select-none">
                        {p.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Cover</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.slug}>
                <TableCell>
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                    <img src={c.heroDetails?.heroImg || c.img} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.slug}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${c.status === "archived" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {c.status === "archived" ? "Archived" : "Published"}
                  </span>
                </TableCell>
                <TableCell className="text-right flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => {
                    setFormData(c as any);
                    setSelectedProducts(allProducts.filter(p => p.categories?.includes(c.slug)).map(p => p.id));
                    setIsEditing(true);
                    setOpen(true);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/admin/categories/${c.slug}` as any}>
                      <Package className="h-4 w-4 mr-2" />
                      Manage Products
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    db.updateCategory(c.slug, { status: c.status === "archived" ? "published" : "archived" });
                    toast.success(`Category ${c.status === "archived" ? "unarchived" : "archived"}`);
                  }}>
                    {c.status === "archived" ? <ArchiveRestore className="h-4 w-4 mr-2" /> : <Archive className="h-4 w-4 mr-2" />}
                    {c.status === "archived" ? "Unarchive" : "Archive"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    if (confirm("Are you sure you want to delete this category? All its products will be moved to 'uncategorized'.")) {
                      db.deleteCategory(c.slug);
                      toast.success("Category deleted");
                    }
                  }} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
