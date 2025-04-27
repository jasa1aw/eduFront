import { ComponentProps, forwardRef } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";
import { FieldError } from "react-hook-form";
import { LucideIcon } from "lucide-react";

interface FormInputProps extends ComponentProps<typeof Input> {
  label: string;
  error?: FieldError;
  autoComplete?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, autoComplete, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={props.id} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            autoComplete={autoComplete}
            className={cn(
              "h-12 border-gray-200 focus:ring-emerald-500",
              "focus:border-emerald-500 focus:ring-emerald-500",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm animate-slideDown">{error.message}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput }; 