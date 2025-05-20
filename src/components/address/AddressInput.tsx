
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";
import { forwardRef } from "react";

interface AddressInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
}

/**
 * Composant d'entrée d'adresse réutilisable avec icône et indicateur de chargement
 */
export const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ isLoading, ...props }, ref) => {
    return (
      <div className="relative">
        <MapPin className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
        {isLoading && <Loader2 className="absolute right-2.5 top-2.5 h-5 w-5 text-gray-400 animate-spin" />}
        <Input
          ref={ref}
          placeholder="Saisissez une adresse espagnole..."
          className="pl-10"
          disabled={isLoading}
          {...props}
        />
      </div>
    );
  }
);

AddressInput.displayName = "AddressInput";
