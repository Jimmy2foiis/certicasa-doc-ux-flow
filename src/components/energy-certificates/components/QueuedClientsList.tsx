
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Users } from 'lucide-react';
import { useCertificateQueue, QueuedClient } from '@/hooks/useCertificateQueue';

const QueuedClientsList = () => {
  const {
    queuedClients,
    selectedClients,
    toggleClientSelection,
    selectAll,
    deselectAll,
    removeFromQueue,
    selectedCount,
    totalCount
  } = useCertificateQueue();

  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  const handleSelectAll = () => {
    if (isAllSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  };

  if (totalCount === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun client en attente
        </h3>
        <p className="text-gray-600 mb-6">
          Ajoutez des clients à la file d'attente depuis leurs fiches individuelles
        </p>
        <Button 
          onClick={() => window.location.href = '/clients'}
          className="bg-green-600 hover:bg-green-700"
        >
          Aller aux clients
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec sélection */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <Users className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">
            Clients en attente ({totalCount})
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {selectedCount} sélectionné(s)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            {isAllSelected ? 'Désélectionner tout' : 'Sélectionner tout'}
          </Button>
        </div>
      </div>

      {/* Liste des clients */}
      <div className="space-y-4">
        {queuedClients.map((client) => (
          <Card 
            key={client.id} 
            className={`transition-all duration-200 hover:shadow-md ${
              selectedClients.includes(client.id) 
                ? 'ring-2 ring-green-500 bg-green-50' 
                : 'hover:bg-gray-50'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {/* Checkbox */}
                <Checkbox
                  checked={selectedClients.includes(client.id)}
                  onCheckedChange={() => toggleClientSelection(client.id)}
                  className="h-5 w-5"
                />

                {/* Informations client */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Colonne gauche - Identité */}
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      {client.nif && (
                        <p className="text-sm text-gray-600">Réf: {client.nif}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{client.address}</p>
                      <p>{client.email}</p>
                    </div>
                  </div>

                  {/* Colonne droite - Données techniques */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Surface: {client.surface} m²
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        CAE: {client.cae} kWh/an
                      </Badge>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        Prix: {client.price} €
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Ajouté le {new Date(client.addedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeFromQueue(client.id)}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QueuedClientsList;
