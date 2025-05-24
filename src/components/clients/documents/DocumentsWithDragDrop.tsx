
import React, { useState } from 'react';
import { AdministrativeDocument } from '@/types/documents';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getOperationalStatus } from './DocumentStatusUtils';
import { DocumentActionButtons } from './DocumentActionButtons';
import { DocumentsProgressBar } from './DocumentsProgressBar';
import { DocumentAccordionContent } from './DocumentAccordionContent';

interface DocumentsWithDragDropProps {
  documents: AdministrativeDocument[];
  isLoading: boolean;
  onAction: (documentId: string, action: string) => void;
}

const DocumentsLoadingState = () => (
  <div className="space-y-4">
    {Array(8).fill(0).map((_, i) => (
      <div key={i} className="animate-pulse border rounded-md p-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
          <div className="w-20 h-6 bg-gray-200 rounded"></div>
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export const DocumentsWithDragDrop: React.FC<DocumentsWithDragDropProps> = ({
  documents,
  isLoading,
  onAction,
}) => {
  const [expandedDocuments, setExpandedDocuments] = useState<Set<string>>(new Set());

  // Sort documents by order (fixed 1-8)
  const orderedDocuments = documents.sort((a, b) => (a.order || 0) - (b.order || 0));

  const toggleDocument = (documentId: string) => {
    const newExpanded = new Set(expandedDocuments);
    if (newExpanded.has(documentId)) {
      newExpanded.delete(documentId);
    } else {
      newExpanded.add(documentId);
    }
    setExpandedDocuments(newExpanded);
  };

  const handleGenerateAll = () => {
    orderedDocuments
      .filter(doc => ['missing', 'pending', 'ready'].includes(doc.status))
      .forEach(doc => onAction(doc.id, 'generate'));
  };

  if (isLoading) {
    return <DocumentsLoadingState />;
  }

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <DocumentsProgressBar documents={orderedDocuments} onGenerateAll={handleGenerateAll} />

      {/* Documents Accordion List */}
      <div className="space-y-3">
        {orderedDocuments.map((doc) => {
          const operationalStatus = getOperationalStatus(doc.status);
          const StatusIcon = operationalStatus.icon;
          const isExpanded = expandedDocuments.has(doc.id);
          
          return (
            <div
              key={doc.id}
              className="border rounded-lg overflow-hidden bg-white hover:shadow-sm transition-shadow"
            >
              {/* Document Header - Always visible */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Accordion Toggle Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => toggleDocument(doc.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    
                    {/* Document Order Number */}
                    <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {doc.order || 1}
                    </div>
                    
                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{doc.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{doc.reference}</p>
                    </div>

                    {/* Status Badge - repositioned here */}
                    <Badge className={`flex items-center gap-1.5 font-normal px-2 py-1 ${operationalStatus.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      <span>{operationalStatus.label}</span>
                    </Badge>
                  </div>
                  
                  {/* Primary Action Button */}
                  <div className="flex items-center gap-2 ml-3">
                    <DocumentActionButtons 
                      document={doc} 
                      onAction={(action) => onAction(doc.id, action)}
                      compact={true}
                    />
                  </div>
                </div>
              </div>
              
              {/* Accordion Content - Document Actions */}
              {isExpanded && (
                <div className="border-t bg-gray-50">
                  <DocumentAccordionContent 
                    document={doc}
                    onAction={(action) => onAction(doc.id, action)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
