
import { useState } from "react";
import { Save } from "lucide-react";
import GenerationSuccess from "../GenerationSuccess";
import DocumentActions from "../DocumentActions";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SuccessStateProps {
  onDownload: () => Promise<void>;
  onSaveToFolder?: () => Promise<boolean>;
  clientId?: string;
  clientName?: string;
  documentId?: string | null;
}

const SuccessState = ({ 
  onDownload, 
  onSaveToFolder, 
  clientId, 
  clientName, 
  documentId 
}: SuccessStateProps) => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveToFolder = async () => {
    if (!onSaveToFolder) {
      toast({
        title: "Action non disponible",
        description: "La fonctionnalité d'enregistrement n'est pas disponible.",
        variant: "destructive",
      });
      return;
    }
    
    setSaving(true);
    try {
      await onSaveToFolder();
    } catch (error) {
      console.error("Error saving document to folder:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du document.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <GenerationSuccess clientId={clientId} clientName={clientName} />
      <DialogFooter>
        {onSaveToFolder && clientId ? (
          <DocumentActions 
            onDownload={onDownload} 
            documentId={documentId || undefined} 
            clientId={clientId}
          />
        ) : (
          <Button onClick={() => onDownload()} variant="outline" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        )}
      </DialogFooter>
    </>
  );
};

export default SuccessState;
