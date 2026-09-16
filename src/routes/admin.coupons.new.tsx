import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { db, useProducts } from "@/lib/db";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/coupons/new")({
  component: NewCouponPage,
});

function NewCouponPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed_amount" | "free_gift">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [minItemsCount, setMinItemsCount] = useState("");
  const [freeGiftProductId, setFreeGiftProductId] = useState("");

  const products = useProducts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      toast.error("Please provide a discount code.");
      return;
    }
    
    if (discountType !== "free_gift" && !discountValue) {
      toast.error("Please provide a discount value.");
      return;
    }
    
    if (discountType === "free_gift" && !freeGiftProductId) {
      toast.error("Please select a free gift product.");
      return;
    }

    try {
      setIsSubmitting(true);
      await db.createCoupon({
        code: code.toUpperCase(),
        description: description || undefined,
        discount_type: discountType,
        discount_value: discountType === "free_gift" ? 0 : Number(discountValue),
        min_order_value: minOrderValue ? Number(minOrderValue) : undefined,
        min_items_count: minItemsCount ? Number(minItemsCount) : undefined,
        free_gift_product_id: discountType === "free_gift" ? freeGiftProductId : undefined,
        status: "active"
      });
      
      toast.success("Coupon created successfully!");
      navigate({ to: "/admin/coupons" });
    } catch (err: any) {
      toast.error(err.message || "Failed to create coupon.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex flex-col gap-4">
        <Link
          to="/admin/coupons"
          className="flex w-fit items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Coupons
        </Link>
        
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create Coupon</h2>
          <p className="text-sm text-slate-500 mt-1">
            Set up a new discount code for your customers.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-md border border-slate-200 shadow-sm">
        
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="code" className="text-sm font-medium text-slate-900">
              Discount Code *
            </Label>
            <Input
              id="code"
              placeholder="e.g. SUMMER20"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
              className="border-slate-200 uppercase"
            />
            <p className="text-xs text-slate-500 mt-1">Customers will enter this code at checkout.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium text-slate-900">
              Internal Description (Optional)
            </Label>
            <Input
              id="description"
              placeholder="e.g. 20% off summer collection"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-slate-200"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 space-y-6">
          <h3 className="font-semibold text-lg text-slate-900">Discount Details</h3>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="discountType" className="text-sm font-medium text-slate-900">
                Discount Type
              </Label>
              <select
                id="discountType"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed_amount">Fixed Amount (€)</option>
                <option value="free_gift">Free Gift</option>
              </select>
            </div>

            {discountType !== "free_gift" ? (
              <div className="grid gap-2">
                <Label htmlFor="discountValue" className="text-sm font-medium text-slate-900">
                  Discount Value *
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={discountType === "percentage" ? "20" : "15.00"}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  required
                  className="border-slate-200"
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="freeGift" className="text-sm font-medium text-slate-900">
                  Free Gift Product *
                </Label>
                <select
                  id="freeGift"
                  value={freeGiftProductId}
                  onChange={(e) => setFreeGiftProductId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                  required
                >
                  <option value="" disabled>Select a product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="minOrderValue" className="text-sm font-medium text-slate-900">
                Minimum Order Value (€) (Optional)
              </Label>
              <Input
                id="minOrderValue"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 100.00"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                className="border-slate-200"
              />
              <p className="text-xs text-slate-500 mt-1">Leave blank if no minimum is required.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minItemsCount" className="text-sm font-medium text-slate-900">
                Minimum Items in Cart (Optional)
              </Label>
              <Input
                id="minItemsCount"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 3"
                value={minItemsCount}
                onChange={(e) => setMinItemsCount(e.target.value)}
                className="border-slate-200"
              />
              <p className="text-xs text-slate-500 mt-1">Useful for 'Buy N items get X' promos.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-end gap-4">
          <Link to="/admin/coupons">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Coupon"}
          </Button>
        </div>
      </form>
    </div>
  );
}
