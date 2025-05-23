
import { useState, useEffect } from "react";
import { DocumentTemplate, TemplateTag } from "@/types/documents";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText } from "lucide-react";
import TemplateVariableMapping from "../template-mapping/TemplateVariableMapping";
import { useToast } from "@/hooks/use-toast";

interface MappingTabContentProps {
  template: DocumentTemplate | undefined;
  clientData: any;
  onMappingComplete: (mappings: TemplateTag[]) => void;
  onBack: () => void;
  onGenerate: () => void;
  templateValid: boolean;
  templateMappings: TemplateTag[];
}

export function MappingTabContent({
  template,
  clientData,
  onMappingComplete,
  onBack,
  onGenerate,
  templateValid,
  templateMappings
}: MappingTabContentProps) {
  if (!template) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun modèle sélectionné</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!templateValid && (
        <Alert variant="default" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Avertissement</AlertTitle>
          <AlertDescription>
            Le modèle sélectionné semble être vide ou contient un format invalide. 
            La génération pourrait échouer ou produire un document vide.
          </AlertDescription>
        </Alert>
      )}
      
      <TemplateVariableMapping
        template={template}
        clientData={clientData}
        onMappingComplete={onMappingComplete}
      />
      
      <Separator />
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
        >
          ← Retour
        </Button>
        <Button
          disabled={!templateValid || templateMappings.length === 0}
          onClick={onGenerate}
        >
          <FileText className="mr-2 h-4 w-4" />
          Générer le document
        </Button>
      </div>
    </div>
  );
}
