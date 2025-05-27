
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Zap, ExternalLink } from 'lucide-react';
import { useCertificateQueue } from '@/hooks/useCertificateQueue';
import { useNavigate } from 'react-router-dom';

interface AddToQueueButtonProps {
  client: any;
}

const AddToQueueButton = ({ client }: AddToQueueButtonProps) => {
  const navigate = useNavigate();
  const { addToQueue, isInQueue } = useCertificateQueue();
  const [isLoading, setIsLoading] = useState(false);
  
  const inQueue = isInQueue(client.id);

  const handleAddToQueue = async () => {
    if (inQueue) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulation
      addToQueue(client);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewQueue = () => {
    navigate('/certificats-energetiques/envoi');
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleAddToQueue}
        disabled={inQueue || isLoading}
        className={`w-full ${
          inQueue 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-400'
        }`}
        size="lg"
      >
        {inQueue ? (
          <>
            <Check className="h-5 w-5 mr-2" />
            ✓ AJOUTÉ À LA FILE CEE
          </>
        ) : (
          <>
            <Zap className="h-5 w-5 mr-2" />
            {isLoading ? 'AJOUT EN COURS...' : 'ENVOI EN CERTIFICAT ENERGÉTIQUE'}
          </>
        )}
      </Button>
      
      {inQueue && (
        <div className="flex items-center justify-center">
          <Button
            variant="link"
            onClick={handleViewQueue}
            className="text-green-600 hover:text-green-700 p-0 h-auto font-medium"
          >
            Voir la file d'attente
            <ExternalLink className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddToQueueButton;
