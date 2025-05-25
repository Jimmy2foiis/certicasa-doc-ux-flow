import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Client } from "@/services/api/types";
import { ClientHeader } from "./profile/ClientHeader";
import { ContactSection } from "./profile/ContactSection";
import { AddressSection } from "./profile/AddressSection";
import { TeamSection } from "./profile/TeamSection";
import { ClientActions } from "./profile/ClientActions";

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
      <CardContent>
        <ClientHeader client={client} />
        <ContactSection client={client} />
        <AddressSection client={client} />
        <TeamSection client={client} />
        <ClientActions />
      </CardContent>
    </Card>
  );
};

export default ClientProfileCard;
