import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "secondary" | "destructive";
}

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  let variantStyles = "";
  switch (variant) {
    case "default":
      variantStyles =
        "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 bg-green-600 text-white";
      break;
    case "secondary":
      variantStyles =
        "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-gray-100 text-gray-900";
      break;
    case "destructive":
      variantStyles =
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 bg-red-500 text-white";
      break;
    case "outline":
      variantStyles = "text-foreground border-gray-300 transform";
      break;
  }

  return (
    <span
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    />
  );
}
