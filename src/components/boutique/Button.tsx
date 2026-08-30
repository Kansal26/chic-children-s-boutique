import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

export const luxeButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] uppercase transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        outline:
          "border border-foreground/25 text-foreground hover:border-gold hover:bg-gold/10 hover:tracking-[0.28em]",
        ghost: "text-foreground/70 hover:text-foreground hover:bg-cream",
        solid:
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:tracking-[0.28em]",
        onImage:
          "border border-primary-foreground/60 bg-primary/10 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground hover:text-primary hover:tracking-[0.28em]",
      },
      size: {
        sm: "h-9 px-5 text-[0.625rem] tracking-[0.22em]",
        md: "h-11 px-8 text-[0.6875rem] tracking-[0.24em]",
        lg: "h-[3.25rem] px-11 text-xs tracking-[0.26em]",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);

export interface LuxeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof luxeButtonVariants> {
  asChild?: boolean;
}

export function LuxeButton({
  className,
  variant,
  size,
  asChild,
  ...props
}: LuxeButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(luxeButtonVariants({ variant, size }), className)} {...props} />
  );
}
