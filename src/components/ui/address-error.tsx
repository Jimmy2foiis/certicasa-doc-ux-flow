
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AddressErrorProps {
  error: string;
}

export const AddressError = ({ error }: AddressErrorProps) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="py-2">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-xs">{error}</AlertDescription>
    </Alert>
  );
};
