
import React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentGeneratorDialog from "@/components/documents/client-generator/DocumentGeneratorDialog";
import { useDocumentGeneratorState } from "@/hooks/useDocumentGeneratorState";

interface ClientDocumentGeneratorProps {
  clientId: string;
  clientName?: string;
  onDocumentGenerated?: (documentId: string) => void;
}

const ClientDocumentGenerator = ({
  clientId,
  clientName = "Client",
  onDocumentGenerated = () => {}
}: ClientDocumentGeneratorProps) => {
  const {
    isOpen,
    setIsOpen
  } = useDocumentGeneratorState({
    clientId,
    clientName,
    onDocumentGenerated
  });

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <FileText className="mr-2 h-5 w-5" />
        Générer un document
      </Button>

      <DocumentGeneratorDialog 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        clientId={clientId}
        clientName={clientName}
        onDocumentGenerated={onDocumentGenerated}
      />
    </>
  );
};

export default ClientDocumentGenerator;
