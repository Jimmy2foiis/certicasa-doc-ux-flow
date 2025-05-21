
import { Download, Mail, Save, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentActionsProps {
  onDownload: () => void;
  onView?: () => void;
  documentId?: string;
  clientId?: string;
  showViewButton?: boolean;
  canDownload?: boolean;
}

const DocumentActions = ({ 
  onDownload, 
  onView, 
  documentId, 
  clientId, 
  showViewButton = false,
  canDownload = false
}: DocumentActionsProps) => {
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fonction pour envoyer un document par email avec validation améliorée
  const handleSendEmail = async () => {
    setError(null);
    
    if (!documentId) {
      setError("Aucun document à envoyer. Veuillez d'abord générer un document.");
      return;
    }
    
    if (!clientId) {
      setError("Aucun client associé à ce document. Impossible d'envoyer par email.");
      return;
    }
    
    if (!canDownload) {
      setError("Le document n'est pas prêt ou n'a pas de contenu valide. Impossible d'envoyer par email.");
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
      
      if (clientError || !clientData) {
        throw new Error("Impossible de récupérer les informations du client");
      }
      
      if (!clientData.email) {
        throw new Error("Ce client n'a pas d'adresse email enregistrée");
      }

      // Récupérer les informations du document
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('name, file_path, content')
        .eq('id', documentId)
        .single();
      
      if (docError || !docData) {
        throw new Error("Impossible de récupérer les informations du document");
      }
      
      if (!docData.content && !docData.file_path) {
        throw new Error("Le document n'a pas de contenu valide à envoyer");
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
      setError(error instanceof Error ? error.message : "Erreur lors de l'envoi de l'email");
      
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsEmailSending(false);
    }
  };

  // Fonction pour enregistrer le document dans le dossier du client avec validation améliorée
  const handleSaveToFolder = async () => {
    setError(null);
    
    if (!documentId) {
      setError("Aucun document à enregistrer. Veuillez d'abord générer un document.");
      return;
    }
    
    if (!clientId) {
      setError("Aucun client associé à ce document. Impossible d'enregistrer dans un dossier client.");
      return;
    }
    
    if (!canDownload) {
      setError("Le document n'est pas prêt ou n'a pas de contenu valide. Impossible de l'enregistrer.");
      return;
    }

    setIsSaving(true);
    try {
      // Vérifier que le document existe et a du contenu
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('content, file_path')
        .eq('id', documentId)
        .single();
      
      if (docError || !docData) {
        throw new Error("Impossible de récupérer le document");
      }
      
      if (!docData.content && !docData.file_path) {
        throw new Error("Le document n'a pas de contenu valide à enregistrer");
      }
      
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
      setError(error instanceof Error ? error.message : "Erreur lors de l'enregistrement du document");
      
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
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
        {showViewButton && (
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            Voir
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 sm:flex-none" 
          onClick={onDownload}
          disabled={!canDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Télécharger
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 sm:flex-none" 
          onClick={handleSendEmail}
          disabled={isEmailSending || !canDownload}
        >
          <Mail className="mr-2 h-4 w-4" />
          {isEmailSending ? "Envoi..." : "Envoyer par email"}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 sm:flex-none"
          onClick={handleSaveToFolder}
          disabled={isSaving || !canDownload}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </>
  );
};

export default DocumentActions;
