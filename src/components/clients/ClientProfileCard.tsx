
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
  return null;
};

export default ClientProfileCard;
