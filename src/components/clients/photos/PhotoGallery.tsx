
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Image as ImageIcon } from 'lucide-react';
import type { SafetyCulturePhoto, SelectedPhoto } from '@/types/safetyCulture';
import type { SelectionMode } from '@/hooks/photos/usePhotoSelection';

interface PhotoGalleryProps {
  photos: SafetyCulturePhoto[];
  selectedPhotos: {
    avant: SelectedPhoto[];
    apres: SelectedPhoto[];
  };
  selectionMode: SelectionMode;
  onPhotoSelect: (photo: SafetyCulturePhoto) => void;
  loading: boolean;
}

export const PhotoGallery = ({
  photos,
  selectedPhotos,
  selectionMode,
  onPhotoSelect,
  loading
}: PhotoGalleryProps) => {
  const getPhotoSelectionInfo = (photo: SafetyCulturePhoto) => {
    const avantPhoto = selectedPhotos.avant.find(p => p.photo.id === photo.id);
    const apresPhoto = selectedPhotos.apres.find(p => p.photo.id === photo.id);
    
    return {
      isSelectedAvant: !!avantPhoto,
      isSelectedApres: !!apresPhoto,
      avantOrder: avantPhoto?.order,
      apresOrder: apresPhoto?.order,
      isSelectedInCurrentMode: selectionMode === 'avant' ? !!avantPhoto : !!apresPhoto,
      currentOrder: selectionMode === 'avant' ? avantPhoto?.order : apresPhoto?.order
    };
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Galerie photos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Galerie photos
          <Badge variant="outline">{photos.length} photos</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <ScrollArea className="h-[480px]">
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo) => {
              const selectionInfo = getPhotoSelectionInfo(photo);
              
              return (
                <div
                  key={photo.id}
                  className={`
                    relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                    ${selectionInfo.isSelectedInCurrentMode 
                      ? selectionMode === 'avant' 
                        ? 'border-blue-500 ring-2 ring-blue-500/20' 
                        : 'border-green-500 ring-2 ring-green-500/20'
                      : 'border-transparent hover:border-gray-300'
                    }
                  `}
                  onClick={() => onPhotoSelect(photo)}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <img
                      src={photo.thumbnail_url || photo.url}
                      alt={photo.title || 'Photo inspection'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Overlay de sélection */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  
                  {/* Badges de sélection */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {selectionInfo.isSelectedAvant && (
                      <Badge className="bg-blue-500 text-white text-xs">
                        A{selectionInfo.avantOrder}
                      </Badge>
                    )}
                    {selectionInfo.isSelectedApres && (
                      <Badge className="bg-green-500 text-white text-xs">
                        P{selectionInfo.apresOrder}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Indicateur de sélection en cours */}
                  {selectionInfo.isSelectedInCurrentMode && (
                    <div className={`
                      absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold
                      ${selectionMode === 'avant' ? 'bg-blue-500' : 'bg-green-500'}
                    `}>
                      {selectionInfo.currentOrder}
                    </div>
                  )}
                  
                  {/* Titre de la photo */}
                  {photo.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                      <p className="text-xs truncate">{photo.title}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
