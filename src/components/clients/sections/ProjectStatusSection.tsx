
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ProjectStatusSectionProps {
  documentStats?: {
    total: number;
    generated: number;
    missing: number;
    error: number;
  };
  onViewMissingDocs?: () => void;
}

const ProjectStatusSection = ({
  documentStats,
  onViewMissingDocs
}: ProjectStatusSectionProps) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border">
      <div className="flex items-center gap-6">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
          RES020
        </Badge>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
          En cours
        </Badge>
        <span className="text-sm text-gray-600">
          Numéro lot: <span className="font-medium">-</span>
        </span>
        <span className="text-sm text-gray-600">
          Date dépôt: <span className="font-medium">-</span>
        </span>
        <span className="text-sm text-gray-600">
          Documents: <span className="font-medium">{documentStats ? `${documentStats.generated}/${documentStats.total}` : '5/8'}</span>
        </span>
      </div>
      
      {documentStats && documentStats.missing > 0 && (
        <Button variant="outline" size="sm" onClick={onViewMissingDocs} className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Voir les documents manquants
        </Button>
      )}
    </div>
  );
};

export default ProjectStatusSection;
