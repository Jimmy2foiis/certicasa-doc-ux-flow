
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Trash2 } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  status?: string;
  created_at?: string;
}

interface DocumentsTableProps {
  documents: Document[];
  onDownload: (document: Document) => void;
  onSend: (documentId: string) => void;
  onDelete: (documentId: string) => void;
  getStatusColor: (status: string) => string;
}

const DocumentsTable = ({
  documents,
  onDownload,
  onSend,
  onDelete,
  getStatusColor
}: DocumentsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="font-medium">{doc.name}</TableCell>
            <TableCell>{doc.type}</TableCell>
            <TableCell>
              {new Date(doc.created_at || Date.now()).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(doc.status || "available")}>
                {doc.status || "available"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(doc)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                {doc.status !== "sent" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSend(doc.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(doc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DocumentsTable;
