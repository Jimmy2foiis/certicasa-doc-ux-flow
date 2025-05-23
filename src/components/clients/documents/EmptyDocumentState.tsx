
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface EmptyDocumentStateProps {
  onAddDocument: () => void;
}

const EmptyDocumentState = ({ onAddDocument }: EmptyDocumentStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-40 space-y-2">
      <FileText className="h-10 w-10 text-gray-400" />
      <p className="text-gray-500">Aucun document disponible pour ce client</p>
      <Button variant="outline" onClick={onAddDocument}>
        Ajouter un premier document
      </Button>
    </div>
  );
};

export default EmptyDocumentState;
