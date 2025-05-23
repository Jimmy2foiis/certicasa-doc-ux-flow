import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DocumentStatusBadge from '@/features/documents/DocumentStatusBadge';
import DocumentActionButtons from '@/features/documents/DocumentActionButtons';
import { AdministrativeDocument } from '@/models/documents';

interface DocumentsTableProps {
  documents: AdministrativeDocument[];
  onDocumentAction: (documentId: string, action: string) => void;
}

const DocumentsTable = ({ documents, onDocumentAction }: DocumentsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[50%] font-medium">Document</TableHead>
            <TableHead className="w-[20%] font-medium">Statut</TableHead>
            <TableHead className="w-[30%] font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents
            .sort((a, b) => a.order - b.order)
            .map((document) => (
              <TableRow key={document.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">
                  <div className="flex items-start gap-2">
                    <span className="bg-muted w-6 h-6 rounded-full flex items-center justify-center text-xs mt-0.5">
                      {document.order}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{document.name}</p>
                      <p className="text-xs text-muted-foreground">{document.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <DocumentStatusBadge
                    status={document.status}
                    customLabel={document.statusLabel}
                  />
                </TableCell>
                <TableCell>
                  <DocumentActionButtons
                    documentType={document.type}
                    status={document.status}
                    onAction={(action) => onDocumentAction(document.id, action)}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentsTable;
