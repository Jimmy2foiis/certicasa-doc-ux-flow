
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientInfoProps {
  clientId: string;
}

const ClientInfoSection = ({ clientId }: ClientInfoProps) => {
  // In a real implementation, you would fetch these details from an API
  // This is mock data for demonstration purposes
  const clientInfo = {
    name: "Martin Dupont",
    address: "27 Rue des Lilas, 75001 Paris",
    phone: "06 12 34 56 78",
    email: "martin.dupont@example.com",
    cadastralRef: "PG15-AL47-02",
    utm30: "UTM30 X:456123 Y:4378912",
    visitDate: "15/05/2025",
    clientCode: "CLI-2025-003784",
    initialIsolation: "Isolation toiture"
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Informations Client</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Nom</p>
            <p>{clientInfo.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Adresse</p>
            <p>{clientInfo.address}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Téléphone</p>
            <p>{clientInfo.phone}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p>{clientInfo.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Référence Cadastrale</p>
            <p>{clientInfo.cadastralRef}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Coordonnées UTM-30</p>
            <p>{clientInfo.utm30}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Date visite prévue</p>
            <p>{clientInfo.visitDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Code client</p>
            <p>{clientInfo.clientCode}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Type d'isolation initial</p>
            <p>{clientInfo.initialIsolation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfoSection;
