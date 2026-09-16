import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useProducts, db } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/inventory")({
  component: AdminInventoryPage,
});

function AdminInventoryPage() {
  const products = useProducts();
  
  // Flatten variants
  const inventoryItems = products.flatMap(p => {
    if (!p.variants || p.variants.length === 0) return [];
    return p.variants.map((v, index) => ({
      productId: p.id,
      productName: p.name,
      variantIndex: index,
      color: v.color,
      size: v.size,
      stock: v.stock
    }));
  });

  // Sort by stock ascending
  inventoryItems.sort((a, b) => a.stock - b.stock);

  const handleStockUpdate = (productId: string, variantIndex: number, newStock: number) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.variants) return;
    
    const newVariants = [...product.variants];
    newVariants[variantIndex] = { ...newVariants[variantIndex], stock: newStock };
    
    db.updateProduct(productId, { variants: newVariants });
    toast.success("Stock updated");
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Inventory Overview</h2>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="w-[150px]">Stock Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.map((item) => (
              <TableRow key={`${item.productId}-${item.variantIndex}`}>
                <TableCell className="font-medium">{item.productName}</TableCell>
                <TableCell>{item.color || "—"}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      className={`w-20 ${item.stock <= 5 ? "border-rose-500 text-rose-600 focus-visible:ring-rose-500" : ""}`}
                      value={item.stock}
                      onChange={(e) => handleStockUpdate(item.productId, item.variantIndex, Number(e.target.value))}
                    />
                    {item.stock <= 5 && <span className="text-xs text-rose-600 font-medium">Low</span>}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {inventoryItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No inventory data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
