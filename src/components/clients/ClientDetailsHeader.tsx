
import { ArrowLeft, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import GenerateDocumentButton from "../documents/GenerateDocumentButton";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { updateClientRecord } from "@/services/supabaseService";

interface ClientDetailsHeaderProps {
  onBack: () => void;
  clientId?: string;
  clientName?: string;
  client?: any;
  onDocumentGenerated?: (documentId: string) => void;
  onClientUpdated?: () => void;
}

const ClientDetailsHeader = ({ 
  onBack, 
  clientId, 
  clientName, 
  client, 
  onDocumentGenerated,
  onClientUpdated 
}: ClientDetailsHeaderProps) => {
  const [isSaving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const handleSave = async () => {
    if (!clientId || !client) return;
    
    setSaving(true);
    try {
      await updateClientRecord(clientId, client);
      toast({
        title: "Modifications enregistrées",
        description: "Les informations du client ont été mises à jour avec succès.",
        duration: 3000
      });
      if (onClientUpdated) {
        onClientUpdated();
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des modifications:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des modifications.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateProject = () => {
    // Cette fonction sera implémentée ultérieurement
    toast({
      title: "Création de projet",
      description: "Fonctionnalité en cours d'implémentation...",
      duration: 3000
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-semibold">Fiche Client</h2>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </Button>
        {clientId && (
          <GenerateDocumentButton 
            clientId={clientId} 
            clientName={clientName} 
            onDocumentGenerated={onDocumentGenerated}
          />
        )}
        <Button className="bg-green-600 hover:bg-green-700" onClick={handleCreateProject}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Projet
        </Button>
      </div>
    </div>
  );
};

export default ClientDetailsHeader;
