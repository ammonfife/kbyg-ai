import iconGradient from "@/assets/brand/icon-gradient.svg";
import iconFilled from "@/assets/brand/icon-filled.svg";
import logoCompact from "@/assets/brand/logo-compact.svg";
import logoHorizontal from "@/assets/brand/logo-horizontal.svg";

interface BrandIconProps {
  variant?: "gradient" | "filled";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-10 w-10",
  xl: "h-12 w-12",
};

export function BrandIcon({ variant = "gradient", size = "md", className = "" }: BrandIconProps) {
  const icon = variant === "filled" ? iconFilled : iconGradient;
  
  return (
    <img 
      src={icon} 
      alt="KBYG.ai" 
      className={`${sizeMap[size]} ${className}`}
    />
  );
}

interface BrandLogoProps {
  variant?: "compact" | "horizontal";
  className?: string;
}

export function BrandLogo({ variant = "horizontal", className = "" }: BrandLogoProps) {
  const logo = variant === "compact" ? logoCompact : logoHorizontal;
  
  return (
    <img 
      src={logo} 
      alt="KBYG.ai" 
      className={className}
    />
  );
}
