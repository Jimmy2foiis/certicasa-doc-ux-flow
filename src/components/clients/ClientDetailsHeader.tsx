
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import GenerateDocumentButton from "../documents/GenerateDocumentButton";

interface ClientDetailsHeaderProps {
  onBack: () => void;
  clientId?: string;
  clientName?: string;
}

const ClientDetailsHeader = ({ onBack, clientId, clientName }: ClientDetailsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-semibold">Fiche Client</h2>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">Modifier</Button>
        {clientId && <GenerateDocumentButton clientId={clientId} clientName={clientName} />}
        <Button className="bg-green-600 hover:bg-green-700">Nouveau Projet</Button>
      </div>
    </div>
  );
};

export default ClientDetailsHeader;
