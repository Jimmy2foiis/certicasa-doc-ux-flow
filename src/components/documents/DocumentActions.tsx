
import { Download, Mail, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentActionsProps {
  onDownload: () => void;
  onView?: () => void;
  documentId?: string;
  clientId?: string;
  showViewButton?: boolean;
}

const DocumentActions = ({ 
  onDownload, 
  onView, 
  documentId, 
  clientId, 
  showViewButton = false 
}: DocumentActionsProps) => {
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Fonction pour envoyer un document par email
  const handleSendEmail = async () => {
    if (!documentId || !clientId) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer ce document par email. Informations manquantes.",
        variant: "destructive",
      });
      return;
    }

    setIsEmailSending(true);
    try {
      // Récupérer l'email du client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email')
        .eq('id', clientId)
        .single();
      
      if (clientError || !clientData.email) {
        throw new Error("Impossible de récupérer l'email du client");
      }

      // Récupérer les informations du document
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('name, file_path')
        .eq('id', documentId)
        .single();
      
      if (docError) {
        throw new Error("Impossible de récupérer les informations du document");
      }

      // Simuler l'envoi d'email (dans une application réelle, utilisez une Edge Function)
      console.log(`Envoi du document "${docData.name}" à ${clientData.email}`);
      
      // Mettre à jour le statut du document comme "envoyé"
      const { error: updateError } = await supabase
        .from('documents')
        .update({ status: 'sent' })
        .eq('id', documentId);
        
      if (updateError) {
        console.error("Erreur lors de la mise à jour du statut:", updateError);
      }

      toast({
        title: "Email envoyé",
        description: `Le document a été envoyé à ${clientData.email}`,
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsEmailSending(false);
    }
  };

  // Fonction pour enregistrer le document dans le dossier du client
  const handleSaveToFolder = async () => {
    if (!documentId || !clientId) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer ce document. Informations manquantes.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Mettre à jour le document pour indiquer qu'il est enregistré dans le dossier
      const { error } = await supabase
        .from('documents')
        .update({ 
          status: 'saved_to_folder',
        })
        .eq('id', documentId);
        
      if (error) {
        throw new Error("Impossible de mettre à jour le statut du document");
      }

      toast({
        title: "Document enregistré",
        description: "Le document a été enregistré dans le dossier du client.",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le document. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {showViewButton && (
        <Button variant="outline" className="flex-1 sm:flex-none" onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          Voir
        </Button>
      )}
      <Button variant="outline" className="flex-1 sm:flex-none" onClick={onDownload}>
        <Download className="mr-2 h-4 w-4" />
        Télécharger
      </Button>
      <Button 
        variant="outline" 
        className="flex-1 sm:flex-none" 
        onClick={handleSendEmail}
        disabled={isEmailSending}
      >
        <Mail className="mr-2 h-4 w-4" />
        {isEmailSending ? "Envoi..." : "Envoyer par email"}
      </Button>
      <Button 
        variant="outline" 
        className="flex-1 sm:flex-none"
        onClick={handleSaveToFolder}
        disabled={isSaving}
      >
        <Save className="mr-2 h-4 w-4" />
        {isSaving ? "Enregistrement..." : "Enregistrer dans le dossier"}
      </Button>
    </>
  );
};

export default DocumentActions;
