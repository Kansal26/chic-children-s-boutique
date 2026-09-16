import { createFileRoute, Link } from "@tanstack/react-router";
import { useCollections, useProducts, db } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Archive, ArchiveRestore, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/admin/collections/")({
  component: AdminCollectionsPage,
});

function AdminCollectionsPage() {
  const collections = useCollections();
  const allProducts = useProducts();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    coverImage: "",
    status: "published"
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setFormData(p => ({ ...p, coverImage: url }));
      }
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.id) {
      toast.error("Name and ID are required");
      return;
    }
    
    if (selectedProducts.length < 3) {
      toast.error("You must select at least 3 distinct products for this collection.");
      return;
    }

    if (isEditing) {
      db.updateCollection(formData.id, formData as any);
      toast.success("Collection updated successfully");
    } else {
      // Simple duplicate ID check
      if (collections.some(c => c.id === formData.id)) {
        toast.error("A collection with this ID already exists");
        return;
      }
      db.createCollection(formData as any);
      toast.success("Collection created successfully");
    }

    // Update products with this collection
    selectedProducts.forEach(id => {
      const p = allProducts.find(prod => prod.id === id);
      if (p && !p.collections?.includes(formData.id)) {
        db.updateProduct(id, { collections: [...(p.collections || []), formData.id] });
      }
    });
    
    // Remove collection from products that were unchecked during edit
    if (isEditing) {
      const previouslyIn = allProducts.filter(p => p.collections?.includes(formData.id));
      previouslyIn.forEach(p => {
        if (!selectedProducts.includes(p.id)) {
          db.updateProduct(p.id, { collections: (p.collections || []).filter(c => c !== formData.id) });
        }
      });
    }

    setOpen(false);
    setFormData({
      id: "",
      name: "",
      description: "",
      coverImage: "",
      status: "published"
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this collection?")) {
      db.deleteCollection(id);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Collections</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditing(false);
              setSelectedProducts([]);
              setFormData({ id: "", name: "", description: "", coverImage: "", status: "published" });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Collection" : "Add New Collection"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value, id: p.id || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))} 
                    placeholder="e.g. Summer Edits" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>ID (Slug) *</Label>
                  <Input 
                    value={formData.id} 
                    onChange={e => setFormData(p => ({ ...p, id: e.target.value }))} 
                    placeholder="e.g. summer-edits" 
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
                {formData.coverImage && (
                  <div className="mt-2 h-20 w-20 rounded-md overflow-hidden border">
                    <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  value={formData.description} 
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} 
                  placeholder="Warm weather curations..." 
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
              <Button onClick={handleSave}>Save Collection</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.description}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${c.status === "archived" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {c.status === "archived" ? "Archived" : "Published"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 items-center">
                    <Button variant="ghost" size="sm" onClick={() => {
                      setFormData(c as any);
                      setSelectedProducts(allProducts.filter(p => p.collections?.includes(c.id)).map(p => p.id));
                      setIsEditing(true);
                      setOpen(true);
                    }}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/collections/${c.id}` as any}>
                        <Package className="h-4 w-4 mr-2" />
                        Manage Products
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      db.updateCollection(c.id, { status: c.status === "archived" ? "published" : "archived" });
                      toast.success(`Collection ${c.status === "archived" ? "unarchived" : "archived"}`);
                    }}>
                      {c.status === "archived" ? <ArchiveRestore className="h-4 w-4 mr-2" /> : <Archive className="h-4 w-4 mr-2" />}
                      {c.status === "archived" ? "Unarchive" : "Archive"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      if (confirm("Are you sure you want to delete this collection? Its products will NOT be deleted.")) {
                        db.deleteCollection(c.id);
                        toast.success("Collection deleted");
                      }
                    }} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {collections.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No collections found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
