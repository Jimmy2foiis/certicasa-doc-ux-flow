import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyTemplateStateProps {
  setActiveTab: (tab: string) => void;
}

const EmptyTemplateState = ({ setActiveTab }: EmptyTemplateStateProps) => {
  return (
    <div className="text-center p-8">
      <h2 className="text-lg font-medium mb-2">Aucun modèle disponible</h2>
      <p className="text-gray-500 mb-4">Ajoutez des modèles pour pouvoir générer des documents.</p>
      <Button onClick={() => setActiveTab('templates')}>Ajouter un modèle</Button>
    </div>
  );
};

export default EmptyTemplateState;
