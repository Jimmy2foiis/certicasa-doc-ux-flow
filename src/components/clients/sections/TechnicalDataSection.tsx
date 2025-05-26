import React, { useEffect } from "react";
import { Settings } from "lucide-react";
import ClimateZoneDisplay from "@/components/clients/ClimateZoneDisplay";
interface TechnicalDataSectionProps {
  climateZone?: string;
  climateData?: {
    confidence?: number;
    method?: string;
    referenceCity?: string;
    distance?: number;
    description?: string;
  };
  onClimateZoneChange?: (zone: string) => void;
}
const TechnicalDataSection = ({
  climateZone,
  climateData,
  onClimateZoneChange
}: TechnicalDataSectionProps) => {
  const handleZoneChange = (zone: string) => {
    if (onClimateZoneChange) {
      onClimateZoneChange(zone);
    }
  };
  return;
};
export default TechnicalDataSection;