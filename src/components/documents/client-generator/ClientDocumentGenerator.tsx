
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import DocumentGeneratorDialog from "./DocumentGeneratorDialog";

interface ClientDocumentGeneratorProps {
  clientId: string;
  clientName: string;
  onDocumentGenerated?: (documentId: string) => void;
  buttonVariant?: "default" | "outline" | "secondary";
  buttonSize?: "default" | "sm" | "lg";
  fullWidth?: boolean;
}

const ClientDocumentGenerator = ({
  clientId,
  clientName,
  onDocumentGenerated,
  buttonVariant = "default",
  buttonSize = "default",
  fullWidth = false,
}: ClientDocumentGeneratorProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        className={fullWidth ? "w-full" : ""}
        onClick={() => setIsDialogOpen(true)}
      >
        <FileText className="mr-2 h-5 w-5" />
        Générer un document
      </Button>

      <DocumentGeneratorDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        clientId={clientId}
        clientName={clientName}
        onDocumentGenerated={onDocumentGenerated}
      />
    </>
  );
};

export default ClientDocumentGenerator;
