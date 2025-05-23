import { useState } from 'react';
import { ArrowLeft, Edit, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClientForm from './ClientForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import ClientDocumentGenerator from '@/features/documents/ClientDocumentGenerator';

interface ClientDetailsHeaderProps {
  onBack: () => void;
  clientId: string;
  clientName: string;
  client: any; // The full client object
  onDocumentGenerated?: (documentId: string) => void;
  onClientUpdated?: () => void;
}

const ClientDetailsHeader = ({
  onBack,
  clientId,
  clientName,
  client,
  onDocumentGenerated,
  onClientUpdated,
}: ClientDetailsHeaderProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  // Function to handle client updates
  const handleClientUpdated = () => {
    setShowEditDialog(false);

    if (onClientUpdated) {
      onClientUpdated();
    }

    toast({
      title: 'Client modifié',
      description: 'Les informations du client ont été mises à jour.',
      duration: 3000,
    });
  };

  // Function to handle document generation
  const handleDocumentGenerated = (documentId: string) => {
    if (onDocumentGenerated) {
      onDocumentGenerated(documentId);
    }

    toast({
      title: 'Document généré',
      description: `Document créé pour ${clientName}`,
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{clientName}</h1>
          <div className="flex items-center gap-2">
            <Badge variant={client?.status === 'Actif' ? 'default' : 'secondary'}>
              {client?.status || 'Actif'}
            </Badge>
            <span className="text-sm text-gray-500">{client?.type || 'Client particulier'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto">
        <ClientDocumentGenerator
          clientId={clientId}
          clientName={clientName}
          clientData={{
            client: client,
            // Other data will be fetched in the component
          }}
          onDocumentGenerated={handleDocumentGenerated}
        />

        <Button variant="outline" onClick={() => setShowEditDialog(true)}>
          <Edit className="mr-2 h-4 w-4" /> Modifier
        </Button>
      </div>

      {/* Edit Client Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <ClientForm
            {...({ clientId, onSubmitSuccess: handleClientUpdated, submitButtonText: 'Enregistrer les modifications' } as any)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDetailsHeader;
