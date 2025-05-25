
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { SelectionMode } from '@/hooks/photos/usePhotoSelection';

interface PhotoModeSelectorProps {
  mode: SelectionMode;
  onModeChange: (mode: SelectionMode) => void;
  selectedCounts: {
    avant: number;
    apres: number;
  };
}

export const PhotoModeSelector = ({
  mode,
  onModeChange,
  selectedCounts
}: PhotoModeSelectorProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-2">Mode de sélection</h3>
          <p className="text-sm text-muted-foreground">
            Sélectionnez exactement 4 photos AVANT et 4 photos APRÈS
          </p>
        </div>

        <div className="space-y-4 w-full">
          {/* Bouton AVANT */}
          <Button
            variant={mode === 'avant' ? 'default' : 'outline'}
            size="lg"
            onClick={() => onModeChange('avant')}
            className={`
              w-full h-16 flex flex-col items-center justify-center gap-1
              ${mode === 'avant' 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'hover:bg-blue-50 hover:border-blue-300'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-semibold">ANTES</span>
            </div>
            <Badge 
              variant={mode === 'avant' ? 'secondary' : 'outline'}
              className={`${mode === 'avant' ? 'bg-blue-600 text-white' : ''} ${
                selectedCounts.avant === 4 ? 'bg-green-500 text-white' : ''
              }`}
            >
              {selectedCounts.avant}/4 photos
            </Badge>
          </Button>

          {/* Séparateur */}
          <div className="flex items-center justify-center">
            <div className="w-full h-px bg-border"></div>
            <span className="px-3 text-xs text-muted-foreground bg-background">VS</span>
            <div className="w-full h-px bg-border"></div>
          </div>

          {/* Bouton DESPUÉS */}
          <Button
            variant={mode === 'apres' ? 'default' : 'outline'}
            size="lg"
            onClick={() => onModeChange('apres')}
            className={`
              w-full h-16 flex flex-col items-center justify-center gap-1
              ${mode === 'apres' 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'hover:bg-green-50 hover:border-green-300'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">DESPUÉS</span>
              <ArrowRight className="h-4 w-4" />
            </div>
            <Badge 
              variant={mode === 'apres' ? 'secondary' : 'outline'}
              className={`${mode === 'apres' ? 'bg-green-600 text-white' : ''} ${
                selectedCounts.apres === 4 ? 'bg-green-500 text-white' : ''
              }`}
            >
              {selectedCounts.apres}/4 photos
            </Badge>
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Exactement 4 photos par catégorie
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
