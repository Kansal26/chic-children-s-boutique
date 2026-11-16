import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/data/catalog";
import { LuxeButton } from "@/components/boutique/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CheckCircle2, ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCoupons, useProducts } from "@/lib/db";
import { orderStore, Order } from "@/lib/orders";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cart, clearCart, appliedCoupon, applyCoupon, removeCoupon } = useStore();
  const coupons = useCoupons();
  const products = useProducts();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const coupon = coupons.find(c => c.code === promoCode.trim().toUpperCase());

    if (!coupon) {
      toast.error("Invalid promo code");
      return;
    }

    if (coupon.status !== "active") {
      toast.error("This promo code is no longer active");
      return;
    }

    if (coupon.min_order_value && cartSubtotal < coupon.min_order_value) {
      toast.error(`This promo code requires a minimum order of ${formatPrice(coupon.min_order_value)}`);
      return;
    }

    if (coupon.min_items_count && cartItemCount < coupon.min_items_count) {
      toast.error(`This promo code requires a minimum of ${coupon.min_items_count} items in your bag.`);
      return;
    }

    applyCoupon(coupon);
    setPromoCode("");
    toast.success("Promo code applied!");
  };

  let discountAmount = 0;
  let freeGiftProduct = null;
  
  if (appliedCoupon) {
    const failsOrderValue = appliedCoupon.min_order_value && cartSubtotal < appliedCoupon.min_order_value;
    const failsItemCount = appliedCoupon.min_items_count && cartItemCount < appliedCoupon.min_items_count;

    if (failsOrderValue || failsItemCount) {
      removeCoupon();
    } else {
      if (appliedCoupon.discount_type === "percentage") {
        discountAmount = cartSubtotal * (appliedCoupon.discount_value / 100);
      } else if (appliedCoupon.discount_type === "fixed_amount") {
        discountAmount = Math.min(appliedCoupon.discount_value, cartSubtotal);
      } else if (appliedCoupon.discount_type === "free_gift" && appliedCoupon.free_gift_product_id) {
        freeGiftProduct = products.find(p => p.id === appliedCoupon.free_gift_product_id);
      }
    }
  }

  const shipping = 15;
  const total = cartSubtotal - discountAmount + (cart.length > 0 ? shipping : 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const email = (formData.get("email") as string) || "customer@maisonpetit.com";
    const firstName = (formData.get("firstName") as string) || "Guest";
    const lastName = (formData.get("lastName") as string) || "Customer";
    const address = (formData.get("address") as string) || "12 Avenue Montaigne";
    const apartment = (formData.get("apartment") as string) || "";
    const postalCode = (formData.get("postalCode") as string) || "75008";
    const city = (formData.get("city") as string) || "Paris";
    const phone = (formData.get("phone") as string) || "+33 6 12 34 56 78";

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `MP-${randomNum}`,
      createdAt: new Date().toISOString(),
      customer: {
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        shippingAddress: {
          street: address,
          apartment: apartment || undefined,
          city,
          state: "Île-de-France",
          postalCode,
          country: "France",
        },
        billingAddress: {
          street: address,
          apartment: apartment || undefined,
          city,
          state: "Île-de-France",
          postalCode,
          country: "France",
        },
      },
      items: cart.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.sku || `MP-${item.product.id.slice(0, 4).toUpperCase()}`,
        color: item.color,
        size: item.size,
        price: item.product.price,
        quantity: item.quantity,
        img: item.product.img,
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: cart.length > 0 ? shipping : 0,
      tax: Number(((cartSubtotal - discountAmount) * 0.12).toFixed(2)),
      total,
      paymentMethod: "Credit Card (Mock Checkout)",
      paymentStatus: "paid",
      status: "pending",
      shippingCarrier: "DHL Express",
      statusHistory: [
        {
          status: "pending",
          timestamp: new Date().toISOString(),
          note: "Order placed online via Maison Petit Checkout.",
        },
      ],
    };

    setTimeout(() => {
      orderStore.addOrder(newOrder);
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
      removeCoupon();
      toast.success("Order placed successfully! Generated " + newOrder.orderNumber);
    }, 1200);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-6" />
        <h1 className="font-serif text-3xl mb-4">Thank you for your order</h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          We've received your order and will contact you as soon as your package is shipped. You will receive an email confirmation shortly.
        </p>
        <Link to="/shop">
          <LuxeButton>Return to Shop</LuxeButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row font-sans">
      {/* Left Column: Form */}
      <div className="flex-1 lg:pl-[15%] lg:pr-12 px-6 py-12 overflow-y-auto">
        <div className="max-w-xl mx-auto lg:ml-auto lg:mr-0">
          <Link to="/" className="inline-block mb-12">
            <span className="font-serif text-2xl tracking-[0.16em]">MAISON PETIT</span>
          </Link>

          <form onSubmit={handleSubmit} className="space-y-12">
            <section>
              <h2 className="text-lg font-serif mb-6">Contact</h2>
              <div className="space-y-4">
                <div>
                  <Input name="email" type="email" placeholder="Email Address *" required className="bg-transparent border-border/50 rounded-[4px] h-12" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="newsletter" className="rounded-sm border-border text-gold focus:ring-gold" />
                  <label htmlFor="newsletter" className="text-xs text-muted-foreground">Email me with news and offers</label>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-serif mb-6">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <Input name="firstName" placeholder="First Name *" required className="bg-transparent border-border/50 rounded-[4px] h-12" />
                </div>
                <div className="col-span-1">
                  <Input name="lastName" placeholder="Last Name *" required className="bg-transparent border-border/50 rounded-[4px] h-12" />
                </div>
                <div className="col-span-2">
                  <Input name="address" placeholder="Address *" required className="bg-transparent border-border/50 rounded-[4px] h-12" />
                </div>
                <div className="col-span-2">
                  <Input name="apartment" placeholder="Apartment, suite, etc. (optional)" className="bg-transparent border-border/50 rounded-[4px] h-12" />
                </div>
                <div className="col-span-1">
                  <Input name="postalCode" placeholder="Postal Code *" required className="bg-transparent border-border/50 rounded-[4px] h-12" />
                </div>
                <div className="col-span-1">
                  <Input name="city" placeholder="City *" required className="bg-transparent border-border/50 rounded-[4px] h-12" />
                </div>
                <div className="col-span-2">
                  <Input name="phone" placeholder="Phone" type="tel" className="bg-transparent border-border/50 rounded-[4px] h-12" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-serif mb-6">Payment</h2>
              <div className="p-4 border border-border/50 rounded-[4px] bg-muted/20 text-sm text-muted-foreground text-center">
                This is a mock checkout. No payment is required.
              </div>
            </section>

            <div className="flex items-center justify-between pt-6 border-t border-border/50">
              <Link to="/cart" className="text-xs uppercase tracking-widest text-muted-foreground flex items-center hover:text-foreground transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Return to Cart
              </Link>
              <LuxeButton 
                type="submit" 
                disabled={cart.length === 0 || isSubmitting}
                className={cn(isSubmitting && "opacity-70 pointer-events-none")}
              >
                {isSubmitting ? "PROCESSING..." : "PLACE ORDER"}
              </LuxeButton>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="w-full lg:w-[45%] bg-cream/30 border-t lg:border-t-0 lg:border-l border-border/50 px-6 lg:px-12 py-12">
        <div className="max-w-md mx-auto lg:mx-0">
          <div className="flex flex-col gap-6 mb-8">
            {cart.map((item, i) => (
              <div key={`${item.product.id}-${i}`} className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-20 rounded-[4px] overflow-hidden bg-cream border border-border/30">
                    <img src={item.product.img} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-foreground text-background w-5 h-5 rounded-full flex items-center justify-center text-[0.625rem] font-medium z-10">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm truncate">{item.product.name}</h4>
                  <p className="text-[0.625rem] text-muted-foreground mt-1 uppercase tracking-wider">
                    {item.size} {item.color && `/ ${item.color}`}
                  </p>
                </div>
                <div className="font-sans text-sm tracking-wide">
                  {formatPrice(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
            
            {freeGiftProduct && (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-20 rounded-[4px] overflow-hidden bg-cream border border-border/30 relative">
                    <img src={freeGiftProduct.img} alt={freeGiftProduct.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-pastel-mint text-slate-800 w-5 h-5 rounded-full flex items-center justify-center text-[0.625rem] font-bold z-10 border border-pastel-mint-deep">
                    1
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm truncate">{freeGiftProduct.name}</h4>
                  <p className="text-[0.625rem] text-muted-foreground mt-1 uppercase tracking-wider">
                    Promo: {appliedCoupon?.code}
                  </p>
                </div>
                <div className="font-sans text-sm tracking-wide flex flex-col items-end">
                  <span className="line-through text-muted-foreground text-xs">{formatPrice(freeGiftProduct.price)}</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6 pb-6 border-b border-border/50">
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-pastel-mint/30 border border-pastel-mint px-4 py-3 rounded-md">
                <div className="flex flex-col">
                  <span className="text-sm font-medium uppercase tracking-wide text-foreground">
                    {appliedCoupon.code}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {appliedCoupon.discount_type === "percentage" 
                      ? `${appliedCoupon.discount_value}% off` 
                      : appliedCoupon.discount_type === "fixed_amount"
                      ? `${formatPrice(appliedCoupon.discount_value)} off`
                      : `Free Gift Included`}
                  </span>
                </div>
                <button 
                  onClick={removeCoupon}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <Input 
                  placeholder="Promo code" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="bg-background border-border/50 h-10"
                />
                <LuxeButton type="submit" variant="outline" className="h-10 px-4 py-0 whitespace-nowrap">
                  Apply
                </LuxeButton>
              </form>
            )}
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-sans text-foreground">{formatPrice(cartSubtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-green-700">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Shipping</span>
              <span className="font-sans text-foreground">{cart.length > 0 ? formatPrice(shipping) : "—"}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 mt-6 border-t border-border/50 text-lg">
            <span>Total</span>
            <span className="font-sans font-medium tracking-wide">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
