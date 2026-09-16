import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/data/catalog";
import { LuxeButton } from "@/components/boutique/Button";
import { Header } from "@/components/boutique/Header";
import { Footer } from "@/components/boutique/sections";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useCoupons, useProducts } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, appliedCoupon, applyCoupon, removeCoupon } = useStore();
  const coupons = useCoupons();
  const products = useProducts();
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
      // Cart no longer qualifies, remove it automatically
      removeCoupon();
    } else {
      if (appliedCoupon.discount_type === "percentage") {
        discountAmount = cartSubtotal * (appliedCoupon.discount_value / 100);
      } else if (appliedCoupon.discount_type === "fixed_amount") {
        discountAmount = Math.min(appliedCoupon.discount_value, cartSubtotal); // don't go negative
      } else if (appliedCoupon.discount_type === "free_gift" && appliedCoupon.free_gift_product_id) {
        freeGiftProduct = products.find(p => p.id === appliedCoupon.free_gift_product_id);
      }
    }
  }

  const finalTotal = cartSubtotal - discountAmount;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-center mb-12">Your Bag</h1>
          
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30" strokeWidth={1} />
              <p className="font-serif text-2xl text-foreground">Your bag is empty.</p>
              <Link to="/shop">
                <LuxeButton variant="outline" className="mt-4">
                  Continue Shopping
                </LuxeButton>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                {/* Desktop Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border/70 text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>

                <div className="flex flex-col gap-6 md:gap-0 mt-6 md:mt-0">
                  {cart.map((item, i) => (
                    <div 
                      key={`${item.product.id}-${item.size}-${item.color}-${i}`}
                      className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 md:py-6 md:border-b border-border/50 items-center relative"
                    >
                      <div className="col-span-1 md:col-span-6 flex gap-6">
                        <Link to="/product/$productId" params={{ productId: item.product.id }} className="shrink-0">
                          <div className="w-24 md:w-32 aspect-[4/5] rounded-[8px] overflow-hidden bg-cream border border-border/30">
                            <img src={item.product.img} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                        </Link>
                        
                        <div className="flex flex-col justify-center min-w-0">
                          <Link to="/product/$productId" params={{ productId: item.product.id }} className="hover:opacity-80 transition-opacity">
                            <h4 className="font-serif text-lg leading-snug text-foreground">{item.product.name}</h4>
                          </Link>
                          
                          <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-1.5">
                            {item.color && (
                              <span className={cn("inline-block w-2.5 h-2.5 rounded-full ring-1 ring-border", item.color)} />
                            )}
                            {item.size || "One Size"}
                          </p>
                          
                          <p className="mt-2 font-sans text-sm tracking-wider text-muted-foreground md:hidden">
                            {formatPrice(item.product.price)}
                          </p>
                          
                          <button
                            onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                            className="text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 mt-auto pt-4 text-left w-fit"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-span-1 md:col-span-3 flex items-center md:justify-center">
                        <div className="flex items-center rounded-[6px] border border-border h-10 w-fit">
                          <button
                            onClick={() => item.quantity > 1 ? updateCartQuantity(item.product.id, item.size, item.color, item.quantity - 1) : removeFromCart(item.product.id, item.size, item.color)}
                            className="px-3 h-full text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                            className="px-3 h-full text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-span-1 md:col-span-3 hidden md:flex justify-end font-sans text-sm tracking-wider">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}

                  {freeGiftProduct && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 md:py-6 md:border-b border-border/50 items-center relative">
                      <div className="col-span-1 md:col-span-6 flex gap-6">
                        <Link to="/product/$productId" params={{ productId: freeGiftProduct.id }} className="shrink-0">
                          <div className="w-24 md:w-32 aspect-[4/5] rounded-[8px] overflow-hidden bg-cream border border-border/30 relative">
                            <div className="absolute top-2 left-2 bg-pastel-mint text-slate-800 text-[0.625rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm z-10">
                              Free Gift
                            </div>
                            <img src={freeGiftProduct.img} alt={freeGiftProduct.name} className="w-full h-full object-cover" />
                          </div>
                        </Link>
                        
                        <div className="flex flex-col justify-center min-w-0">
                          <Link to="/product/$productId" params={{ productId: freeGiftProduct.id }} className="hover:opacity-80 transition-opacity">
                            <h4 className="font-serif text-lg leading-snug text-foreground">{freeGiftProduct.name}</h4>
                          </Link>
                          
                          <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground">
                            Promo: {appliedCoupon?.code}
                          </p>
                          
                          <p className="mt-2 font-sans text-sm tracking-wider text-muted-foreground md:hidden line-through">
                            {formatPrice(freeGiftProduct.price)}
                          </p>
                          <p className="font-sans text-sm tracking-wider text-green-600 md:hidden font-medium">
                            Free
                          </p>
                        </div>
                      </div>
                      
                      <div className="col-span-1 md:col-span-3 flex items-center md:justify-center text-muted-foreground text-sm font-medium">
                        1
                      </div>
                      
                      <div className="col-span-1 md:col-span-3 hidden md:flex flex-col items-end justify-center font-sans text-sm tracking-wider">
                        <span className="line-through text-muted-foreground text-xs">{formatPrice(freeGiftProduct.price)}</span>
                        <span className="text-green-600 font-medium">Free</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-4 mt-8 lg:mt-0">
                <div className="bg-cream/40 rounded-xl p-8 border border-border/50 sticky top-24">
                  <h3 className="font-serif text-xl mb-6">Order Summary</h3>
                  
                  {/* Promo Code Section */}
                  <div className="mb-6 pb-6 border-b border-border/70">
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

                  <div className="flex justify-between items-center mb-4 text-muted-foreground text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartSubtotal)}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center mb-4 text-sm text-green-700">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pb-6 border-b border-border/70 text-muted-foreground text-sm">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-6 text-foreground">
                    <span className="font-medium">Total</span>
                    <span className="font-sans tracking-wider text-lg">{formatPrice(finalTotal)}</span>
                  </div>
                  
                  <Link to="/checkout" className="block w-full">
                    <LuxeButton className="w-full bg-pastel-pink/20 hover:bg-pastel-pink/30 text-foreground border-foreground/20">
                      CHECKOUT
                    </LuxeButton>
                  </Link>
                  
                  <div className="mt-6 flex items-center justify-center gap-4 text-[0.625rem] text-muted-foreground uppercase tracking-widest text-center">
                    <span>Secure Checkout</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>Free Returns</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
