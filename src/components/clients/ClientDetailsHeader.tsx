
import { ArrowLeft, Mail, Phone, MapPin, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClientAvatar } from "./ClientAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientDisplayData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  nif: string;
  status?: string;
}

interface ClientDetailsHeaderProps {
  onBack: () => void;
  client: ClientDisplayData;
}

export const ClientDetailsHeader = ({ onBack, client }: ClientDetailsHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-start space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mt-1">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <ClientAvatar name={client.name} className="h-16 w-16" />
        
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">{client.name}</h1>
            {client.status && (
              <Badge className={`${
                client.status === 'active' ? 'bg-green-100 text-green-800' : 
                client.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {client.status}
              </Badge>
            )}
          </div>
          
          <div className="mt-2 space-y-1">
            {client.email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>{client.email}</span>
              </div>
            )}
            
            {client.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>{client.phone}</span>
              </div>
            )}
            
            {client.address && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{client.address}</span>
              </div>
            )}
          </div>
          
          {client.nif && (
            <p className="text-xs text-gray-500 mt-1">
              Référence cadastrale: {client.nif}
            </p>
          )}
        </div>
      </div>
      
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>Modifier</DropdownMenuItem>
            <DropdownMenuItem>Exporter les données</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Archiver</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ClientDetailsHeader;
