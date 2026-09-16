import { createFileRoute, Link } from "@tanstack/react-router";
import { useCoupons, useProducts, db, Coupon } from "@/lib/db";
import { formatPrice } from "@/data/catalog";
import { Plus, Tag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/coupons/")({
  component: AdminCouponsPage,
});

function AdminCouponsPage() {
  const coupons = useCoupons();
  const products = useProducts();

  const toggleStatus = async (coupon: Coupon) => {
    const newStatus = coupon.status === "active" ? "inactive" : "active";
    await db.updateCoupon(coupon.id, { status: newStatus });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      await db.deleteCoupon(id);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Discount Coupons</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your promotional codes and discounts.
          </p>
        </div>
        <Link
          to="/admin/coupons/new"
          className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New Coupon
        </Link>
      </div>

      <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm">
        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400 mb-4">
              <Tag className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-slate-900">No coupons yet</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md">
              Create discount codes to offer percentage or fixed amount savings to your customers.
            </p>
            <Link
              to="/admin/coupons/new"
              className="rounded-md border border-slate-200 px-6 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors text-slate-900"
            >
              Create First Coupon
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 font-medium border-b border-slate-200">Code</th>
                  <th className="px-6 py-3 font-medium border-b border-slate-200">Discount</th>
                  <th className="px-6 py-3 font-medium border-b border-slate-200">Condition</th>
                  <th className="px-6 py-3 font-medium border-b border-slate-200">Status</th>
                  <th className="px-6 py-3 font-medium border-b border-slate-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{coupon.code}</span>
                        {coupon.description && (
                          <span className="text-xs text-slate-500 mt-0.5">{coupon.description}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 border border-slate-200">
                        {coupon.discount_type === "free_gift"
                          ? `Free: ${products.find(p => p.id === coupon.free_gift_product_id)?.name || "Gift"}`
                          : coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}% Off`
                          : `${formatPrice(coupon.discount_value)} Off`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex flex-col gap-1 text-xs">
                        {coupon.min_order_value ? <span>Min. {formatPrice(coupon.min_order_value)}</span> : null}
                        {coupon.min_items_count ? <span>Min. {coupon.min_items_count} items</span> : null}
                        {!coupon.min_order_value && !coupon.min_items_count ? <span>None</span> : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(coupon)}
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
                          coupon.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                        )}
                      >
                        {coupon.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-2 rounded-full hover:bg-rose-50"
                        title="Delete Coupon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
