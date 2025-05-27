
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Building2 } from 'lucide-react';
import { useCertificateQueue } from '@/hooks/useCertificateQueue';
import ThermicianSelector from './ThermicianSelector';

const BatchSendSection = () => {
  const { selectedCount, sendCertificates } = useCertificateQueue();
  const [selectedThermician, setSelectedThermician] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!selectedThermician || selectedCount === 0) return;
    
    setIsLoading(true);
    try {
      await sendCertificates(selectedThermician);
      setSelectedThermician("");
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Sélection du thermicien */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Sélectionner un thermicien
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ThermicianSelector
            selectedThermician={selectedThermician}
            onThermicianSelect={setSelectedThermician}
          />
        </CardContent>
      </Card>

      {/* Bouton d'envoi */}
      <div className="flex justify-center">
        <Button
          onClick={handleSend}
          disabled={!selectedThermician || isLoading}
          className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
          size="lg"
        >
          <Send className="h-5 w-5 mr-2" />
          {isLoading 
            ? 'Envoi en cours...' 
            : `Envoyer ${selectedCount} certificat${selectedCount > 1 ? 's' : ''}`
          }
        </Button>
      </div>
    </div>
  );
};

export default BatchSendSection;
