import { useState, useEffect } from "react";
import { Product, formatPrice, categoryBySlug } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LuxeButton } from "@/components/boutique/Button";
import { Heart, Minus, Plus } from "lucide-react";
import { SizeGuideTable } from "@/components/boutique/SizeGuideTable";
import { toast } from "sonner";

const SIZES = ["0-3M", "3-6M", "6-12M", "1-2Y", "2-4Y"];

export function QuickAddModal({
  product,
  isOpen,
  onClose,
}: {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);
  const cat = categoryBySlug(product.categories?.[0] || "");

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors ? product.colors[0].name : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [showSizeError, setShowSizeError] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Auto-select size if there's only one in stock, or reset state on open
  useEffect(() => {
    if (isOpen) {
      const initialColor = product.colors && product.colors.length > 1
          ? product.colors[0].name
          : product.colors?.[0].name || null;
          
      setSelectedColor(initialColor);
      setQuantity(1);
      setShowSizeError(false);
      setShowSizeGuide(false);

      const inStockSizes = SIZES.filter((size) => {
        if (!product.variants || product.variants.length === 0) return true;
        const v = product.variants.find(v => v.size === size && (!v.color || v.color === initialColor));
        return v ? v.stock !== 0 : false;
      });
      if (inStockSizes.length === 1) {
        setSelectedSize(inStockSizes[0]);
      } else {
        setSelectedSize(null);
      }
    }
  }, [isOpen, product.id, product.colors, product.variants]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    addToCart({ product, size: selectedSize, color: selectedColor || undefined, quantity });
    toast("Added to your bag");
    onClose();
  };

  const handleWishlist = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    toggleWishlist(product.id, selectedSize, selectedColor || undefined);
    toast(wishlisted ? "Removed from Wishlist" : "Added to Wishlist");
    onClose();
  };

  const activeTint = cat ? cat.tint.replace("bg-", "bg-").replace("-deep", "") : "bg-pastel-pink";
  const selectedBg =
    {
      "bg-pastel-pink": "bg-pastel-pink/40",
      "bg-pastel-lavender": "bg-pastel-lavender/40",
      "bg-pastel-blue": "bg-pastel-blue/40",
      "bg-pastel-peach": "bg-pastel-peach/40",
      "bg-pastel-lemon": "bg-pastel-lemon/40",
      "bg-pastel-mint": "bg-pastel-mint/40",
    }[activeTint] || "bg-pastel-pink/40";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "bg-cream border-border/50 p-0 overflow-hidden sm:max-w-md",
          "max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:translate-y-0 max-sm:rounded-t-[20px] max-sm:rounded-b-none data-[state=open]:max-sm:slide-in-from-bottom data-[state=closed]:max-sm:slide-out-to-bottom",
        )}
      >
        {showSizeGuide ? (
          <div className="p-6">
            <DialogHeader className="mb-4">
              <div className="flex justify-between items-center">
                <DialogTitle className="font-serif text-2xl font-normal">Size Guide</DialogTitle>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-muted-foreground hover:text-foreground text-[0.6875rem] uppercase tracking-[0.1em]"
                >
                  Back
                </button>
              </div>
            </DialogHeader>
            <SizeGuideTable />
          </div>
        ) : (
          <div className="flex flex-col max-h-[85vh] overflow-y-auto">
            {/* Header / Product Info */}
            <div className="flex items-center gap-4 p-5 border-b border-border/30">
              <div className="h-20 w-16 shrink-0 rounded-md overflow-hidden bg-background">
                <img src={product.img} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col flex-1 pr-6">
                <DialogTitle className="font-serif text-lg leading-tight text-foreground">
                  {product.name}
                </DialogTitle>
                <p className="mt-1 font-sans text-sm text-muted-foreground">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-6">
              {/* Color Selection */}
              {product.colors && product.colors.length > 1 && (
                <div>
                  <p className="text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    Color
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        aria-label={`Color ${color.name}`}
                        className={cn(
                          "group flex items-center gap-2 transition-opacity focus-visible:outline-none",
                          selectedColor === color.name
                            ? "opacity-100"
                            : "opacity-60 hover:opacity-100",
                        )}
                      >
                        <span
                          style={{ backgroundColor: color.hex }}
                          className={cn(
                            "h-5 w-5 shrink-0 rounded-full border border-border transition-all duration-300",
                            selectedColor === color.name
                              ? "ring-2 ring-gold ring-offset-1 ring-offset-background"
                              : "",
                          )}
                        />
                        <span
                          className={cn(
                            "text-[0.625rem] uppercase tracking-[0.2em] transition-colors",
                            selectedColor === color.name
                              ? "text-foreground font-medium"
                              : "text-muted-foreground",
                          )}
                        >
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                      Select Size
                    </p>
                    {showSizeError && (
                      <span
                        className="text-[0.625rem] uppercase tracking-[0.1em] text-destructive animate-in fade-in"
                        aria-live="polite"
                      >
                        Please select a size
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[0.5625rem] uppercase tracking-[0.2em] text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                  >
                    Size Guide
                  </button>
                </div>
                <div className={cn("flex flex-wrap gap-2", showSizeError && "animate-shake")}>
                  {SIZES.map((size) => {
                    let inStock = true;
                    if (product.variants && product.variants.length > 0) {
                      const v = product.variants.find(v => v.size === size && (!v.color || v.color === selectedColor));
                      inStock = v ? v.stock !== 0 : false;
                    }
                    return (
                      <button
                        key={size}
                        disabled={!inStock}
                        onClick={() => {
                          setSelectedSize(size);
                          setShowSizeError(false);
                        }}
                        aria-label={
                          inStock ? `Size ${size}, in stock` : `Size ${size}, out of stock`
                        }
                        className={cn(
                          "rounded-[6px] border px-4 py-2 text-[0.625rem] uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold",
                          !inStock
                            ? "border-border/40 text-muted-foreground/40 bg-muted/20 cursor-not-allowed line-through"
                            : selectedSize === size
                              ? `border-transparent text-foreground shadow-sm ${selectedBg}`
                              : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center rounded-[6px] border border-border w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center text-[0.625rem] font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                  className="p-2.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-2">
                <LuxeButton
                  onClick={handleAddToCart}
                  variant="outline"
                  className="w-full bg-cream hover:bg-cream-dark/20 border-border"
                >
                  ADD TO CART
                </LuxeButton>
                <button
                  onClick={handleWishlist}
                  className="flex items-center justify-center gap-2 text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  <Heart className="h-3.5 w-3.5" fill={wishlisted ? "currentColor" : "none"} />
                  {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
