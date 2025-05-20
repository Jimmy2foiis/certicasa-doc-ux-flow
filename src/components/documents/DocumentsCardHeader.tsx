
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface DocumentsCardHeaderProps {
  clientName?: string;
  projectType?: string;
}

const DocumentsCardHeader = ({ clientName = "Client", projectType = "RES010" }: DocumentsCardHeaderProps) => {
  return (
    <CardHeader className="pb-0">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <CardTitle>Documents Administratifs</CardTitle>
      </div>
      <CardDescription className="flex items-center justify-between">
        <span>Dossier: {clientName} - {projectType}</span>
        <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-md">
          8 documents obligatoires
        </span>
      </CardDescription>
    </CardHeader>
  );
};

export default DocumentsCardHeader;
