
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { SafetyCulturePhoto, SelectedPhoto } from '@/types/safetyCulture';

export type SelectionMode = 'avant' | 'apres';

export const usePhotoSelection = () => {
  const [selectedPhotos, setSelectedPhotos] = useState<{
    avant: SelectedPhoto[];
    apres: SelectedPhoto[];
  }>({ avant: [], apres: [] });
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('avant');
  const { toast } = useToast();

  const handlePhotoSelect = (photo: SafetyCulturePhoto) => {
    const currentSelection = selectedPhotos[selectionMode];
    const isSelected = currentSelection.some(p => p.photo.id === photo.id);
    
    if (isSelected) {
      // Retirer la photo et réorganiser les numéros
      const newSelection = currentSelection
        .filter(p => p.photo.id !== photo.id)
        .map((p, index) => ({ ...p, order: index + 1 }));
      
      setSelectedPhotos(prev => ({
        ...prev,
        [selectionMode]: newSelection
      }));
    } else {
      // Ajouter la photo si limite pas atteinte (exactement 4)
      if (currentSelection.length < 4) {
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
          description: `Maximum 4 photos ${selectionMode.toUpperCase()}`,
          variant: "destructive",
        });
      }
    }
  };

  const handlePhotoRemove = (photoId: string, mode: SelectionMode) => {
    const newSelection = selectedPhotos[mode]
      .filter(p => p.photo.id !== photoId)
      .map((p, index) => ({ ...p, order: index + 1 }));
    
    setSelectedPhotos(prev => ({
      ...prev,
      [mode]: newSelection
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

  const resetSelections = () => {
    setSelectedPhotos({ avant: [], apres: [] });
  };

  const canGenerate = selectedPhotos.avant.length === 4 && selectedPhotos.apres.length === 4;
  const totalSelectedPhotos = selectedPhotos.avant.length + selectedPhotos.apres.length;

  return {
    selectedPhotos,
    selectionMode,
    setSelectionMode,
    handlePhotoSelect,
    handlePhotoRemove,
    handleReorderPhotos,
    resetSelections,
    canGenerate,
    totalSelectedPhotos
  };
};
