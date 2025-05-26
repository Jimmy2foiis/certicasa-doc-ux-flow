
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, User, MapPin, Phone, Mail } from "lucide-react";
import { useClients } from "@/hooks/useClients";

interface ClientSearchSelectorProps {
  selectedClient: any;
  onClientSelect: (client: any) => void;
}

const ClientSearchSelector = ({ selectedClient, onClientSelect }: ClientSearchSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { data: clients = [] } = useClients();

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  const handleClientSelect = (client: any) => {
    onClientSelect(client);
    setShowResults(false);
    setSearchTerm("");
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un client par nom, email ou téléphone..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(e.target.value.length > 0);
          }}
          className="pl-9"
        />
      </div>

      {showResults && filteredClients.length > 0 && (
        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredClients.slice(0, 5).map((client) => (
            <Card key={client.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleClientSelect(client)}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {client.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </span>
                        )}
                        {client.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedClient && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">{selectedClient.name}</p>
                  <p className="text-sm text-green-600">{selectedClient.email}</p>
                  {selectedClient.address && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedClient.address}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onClientSelect(null)}>
                Changer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientSearchSelector;
