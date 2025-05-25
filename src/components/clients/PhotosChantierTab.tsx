
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Image as ImageIcon, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PhotoGallery } from './photos/PhotoGallery';
import { PhotoSelectionPanel } from './photos/PhotoSelectionPanel';
import { PhotoModeSelector } from './photos/PhotoModeSelector';
import { SafetyCultureService } from '@/services/safetyCultureService';
import { generatePhotosReportPDF } from '@/services/photosReportService';
import type { SafetyCultureAudit, SafetyCulturePhoto, SelectedPhoto } from '@/types/safetyCulture';

interface PhotosChantierTabProps {
  clientId: string;
  clientName?: string;
  safetyCultureAuditId?: string;
}

export type SelectionMode = 'avant' | 'apres';

const PhotosChantierTab = ({ 
  clientId, 
  clientName = 'Client', 
  safetyCultureAuditId 
}: PhotosChantierTabProps) => {
  const [audits, setAudits] = useState<SafetyCultureAudit[]>([]);
  const [selectedAuditId, setSelectedAuditId] = useState<string>(safetyCultureAuditId || '');
  const [photos, setPhotos] = useState<SafetyCulturePhoto[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<{
    avant: SelectedPhoto[];
    apres: SelectedPhoto[];
  }>({ avant: [], apres: [] });
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('avant');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  // Charger les inspections disponibles
  useEffect(() => {
    loadAudits();
  }, []);

  // Charger les photos quand une inspection est sélectionnée
  useEffect(() => {
    if (selectedAuditId) {
      loadPhotos(selectedAuditId);
    }
  }, [selectedAuditId]);

  const loadAudits = async () => {
    try {
      setLoading(true);
      const auditsList = await SafetyCultureService.getAudits();
      setAudits(auditsList);
      
      if (safetyCultureAuditId && auditsList.some(audit => audit.id === safetyCultureAuditId)) {
        setSelectedAuditId(safetyCultureAuditId);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des inspections:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les inspections SafetyCulture",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async (auditId: string) => {
    try {
      setLoading(true);
      const auditPhotos = await SafetyCultureService.getAuditPhotos(auditId);
      setPhotos(auditPhotos);
      
      // Réinitialiser les sélections
      setSelectedPhotos({ avant: [], apres: [] });
      
      toast({
        title: "Photos chargées",
        description: `${auditPhotos.length} photo(s) trouvée(s) dans l'inspection`,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les photos de l'inspection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (photo: SafetyCulturePhoto) => {
    const currentSelection = selectedPhotos[selectionMode];
    const isSelected = currentSelection.some(p => p.photo.id === photo.id);
    
    if (isSelected) {
      // Retirer la photo
      setSelectedPhotos(prev => ({
        ...prev,
        [selectionMode]: prev[selectionMode].filter(p => p.photo.id !== photo.id)
      }));
    } else {
      // Ajouter la photo si limite pas atteinte
      if (currentSelection.length < 6) {
        const newSelectedPhoto: SelectedPhoto = {
          photo,
          order: currentSelection.length + 1
        };
        setSelectedPhotos(prev => ({
          ...prev,
          [selectionMode]: [...prev[selectionMode], newSelectedPhoto]
        }));
      } else {
        toast({
          title: "Limite atteinte",
          description: `Maximum 6 photos ${selectionMode.toUpperCase()}`,
          variant: "destructive",
        });
      }
    }
  };

  const handlePhotoRemove = (photoId: string, mode: SelectionMode) => {
    setSelectedPhotos(prev => ({
      ...prev,
      [mode]: prev[mode].filter(p => p.photo.id !== photoId)
    }));
  };

  const handleReorderPhotos = (mode: SelectionMode, reorderedPhotos: SelectedPhoto[]) => {
    const updatedPhotos = reorderedPhotos.map((photo, index) => ({
      ...photo,
      order: index + 1
    }));
    
    setSelectedPhotos(prev => ({
      ...prev,
      [mode]: updatedPhotos
    }));
  };

  const generateReport = async () => {
    if (selectedPhotos.avant.length === 0 && selectedPhotos.apres.length === 0) {
      toast({
        title: "Aucune photo sélectionnée",
        description: "Veuillez sélectionner au moins une photo avant ou après",
        variant: "destructive",
      });
      return;
    }

    try {
      setGenerating(true);
      
      const selectedAudit = audits.find(audit => audit.id === selectedAuditId);
      
      const reportData = {
        clientName,
        projectTitle: selectedAudit?.title || 'Inspection chantier',
        auditDate: selectedAudit?.created_at || new Date().toISOString(),
        photosAvant: selectedPhotos.avant,
        photosApres: selectedPhotos.apres
      };

      await generatePhotosReportPDF(reportData);
      
      toast({
        title: "Document généré",
        description: "Le rapport photos a été téléchargé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le document",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const totalSelectedPhotos = selectedPhotos.avant.length + selectedPhotos.apres.length;

  return (
    <div className="space-y-6">
      {/* En-tête avec sélection d'inspection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Photos de Chantier
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Sélection et organisation des photos avant/après pour {clientName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">
                {totalSelectedPhotos} photo(s) sélectionnée(s)
              </Badge>
              <Button
                onClick={generateReport}
                disabled={generating || totalSelectedPhotos === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                {generating ? 'Génération...' : 'Générer PDF'}
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
                onValueChange={setSelectedAuditId}
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
              <div className="text-2xl font-bold">{photos.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface de sélection */}
      {selectedAuditId && photos.length > 0 && (
        <div className="grid grid-cols-12 gap-6 h-[600px]">
          {/* Galerie de photos (gauche) */}
          <div className="col-span-5">
            <PhotoGallery
              photos={photos}
              selectedPhotos={selectedPhotos}
              selectionMode={selectionMode}
              onPhotoSelect={handlePhotoSelect}
              loading={loading}
            />
          </div>

          {/* Sélecteur de mode (centre) */}
          <div className="col-span-2">
            <PhotoModeSelector
              mode={selectionMode}
              onModeChange={setSelectionMode}
              selectedCounts={{
                avant: selectedPhotos.avant.length,
                apres: selectedPhotos.apres.length
              }}
            />
          </div>

          {/* Panneau de sélection (droite) */}
          <div className="col-span-5">
            <PhotoSelectionPanel
              selectedPhotos={selectedPhotos}
              onPhotoRemove={handlePhotoRemove}
              onReorderPhotos={handleReorderPhotos}
            />
          </div>
        </div>
      )}

      {/* État vide */}
      {!selectedAuditId && (
        <Card>
          <CardContent className="text-center p-8">
            <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Sélectionner une inspection</h3>
            <p className="text-muted-foreground">
              Choisissez une inspection SafetyCulture pour commencer la sélection des photos
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhotosChantierTab;
