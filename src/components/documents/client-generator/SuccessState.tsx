
import { Save } from "lucide-react";
import GenerationSuccess from "../GenerationSuccess";
import DocumentActions from "../DocumentActions";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SuccessStateProps {
  onDownload: () => void;
  onSaveToFolder?: () => Promise<boolean>;
  clientId?: string;
  clientName?: string;
  documentId?: string | null;
}

const SuccessState = ({ onDownload, onSaveToFolder, clientId, clientName, documentId }: SuccessStateProps) => {
  const [saving, setSaving] = useState(false);

  const handleSaveToFolder = async () => {
    if (!onSaveToFolder) return;
    
    setSaving(true);
    try {
      await onSaveToFolder();
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
          <Button onClick={onDownload} variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        )}
      </DialogFooter>
    </>
  );
};

export default SuccessState;
