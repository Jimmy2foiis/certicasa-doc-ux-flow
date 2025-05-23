import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mail, Save, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getDocumentById } from '@/services/api/documentService';

interface DocumentActionsProps {
  documentId?: string;
  clientId?: string;
  onDownload?: () => Promise<void>;
  canDownload?: boolean;
}

const DocumentActions = ({
  documentId,
  clientId,
  onDownload,
  canDownload = false,
}: DocumentActionsProps) => {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fonction pour valider si un document a du contenu exploitable
  const validateDocumentContent = async (
    docId: string,
  ): Promise<{ valid: boolean; message?: string }> => {
    try {
      // Récupérer le document via l'API REST
      const document = await getDocumentById(docId);
      if (!document) {
        return {
          valid: false,
          message: 'Document introuvable ou inaccessible',
        };
      }

      if (!document.content || document.content.trim() === '') {
        return {
          valid: false,
          message: "Le document n'a pas de contenu exploitable",
        };
      }

      // Validation spécifique au type
      if (document.type === 'pdf') {
        if (
          !document.content.startsWith('data:application/pdf') &&
          !document.content.startsWith('blob:')
        ) {
          return {
            valid: false,
            message: 'Le contenu du PDF est invalide ou corrompu',
          };
        }
      }

      return { valid: true };
    } catch (error) {
      console.error('Erreur de validation du document:', error);
      return {
        valid: false,
        message: error instanceof Error ? error.message : 'Erreur de validation du document',
      };
    }
  };

  // Fonction pour gérer le téléchargement du document
  const handleDownload = async () => {
    if (!canDownload) {
      toast({
        title: 'Erreur',
        description:
          'Ce document ne peut pas être téléchargé car son contenu est vide ou invalide.',
        variant: 'destructive',
      });
      return;
    }

    if (documentId) {
      // Valider le contenu avant le téléchargement
      const validation = await validateDocumentContent(documentId);
      if (!validation.valid) {
        toast({
          title: 'Erreur',
          description: validation.message || 'Contenu du document invalide',
          variant: 'destructive',
        });
        return;
      }
    }

    if (onDownload) {
      try {
        await onDownload();
      } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        toast({
          title: 'Erreur',
          description: `Échec du téléchargement: ${error instanceof Error ? error.message : String(error)}`,
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Info',
        description: 'Fonction de téléchargement non disponible',
      });
    }
  };

  // Fonction pour envoyer le document par email
  const handleSendEmail = async () => {
    try {
      setError(null);

      if (!documentId || !clientId) {
        throw new Error("Informations manquantes pour l'envoi d'email");
      }

      if (!recipientEmail || !recipientEmail.includes('@')) {
        throw new Error('Adresse email invalide');
      }

      // Valider le contenu avant l'envoi
      const validation = await validateDocumentContent(documentId);
      if (!validation.valid) {
        throw new Error(validation.message || 'Contenu du document invalide');
      }

      setSendingEmail(true);

      // Récupérer l'email du client si aucun email n'est spécifié
      let emailToSend = recipientEmail;

      const { getClientById } = await import('@/services/supabaseService');

      const client = await getClientById(clientId);

      if (!client) {
        throw new Error('Impossible de récupérer les informations du client');
      }

      if (!client.email) {
        throw new Error("Ce client n'a pas d'adresse email enregistrée");
      }

      emailToSend = client.email;

      // Simuler l'envoi d'email (à remplacer par votre logique d'envoi réelle)
      console.log(`Envoi d'email à ${emailToSend} avec le document ${documentId}`);

      // En production, vous appelleriez ici une API ou une fonction Edge pour envoyer l'email
      // Exemple: await supabase.functions.invoke('send-email', { documentId, recipientEmail: emailToSend })

      setTimeout(() => {
        setSendingEmail(false);
        setEmailDialogOpen(false);

        toast({
          title: 'Email envoyé',
          description: `Le document a été envoyé à ${emailToSend}`,
        });
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      setSendingEmail(false);
      setError(error instanceof Error ? error.message : String(error));

      toast({
        title: 'Erreur',
        description: `Impossible d'envoyer l'email: ${error instanceof Error ? error.message : String(error)}`,
        variant: 'destructive',
      });
    }
  };

  // Fonction pour sauvegarder le document dans les documents administratifs
  const handleSaveToAdminDocs = async () => {
    try {
      if (!documentId || !clientId) {
        toast({
          title: 'Erreur',
          description: "Informations manquantes pour l'enregistrement du document",
          variant: 'destructive',
        });
        return;
      }

      // Valider le contenu avant l'enregistrement
      const validation = await validateDocumentContent(documentId);
      if (!validation.valid) {
        toast({
          title: 'Erreur',
          description: validation.message || 'Contenu du document invalide',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Info',
        description: 'Enregistrement du document dans les documents administratifs...',
      });

      // Simuler l'enregistrement (à remplacer par votre logique réelle)
      setTimeout(() => {
        toast({
          title: 'Succès',
          description: 'Le document a été enregistré dans les documents administratifs',
        });
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du document:", error);
      toast({
        title: 'Erreur',
        description: `Échec de l'enregistrement: ${error instanceof Error ? error.message : String(error)}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex flex-wrap gap-2 justify-between">
        <Button
          variant="outline"
          onClick={handleDownload}
          disabled={!canDownload}
          className="flex-1"
        >
          <Download className="mr-2 h-4 w-4" />
          Télécharger
        </Button>

        <Button
          variant="outline"
          onClick={() => setEmailDialogOpen(true)}
          disabled={!canDownload}
          className="flex-1"
        >
          <Mail className="mr-2 h-4 w-4" />
          Envoyer par email
        </Button>

        <Button
          variant="outline"
          onClick={handleSaveToAdminDocs}
          disabled={!canDownload}
          className="flex-1"
        >
          <Save className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
      </div>

      {!canDownload && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Document invalide</AlertTitle>
          <AlertDescription>
            Ce document ne peut pas être manipulé car son contenu est vide ou invalide.
          </AlertDescription>
        </Alert>
      )}

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Envoyer le document par email</DialogTitle>
            <DialogDescription>
              Entrez l'adresse email du destinataire pour envoyer le document.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="destinataire@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleSendEmail} disabled={sendingEmail}>
              {sendingEmail ? 'Envoi en cours...' : 'Envoyer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentActions;
