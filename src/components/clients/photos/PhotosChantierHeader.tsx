
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Image as ImageIcon } from 'lucide-react';
import type { SafetyCultureAudit } from '@/types/safetyCulture';

interface PhotosChantierHeaderProps {
  clientName: string;
  audits: SafetyCultureAudit[];
  selectedAuditId: string;
  onAuditChange: (auditId: string) => void;
  photosCount: number;
  totalSelectedPhotos: number;
  canGenerate: boolean;
  generating: boolean;
  loading: boolean;
  onGenerateDocument: () => void;
}

export const PhotosChantierHeader = ({
  clientName,
  audits,
  selectedAuditId,
  onAuditChange,
  photosCount,
  totalSelectedPhotos,
  canGenerate,
  generating,
  loading,
  onGenerateDocument
}: PhotosChantierHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Photos de Chantier - 4-Fotos.docx
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Sélection de 4 photos AVANT et 4 photos APRÈS pour {clientName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline"
              className={canGenerate ? 'border-green-500 text-green-700' : ''}
            >
              {totalSelectedPhotos}/8 photos sélectionnées
            </Badge>
            <Button
              onClick={onGenerateDocument}
              disabled={generating || !canGenerate}
              className="bg-green-600 hover:bg-green-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              {generating ? 'Génération...' : 'Générer 4-Fotos.docx'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">
              Sélectionner une inspection :
            </label>
            <Select
              value={selectedAuditId}
              onValueChange={onAuditChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une inspection SafetyCulture..." />
              </SelectTrigger>
              <SelectContent>
                {audits.map((audit) => (
                  <SelectItem key={audit.id} value={audit.id}>
                    {audit.title} - {new Date(audit.created_at).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Photos disponibles</div>
            <div className="text-2xl font-bold">{photosCount}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
