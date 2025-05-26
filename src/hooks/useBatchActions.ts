
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useBatchActions = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddToExistingDialog, setShowAddToExistingDialog] = useState(false);
  const { toast } = useToast();

  const handleCreateBatch = (selectedClients: string[]) => {
    if (selectedClients.length === 0) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner au moins un client pour créer un lot",
        variant: "destructive"
      });
      return;
    }
    setShowCreateDialog(true);
  };

  const handleAddToExistingBatch = (selectedClients: string[]) => {
    if (selectedClients.length === 0) {
      toast({
        title: "Sélection requise", 
        description: "Veuillez sélectionner au moins un client pour ajouter à un lot",
        variant: "destructive"
      });
      return;
    }
    setShowAddToExistingDialog(true);
  };

  const handleDownloadZip = (selectedClients: string[]) => {
    if (selectedClients.length === 0) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner au moins un client pour exporter",
        variant: "destructive"
      });
      return;
    }
    
    // Simulation du téléchargement
    console.log("Téléchargement ZIP des clients:", selectedClients);
    toast({
      title: "Exportation en cours",
      description: `Préparation du fichier ZIP pour ${selectedClients.length} client(s)...`,
    });
    
    // Simuler un délai de traitement
    setTimeout(() => {
      toast({
        title: "Exportation terminée",
        description: `Fichier ZIP généré avec succès pour ${selectedClients.length} client(s)`,
      });
    }, 2000);
  };

  return {
    showCreateDialog,
    setShowCreateDialog,
    showAddToExistingDialog, 
    setShowAddToExistingDialog,
    handleCreateBatch,
    handleAddToExistingBatch,
    handleDownloadZip
  };
};
