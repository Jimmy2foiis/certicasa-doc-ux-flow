
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ClientDocumentGenerator from "./ClientDocumentGenerator";
import { Button } from "@/components/ui/button";
import { Ellipsis, FileText, Pencil, Phone, Mail, Calendar } from "lucide-react";
import ClientAvatar from "./ClientAvatar";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ClientDetailsHeaderProps {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    type: string;
  };
  onEdit?: () => void;
}

const ClientDetailsHeader: React.FC<ClientDetailsHeaderProps> = ({ client, onEdit }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showOptions, setShowOptions] = useState(false);

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    } else {
      toast({
        title: "Edition non disponible",
        description: "Cette fonctionnalité n'est pas encore implémentée",
        duration: 3000,
      });
    }
  };

  const handleDocumentGenerated = (documentId: string) => {
    toast({
      title: "Document généré",
      description: `Document ${documentId} généré avec succès`,
    });
    // Rediriger vers la page de documents ou mettre à jour l'UI
  };

  return (
    <div className="flex flex-col md:flex-row justify-between p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <ClientAvatar name={client.name} />
        <div>
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <div className="flex flex-col mt-1">
            <div className="flex items-center text-gray-500">
              <Phone className="h-4 w-4 mr-2" />
              <span>{client.phone || "Non renseigné"}</span>
            </div>
            <div className="flex items-center text-gray-500 mt-1">
              <Mail className="h-4 w-4 mr-2" />
              <span>{client.email || "Non renseigné"}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <ClientDocumentGenerator 
          clientId={client.id} 
          clientName={client.name} 
          onDocumentGenerated={handleDocumentGenerated}
        />
        
        <Button variant="outline" onClick={handleEditClick}>
          <Pencil className="h-5 w-5 mr-2" />
          Modifier
        </Button>
        
        <DropdownMenu open={showOptions} onOpenChange={setShowOptions}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Ellipsis className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/calculations?client=${client.id}`)}>
              <Calendar className="h-4 w-4 mr-2" />
              Nouveaux calculs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/documents?client=${client.id}`)}>
              <FileText className="h-4 w-4 mr-2" />
              Voir les documents
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ClientDetailsHeader;
