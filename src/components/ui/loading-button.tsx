import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export const LoadingButton = ({
  isLoading,
  loadingText,
  children,
  className = "w-full h-12 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors",
  disabled,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      className={className}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}; 