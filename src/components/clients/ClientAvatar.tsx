import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClientAvatarProps {
  name: string;
  status: string;
}

const ClientAvatar = ({ name, status }: ClientAvatarProps) => {
  return (
    <div className="flex items-center">
      <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
        <User className="h-10 w-10" />
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-medium">{name}</h3>
        <Badge variant={status === "Activo" ? "success" : "outline"}>
          {status === "Activo" ? "Actif" : "Inactif"}
        </Badge>
      </div>
    </div>
  );
};

export default ClientAvatar;

// Also export as a named export for flexibility
export { ClientAvatar };
