import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  // color?: "primary" | "secondary" | "accent";
  speed?: "slow" | "normal" | "fast";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", speed = "normal", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-full",
          {
            "w-4 h-4": size === "sm",
            "w-8 h-8": size === "md",
            "w-12 h-12": size === "lg",
          },
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "absolute w-full h-full border-4 border-t-transparent rounded-full",
            {
              "animate-spin-slow": speed === "slow",
              "animate-spin-normal": speed === "normal",
              "animate-spin-fast": speed === "fast",
            },
          )}
        />
      </div>
    );
  },
);

Spinner.displayName = "Spinner";

export { Spinner };
