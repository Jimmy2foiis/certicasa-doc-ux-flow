
import { DialogFooter } from "@/components/ui/dialog";
import DocumentActions from "../DocumentActions";
import GenerationSuccess from "../GenerationSuccess";

interface GeneratedDocumentContentProps {
  documentId: string | null;
  clientId: string;
  canDownload: boolean;
  onDownload: () => void;
}

export function GeneratedDocumentContent({
  documentId,
  clientId,
  canDownload,
  onDownload
}: GeneratedDocumentContentProps) {
  return (
    <>
      <GenerationSuccess />
      <DialogFooter>
        <DocumentActions 
          onDownload={onDownload} 
          documentId={documentId || undefined}
          clientId={clientId}
          canDownload={canDownload}
        />
      </DialogFooter>
    </>
  );
}
