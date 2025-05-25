
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export const PhotosEmptyState = () => {
  return (
    <Card>
      <CardContent className="text-center p-8">
        <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Sélectionner une inspection</h3>
        <p className="text-muted-foreground">
          Choisissez une inspection SafetyCulture pour commencer la sélection des photos
        </p>
      </CardContent>
    </Card>
  );
};
