
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface DocumentNotificationProps {
  status: 'generating' | 'success' | 'error';
  message?: string;
  duration?: number;
}

export const DocumentNotification = ({ 
  status, 
  message,
  duration = 3000 
}: DocumentNotificationProps) => {
  useEffect(() => {
    let title = '';
    let description = message || '';
    let variant: 'default' | 'destructive' = 'default';
    
    switch(status) {
      case 'generating':
        title = 'Génération en cours';
        description = message || 'Le document est en cours de génération...';
        break;
      case 'success':
        title = 'Document généré';
        description = message || 'Le document a été généré avec succès.';
        break;
      case 'error':
        title = 'Erreur';
        description = message || 'Une erreur est survenue lors de la génération du document.';
        variant = 'destructive';
        break;
    }
    
    toast({
      title,
      description,
      variant,
      duration
    });
  }, [status, message, duration]);
  
  return null;
};
