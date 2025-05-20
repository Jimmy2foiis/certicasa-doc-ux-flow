
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DocumentStatusBadge from "@/components/documents/DocumentStatusBadge";
import DocumentActionButtons from "@/components/documents/DocumentActionButtons";
import { AdministrativeDocument } from "@/models/documents";

interface DocumentsTableProps {
  documents: AdministrativeDocument[];
  onDocumentAction: (documentId: string, action: string) => void;
}

const DocumentsTable = ({ documents, onDocumentAction }: DocumentsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50%]">Document</TableHead>
          <TableHead className="w-[20%]">Statut</TableHead>
          <TableHead className="w-[30%]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents
          .sort((a, b) => a.order - b.order)
          .map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">
                {document.order}. {document.name}
                <div className="text-xs text-muted-foreground mt-1">{document.description}</div>
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
  );
};

export default DocumentsTable;
