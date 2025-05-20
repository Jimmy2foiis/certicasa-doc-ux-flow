
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DocumentsCardHeaderProps {
  clientName?: string;
  projectType?: string;
}

const DocumentsCardHeader = ({ clientName = "Client", projectType = "RES010" }: DocumentsCardHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle>Suivi des Documents Administratifs : {clientName} - {projectType}</CardTitle>
      <CardDescription>
        Statut des 8 documents obligatoires pour le dossier client
      </CardDescription>
    </CardHeader>
  );
};

export default DocumentsCardHeader;
