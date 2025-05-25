
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, GripVertical } from 'lucide-react';
import type { SelectedPhoto } from '@/types/safetyCulture';
import type { SelectionMode } from '../PhotosChantierTab';

interface PhotoSelectionPanelProps {
  selectedPhotos: {
    avant: SelectedPhoto[];
    apres: SelectedPhoto[];
  };
  onPhotoRemove: (photoId: string, mode: SelectionMode) => void;
  onReorderPhotos: (mode: SelectionMode, reorderedPhotos: SelectedPhoto[]) => void;
}

export const PhotoSelectionPanel = ({
  selectedPhotos,
  onPhotoRemove,
  onReorderPhotos
}: PhotoSelectionPanelProps) => {
  const PhotoList = ({ 
    photos, 
    mode, 
    color 
  }: { 
    photos: SelectedPhoto[]; 
    mode: SelectionMode; 
    color: string;
  }) => (
    <ScrollArea className="h-[400px]">
      {photos.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          <p>Aucune photo {mode} sélectionnée</p>
          <p className="text-sm mt-1">Cliquez sur les photos dans la galerie</p>
        </div>
      ) : (
        <div className="space-y-2 p-2">
          {photos
            .sort((a, b) => a.order - b.order)
            .map((selectedPhoto, index) => (
              <div
                key={selectedPhoto.photo.id}
                className="flex items-center gap-3 p-2 bg-background rounded-lg border"
              >
                {/* Poignée de déplacement */}
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                
                {/* Numéro */}
                <Badge className={`${color} text-white min-w-[24px] justify-center`}>
                  {selectedPhoto.order}
                </Badge>
                
                {/* Thumbnail */}
                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={selectedPhoto.photo.thumbnail_url || selectedPhoto.photo.url}
                    alt={selectedPhoto.photo.title || 'Photo'}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {selectedPhoto.photo.title || 'Photo sans titre'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(selectedPhoto.photo.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Bouton supprimer */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPhotoRemove(selectedPhoto.photo.id, mode)}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
        </div>
      )}
    </ScrollArea>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Photos sélectionnées</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Tabs defaultValue="avant" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="avant" className="flex items-center gap-2">
              <Badge className="bg-blue-500 text-white">
                {selectedPhotos.avant.length}
              </Badge>
              AVANT
            </TabsTrigger>
            <TabsTrigger value="apres" className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white">
                {selectedPhotos.apres.length}
              </Badge>
              APRÈS
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="avant" className="mt-4">
            <PhotoList 
              photos={selectedPhotos.avant} 
              mode="avant" 
              color="bg-blue-500" 
            />
          </TabsContent>
          
          <TabsContent value="apres" className="mt-4">
            <PhotoList 
              photos={selectedPhotos.apres} 
              mode="apres" 
              color="bg-green-500" 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
