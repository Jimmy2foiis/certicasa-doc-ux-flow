
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ClientAvatarProps {
  name: string;
  status?: string;
  className?: string;
}

const ClientAvatar = ({ name, status, className }: ClientAvatarProps) => {
  // Create initials from name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  if (status) {
    return (
      <div className="flex items-center">
        <div className={cn("h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600", className)}>
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
  }

  return (
    <Avatar className={cn("bg-gray-200 text-gray-600", className)}>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default ClientAvatar;
