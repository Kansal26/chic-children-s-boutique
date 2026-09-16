import { useState } from "react";
import { Product } from "@/data/catalog";
import { db, useCategories, useCollections } from "@/lib/db";
import { useNavigate } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Plus, Check, ChevronsUpDown } from "lucide-react";
import { ImageManager } from "./ImageManager";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

type ProductFormProps = {
  initialData?: Product;
};

export function ProductForm({ initialData }: ProductFormProps) {
  const navigate = useNavigate();
  const categories = useCategories();
  const collections = useCollections();
  
  const [formData, setFormData] = useState<Partial<Product>>(initialData || {
    id: "",
    name: "",
    price: 0,
    categories: [],
    status: "draft",
    sku: "",
    description: "",
    material: "",
    img: "",
    variants: [],
    colors: [],
    collections: [],
    tags: []
  });

  const handleChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (publish: boolean) => {
    if (!formData.name || !formData.price || !formData.id) {
      toast.error("Please fill in Name, ID (Slug), and Price");
      return;
    }

    if (publish) {
      const hasPrimary = formData.adminImages?.some(img => img.role === "primary");
      const hasHover = formData.adminImages?.some(img => img.role === "hover");
      if (!hasPrimary || !hasHover) {
        toast.error("Please assign exactly one Primary image and one Hover image before publishing.");
        return;
      }
    }

    // Map adminImages to img and hoverImg for backward compatibility
    let img = formData.img;
    let hoverImg = formData.hoverImg;
    if (formData.adminImages && formData.adminImages.length > 0) {
      const pImg = formData.adminImages.find(i => i.role === "primary");
      const hImg = formData.adminImages.find(i => i.role === "hover");
      if (pImg) img = pImg.url;
      if (hImg) hoverImg = hImg.url;
    }

    const finalData = { ...formData, status: publish ? "published" : "draft", img, hoverImg } as Product;
    
    if (initialData) {
      db.updateProduct(finalData.id, finalData);
      toast.success("Product updated successfully");
    } else {
      db.createProduct(finalData);
      toast.success("Product created successfully");
    }
    navigate({ to: "/admin/products" });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">{initialData ? "Edit Product" : "Add New Product"}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave(false)}>Save as Draft</Button>
          <Button onClick={() => handleSave(true)}>Publish</Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:w-[800px]">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="category">Category</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <Card className="mt-6 border-0 shadow-sm ring-1 ring-border">
          <CardContent className="pt-6">
            <TabsContent value="basic" className="space-y-4 m-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name *</Label>
                  <Input value={formData.name} onChange={e => handleChange("name", e.target.value)} placeholder="e.g. Noé Ribbed Merino Jumper" />
                </div>
                <div className="space-y-2">
                  <Label>URL Slug (ID) *</Label>
                  <Input value={formData.id} onChange={e => handleChange("id", e.target.value)} placeholder="noe-ribbed-merino-jumper" disabled={!!initialData} />
                </div>
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input value={formData.sku || ""} onChange={e => handleChange("sku", e.target.value)} placeholder="SKU-12345" />
                </div>
                <div className="space-y-2">
                  <Label>Short Description / Material</Label>
                  <Input value={formData.material} onChange={e => handleChange("material", e.target.value)} placeholder="e.g. French Linen" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Full Description</Label>
                <Textarea value={formData.description || ""} onChange={e => handleChange("description", e.target.value)} placeholder="Detailed product description..." className="min-h-[150px]" />
              </div>
            </TabsContent>

            <TabsContent value="category" className="space-y-4 m-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categories *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between font-normal" role="combobox">
                        <span className="truncate">
                          {formData.categories && formData.categories.length > 0
                            ? formData.categories.map(slug => categories.find(c => c.slug === slug)?.name || slug).join(", ")
                            : "Select Categories..."}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-2" align="start">
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {categories.map(c => (
                          <div key={c.slug} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`cat-${c.slug}`} 
                              checked={formData.categories?.includes(c.slug)} 
                              onCheckedChange={(checked) => {
                                const current = formData.categories || [];
                                if (checked) {
                                  handleChange("categories", [...current, c.slug]);
                                } else {
                                  handleChange("categories", current.filter(slug => slug !== c.slug));
                                }
                              }} 
                            />
                            <label htmlFor={`cat-${c.slug}`} className="text-sm cursor-pointer select-none">
                              {c.name} {c.status === "archived" && <span className="text-muted-foreground text-xs ml-1">(Archived)</span>}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Collections</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between font-normal" role="combobox">
                        <span className="truncate">
                          {formData.collections && formData.collections.length > 0
                            ? formData.collections.map(id => collections.find(c => c.id === id)?.name || id).join(", ")
                            : "Select Collections..."}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-2" align="start">
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {collections.map(c => (
                          <div key={c.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`col-${c.id}`} 
                              checked={formData.collections?.includes(c.id)} 
                              onCheckedChange={(checked) => {
                                const current = formData.collections || [];
                                if (checked) {
                                  handleChange("collections", [...current, c.id]);
                                } else {
                                  handleChange("collections", current.filter(id => id !== c.id));
                                }
                              }} 
                            />
                            <label htmlFor={`col-${c.id}`} className="text-sm cursor-pointer select-none">
                              {c.name} {c.status === "archived" && <span className="text-muted-foreground text-xs ml-1">(Archived)</span>}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Switch id="featured" checked={formData.featured} onCheckedChange={v => handleChange("featured", v)} />
                  <Label htmlFor="featured">Featured Product (Shows on Homepage)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="isNew" checked={formData.isNew} onCheckedChange={v => handleChange("isNew", v)} />
                  <Label htmlFor="isNew">Mark as "New Arrival"</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4 m-0">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Base Price *</Label>
                  <Input type="number" value={formData.price} onChange={e => handleChange("price", Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Compare-at Price</Label>
                  <Input type="number" value={formData.compareAtPrice || ""} onChange={e => handleChange("compareAtPrice", Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input value={formData.currency || "EUR"} onChange={e => handleChange("currency", e.target.value)} disabled />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4 m-0">
              <div className="text-sm text-muted-foreground mb-4">
                Drag and drop images below. You must select exactly one Primary and one Hover image before publishing.
              </div>
              <ImageManager 
                images={formData.adminImages || []}
                onChange={(images) => handleChange("adminImages", images)}
              />
            </TabsContent>

            <TabsContent value="variants" className="space-y-4 m-0">
              <div className="text-sm text-muted-foreground mb-4">
                Manage stock levels for each color and size combination.
              </div>
              
              <div className="space-y-4">
                {(formData.variants || []).map((v, idx) => (
                  <div key={idx} className="flex items-end gap-4 p-4 border rounded-md bg-slate-50">
                    <div className="space-y-1 flex-1">
                      <Label>Color (Optional)</Label>
                      <Input value={v.color || ""} onChange={(e) => {
                        const newMatrix = [...(formData.variants || [])];
                        newMatrix[idx].color = e.target.value;
                        handleChange("variants", newMatrix);
                      }} placeholder="e.g. Navy" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Label>Size *</Label>
                      <Input value={v.size} onChange={(e) => {
                        const newMatrix = [...(formData.variants || [])];
                        newMatrix[idx].size = e.target.value;
                        handleChange("variants", newMatrix);
                      }} placeholder="e.g. 6-12M" />
                    </div>
                    <div className="space-y-1 w-24">
                      <Label>Stock</Label>
                      <Input type="number" value={v.stock} onChange={(e) => {
                        const newMatrix = [...(formData.variants || [])];
                        newMatrix[idx].stock = Number(e.target.value);
                        handleChange("variants", newMatrix);
                      }} />
                    </div>
                    <Button variant="ghost" size="icon" className="text-rose-500" onClick={() => {
                      const newMatrix = [...(formData.variants || [])];
                      newMatrix.splice(idx, 1);
                      handleChange("variants", newMatrix);
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full border-dashed" onClick={() => {
                  handleChange("variants", [...(formData.variants || []), { size: "", stock: 0 }]);
                }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Variant
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 m-0">
              <div className="space-y-2">
                <Label>Care Instructions</Label>
                <Textarea value={formData.careInstructions || ""} onChange={e => handleChange("careInstructions", e.target.value)} placeholder="e.g. Hand wash only..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input value={formData.metaTitle || ""} onChange={e => handleChange("metaTitle", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Input value={formData.metaDescription || ""} onChange={e => handleChange("metaDescription", e.target.value)} />
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
