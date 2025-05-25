
import React from 'react';
import { PhotoGallery } from './PhotoGallery';
import { PhotoSelectionPanel } from './PhotoSelectionPanel';
import { PhotoModeSelector } from './PhotoModeSelector';
import type { SafetyCulturePhoto, SelectedPhoto } from '@/types/safetyCulture';
import type { SelectionMode } from '@/hooks/photos/usePhotoSelection';

interface PhotoSelectionInterfaceProps {
  photos: SafetyCulturePhoto[];
  selectedPhotos: {
    avant: SelectedPhoto[];
    apres: SelectedPhoto[];
  };
  selectionMode: SelectionMode;
  onModeChange: (mode: SelectionMode) => void;
  onPhotoSelect: (photo: SafetyCulturePhoto) => void;
  onPhotoRemove: (photoId: string, mode: SelectionMode) => void;
  onReorderPhotos: (mode: SelectionMode, reorderedPhotos: SelectedPhoto[]) => void;
  loading: boolean;
}

export const PhotoSelectionInterface = ({
  photos,
  selectedPhotos,
  selectionMode,
  onModeChange,
  onPhotoSelect,
  onPhotoRemove,
  onReorderPhotos,
  loading
}: PhotoSelectionInterfaceProps) => {
  return (
    <div className="grid grid-cols-12 gap-6 h-[600px]">
      {/* Galerie de photos (gauche) */}
      <div className="col-span-5">
        <PhotoGallery
          photos={photos}
          selectedPhotos={selectedPhotos}
          selectionMode={selectionMode}
          onPhotoSelect={onPhotoSelect}
          loading={loading}
        />
      </div>

      {/* Sélecteur de mode (centre) */}
      <div className="col-span-2">
        <PhotoModeSelector
          mode={selectionMode}
          onModeChange={onModeChange}
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
          onPhotoRemove={onPhotoRemove}
          onReorderPhotos={onReorderPhotos}
        />
      </div>
    </div>
  );
};
