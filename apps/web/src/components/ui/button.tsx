import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-subtle hover:bg-primary/90 dark:hover:bg-primary/70",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 dark:hover:bg-destructive/80",
        outline:
          "border border-border bg-card text-foreground shadow-subtle hover:bg-muted hover:text-foreground hover:border-border/80",
        secondary:
          "bg-secondary text-secondary-foreground shadow-subtle hover:bg-secondary/80 dark:hover:bg-secondary/60",
        ghost:
          "text-muted-foreground hover:bg-muted hover:text-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-primary via-indigo-600 to-violet-600 text-white shadow-subtle hover:brightness-105 hover:shadow-glow",
        success:
          "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
        info:
          "bg-indigo-50 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 dark:text-indigo-300",
      },
      size: {
        default: "h-9 px-4 py-2 text-xs sm:text-sm",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-sm sm:text-base font-semibold",
        icon: "h-9 w-9 rounded-lg",
        "icon-sm": "h-7 w-7 rounded-md",
        xs: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };