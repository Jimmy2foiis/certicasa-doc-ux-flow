
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Client } from "@/services/api/types";

interface ClientProfileCardProps {
  client: Client | null;
  surfaceArea?: string;
  roofArea?: string;
  floorType?: string;
  climateZone?: string;
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
  onFloorTypeChange?: (value: string) => void;
  onClimateZoneChange?: (value: string) => void;
}

const ClientProfileCard = ({
  client,
  surfaceArea = "56",
  roofArea = "89",
  floorType = "Bois",
  climateZone = "C3",
  onSurfaceAreaChange,
  onRoofAreaChange,
  onFloorTypeChange,
  onClimateZoneChange
}: ClientProfileCardProps) => {
  if (!client) return null;

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{client.name}</h2>
            <p className="text-sm text-gray-600">Client Profile</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-900">{client.email || 'Non renseigné'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Téléphone</label>
              <p className="text-sm text-gray-900">{client.phone || 'Non renseigné'}</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Adresse</label>
              <p className="text-sm text-gray-900">{client.address || 'Non renseignée'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientProfileCard;
