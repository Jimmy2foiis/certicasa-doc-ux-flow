
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface DocumentsStatsProps {
  total: number;
  generated: number;
  missing: number;
  error: number;
}

export const DocumentsStats: React.FC<DocumentsStatsProps> = ({
  total,
  generated,
  missing,
  error,
}) => {
  const percentage = total > 0 ? Math.round((generated / total) * 100) : 0;
  
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">Progression documents</h3>
          <span className="text-sm font-bold text-green-600">{percentage}%</span>
        </div>
        
        {/* Barre de progression */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div 
            className="h-2 bg-green-500 rounded-full" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-green-600 mb-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span>Générés</span>
            </div>
            <span className="font-medium">{generated}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center text-amber-600 mb-1">
              <Clock className="h-3 w-3 mr-1" />
              <span>Manquants</span>
            </div>
            <span className="font-medium">{missing}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center text-red-600 mb-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>Erreurs</span>
            </div>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
