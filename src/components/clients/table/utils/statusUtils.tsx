
import { Circle, CheckCircle } from 'lucide-react';
import React from 'react';

// Function to determine the variant of the badge according to the status
export const getStatusVariant = (status?: string) => {
  switch (status) {
    case 'En cours': return 'outline';
    case 'Prêt à déposer': return 'secondary';
    case 'Déposé': return 'default';
    case 'Validé': return 'success';
    case 'Rejeté': return 'destructive';
    case 'Blocage': return 'destructive';
    default: return 'outline';
  }
};

// Function to determine the variant of the badge according to the deposit status
export const getDepositVariant = (status?: string) => {
  switch (status) {
    case 'Non déposé': return 'outline';
    case 'Déposé': return 'default';
    case 'Accepté': return 'success';
    case 'Rejeté': return 'destructive';
    default: return 'outline';
  }
};

// Function to determine the variant of the badge according to the type of fiche
export const getFicheTypeVariant = (type?: string) => {
  return type === 'RES010' ? 'secondary' : 'outline';
};

// Function to determine the type of icon according to the type of isolation
export const getIsolationTypeIcon = (type?: string) => {
  return type === 'Combles' ? '🧱' : '🏠';
};

// Function to determine the type of icon according to the type of floor
export const getFloorTypeIcon = (type?: string) => {
  return type === 'Bois' ? '🪵' : '🧱';
};

// Function to display the status of the file with a colored dot
export const getStatusDot = (status?: string) => {
  switch (status) {
    case 'En cours': 
      return <Circle className="h-2 w-2 text-blue-400 fill-blue-400 mr-1.5" />;
    case 'Prêt à déposer': 
      return <Circle className="h-2 w-2 text-amber-400 fill-amber-400 mr-1.5" />;
    case 'Déposé': 
      return <Circle className="h-2 w-2 text-indigo-400 fill-indigo-400 mr-1.5" />;
    case 'Validé': 
      return <CheckCircle className="h-2 w-2 text-green-500 fill-green-500 mr-1.5" />;
    case 'Rejeté': 
    case 'Blocage': 
      return <Circle className="h-2 w-2 text-red-400 fill-red-400 mr-1.5" />;
    default: 
      return <Circle className="h-2 w-2 text-gray-300 fill-gray-300 mr-1.5" />;
  }
};

// Format date to DD/MM/YYYY
export const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};
