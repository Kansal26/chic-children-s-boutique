import { createFileRoute, Link } from "@tanstack/react-router";
import { useProducts, useCategories, useCollections } from "@/lib/db";
import { useOrders } from "@/lib/orders";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, AlertCircle, Sparkles, FileText, Plus, FolderTree, Layers, ShoppingBag, Clock, Printer } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const products = useProducts();
  const orders = useOrders();
  
  const totalProducts = products.length;
  const draftProducts = products.filter(p => p.status === "draft").length;
  const newArrivals = products.filter(p => p.featured || p.tags?.includes("New Arrival")).length;
  
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const dispatchedOrders = orders.filter(o => o.status === "dispatched").length;

  const lowStockThreshold = 5;
  const lowStockCount = products.filter(p => {
    if (!p.variants) return false;
    return p.variants.some(v => v.stock > 0 && v.stock <= lowStockThreshold);
  }).length;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button asChild className="bg-slate-900 text-white hover:bg-slate-800">
          <Link to="/admin/orders">
            <ShoppingBag className="mr-2 h-4 w-4 text-amber-400" />
            Orders & Printing ({pendingOrders} Pending)
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/admin/categories">
            <FolderTree className="mr-2 h-4 w-4" />
            Manage Categories
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/admin/collections">
            <Layers className="mr-2 h-4 w-4" />
            Manage Collections
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{pendingOrders}</div>
            <p className="text-xs text-amber-700 font-medium">Awaiting tax bill & shipping label</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">{dispatchedOrders} currently in transit</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Variants with ≤ {lowStockThreshold} stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Arrivals</CardTitle>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newArrivals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftProducts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity (Simulated) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Simulated log of recent dashboard actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <div className="flex-1 font-medium">Noé Ribbed Merino Jumper stock updated</div>
              <div className="text-muted-foreground">10 min ago</div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <div className="flex-1 font-medium">New product added: Blanche Cashmere Pram Blanket</div>
              <div className="text-muted-foreground">1 hour ago</div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
              <div className="flex-1 font-medium">Draft created for Spring Collection preview</div>
              <div className="text-muted-foreground">Yesterday</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
