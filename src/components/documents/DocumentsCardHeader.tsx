
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentsCardHeaderProps {
  clientName?: string;
  projectType?: string;
}

const DocumentsCardHeader = ({ clientName = "Client", projectType = "RES010" }: DocumentsCardHeaderProps) => {
  return (
    <CardHeader className="pb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <CardTitle>Dossier Administratif</CardTitle>
        </div>
        <Button variant="default" className="bg-green-600 hover:bg-green-700">
          Générer un document
        </Button>
      </div>
      <CardDescription>
        Dossier: {clientName} - {projectType}
      </CardDescription>
    </CardHeader>
  );
};

export default DocumentsCardHeader;
