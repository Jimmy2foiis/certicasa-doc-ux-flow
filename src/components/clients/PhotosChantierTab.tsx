
import React, { useEffect } from 'react';
import { PhotosChantierHeader } from './photos/PhotosChantierHeader';
import { PhotoSelectionInterface } from './photos/PhotoSelectionInterface';
import { PhotosEmptyState } from './photos/PhotosEmptyState';
import { useAuditManagement } from '@/hooks/photos/useAuditManagement';
import { usePhotoSelection } from '@/hooks/photos/usePhotoSelection';
import { useDocumentGeneration } from '@/hooks/photos/useDocumentGeneration';

interface PhotosChantierTabProps {
  clientId: string;
  clientName?: string;
  safetyCultureAuditId?: string;
  onDocumentGenerated?: () => void;
}

const PhotosChantierTab = ({ 
  clientId, 
  clientName = 'Client', 
  safetyCultureAuditId,
  onDocumentGenerated
}: PhotosChantierTabProps) => {
  const {
    audits,
    selectedAuditId,
    setSelectedAuditId,
    photos,
    loading
  } = useAuditManagement(safetyCultureAuditId);

  const {
    selectedPhotos,
    selectionMode,
    setSelectionMode,
    handlePhotoSelect,
    handlePhotoRemove,
    handleReorderPhotos,
    resetSelections,
    canGenerate,
    totalSelectedPhotos
  } = usePhotoSelection();

  const { generating, generateDocument } = useDocumentGeneration({
    clientId,
    clientName,
    onDocumentGenerated
  });

  const handleGenerateDocument = async () => {
    const selectedAudit = audits.find(audit => audit.id === selectedAuditId);
    const success = await generateDocument(selectedPhotos, selectedAudit);
    if (success) {
      resetSelections();
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec sélection d'inspection */}
      <PhotosChantierHeader
        clientName={clientName}
        audits={audits}
        selectedAuditId={selectedAuditId}
        onAuditChange={setSelectedAuditId}
        photosCount={photos.length}
        totalSelectedPhotos={totalSelectedPhotos}
        canGenerate={canGenerate}
        generating={generating}
        loading={loading}
        onGenerateDocument={handleGenerateDocument}
      />

      {/* Interface de sélection */}
      {selectedAuditId && photos.length > 0 && (
        <PhotoSelectionInterface
          photos={photos}
          selectedPhotos={selectedPhotos}
          selectionMode={selectionMode}
          onModeChange={setSelectionMode}
          onPhotoSelect={handlePhotoSelect}
          onPhotoRemove={handlePhotoRemove}
          onReorderPhotos={handleReorderPhotos}
          loading={loading}
        />
      )}

      {/* État vide */}
      {!selectedAuditId && <PhotosEmptyState />}
    </div>
  );
};

export default PhotosChantierTab;
