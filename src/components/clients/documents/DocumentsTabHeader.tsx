import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
interface DocumentsTabHeaderProps {
  onShowUploadDialog: () => void;
}
const DocumentsTabHeader = ({
  onShowUploadDialog
}: DocumentsTabHeaderProps) => {
  return <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Documents</CardTitle>
        <CardDescription>
          Gestion des 8 documents obligatoires du dossier - Cliquez sur une ligne pour voir l'aperçu
        </CardDescription>
      </div>
      <Button onClick={onShowUploadDialog} className="bg-green-600 hover:bg-green-700">
        <Upload className="h-4 w-4" />
        Ajouter un document
      </Button>
    </CardHeader>;
};
export default DocumentsTabHeader;