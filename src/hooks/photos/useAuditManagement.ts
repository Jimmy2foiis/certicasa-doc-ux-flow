
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SafetyCultureService } from '@/services/safetyCultureService';
import type { SafetyCultureAudit, SafetyCulturePhoto } from '@/types/safetyCulture';

export const useAuditManagement = (safetyCultureAuditId?: string) => {
  const [audits, setAudits] = useState<SafetyCultureAudit[]>([]);
  const [selectedAuditId, setSelectedAuditId] = useState<string>(safetyCultureAuditId || '');
  const [photos, setPhotos] = useState<SafetyCulturePhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAudits();
  }, []);

  useEffect(() => {
    if (selectedAuditId) {
      loadPhotos(selectedAuditId);
    }
  }, [selectedAuditId]);

  const loadAudits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const auditsList = await SafetyCultureService.getAudits();
      setAudits(auditsList);
      
      if (safetyCultureAuditId && auditsList.some(audit => audit.id === safetyCultureAuditId)) {
        setSelectedAuditId(safetyCultureAuditId);
      }

      if (auditsList.length === 0) {
        setError("Aucune inspection trouvée");
        toast({
          title: "Aucune inspection",
          description: "Aucune inspection SafetyCulture trouvée",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Inspections chargées",
          description: `${auditsList.length} inspection(s) trouvée(s)`,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des inspections:', error);
      setError("Erreur lors du chargement des inspections");
      toast({
        title: "Erreur",
        description: "Impossible de charger les inspections SafetyCulture",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async (auditId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const auditPhotos = await SafetyCultureService.getAuditPhotos(auditId);
      setPhotos(auditPhotos);
      
      if (auditPhotos.length === 0) {
        setError("Aucune photo trouvée dans cette inspection");
        toast({
          title: "Aucune photo",
          description: "Aucune photo trouvée dans l'inspection sélectionnée",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Photos chargées",
          description: `${auditPhotos.length} photo(s) trouvée(s) dans l'inspection`,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
      setError("Erreur lors du chargement des photos");
      toast({
        title: "Erreur",
        description: "Impossible de charger les photos de l'inspection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    audits,
    selectedAuditId,
    setSelectedAuditId,
    photos,
    loading,
    error,
    loadPhotos
  };
};
