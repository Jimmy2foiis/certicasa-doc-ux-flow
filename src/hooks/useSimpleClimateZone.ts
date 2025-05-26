
import { useState, useCallback } from 'react';

interface ClimateZoneData {
  zone: string;
  confidence?: number;
  method?: string;
  referenceCity?: string;
  distance?: number;
  description?: string;
}

interface UseSimpleClimateZoneProps {
  initialZone?: string;
  onZoneChange?: (zone: string) => void;
}

export const useSimpleClimateZone = ({
  initialZone = "C3",
  onZoneChange
}: UseSimpleClimateZoneProps = {}) => {
  const [climateZone, setClimateZone] = useState<string>(initialZone);
  const [climateData, setClimateData] = useState<Omit<ClimateZoneData, 'zone'>>({});

  const updateClimateZone = useCallback((zoneData: ClimateZoneData) => {
    console.log('🌍 Zone mise à jour avec données:', zoneData);
    setClimateZone(zoneData.zone);
    setClimateData({
      confidence: zoneData.confidence,
      method: zoneData.method,
      referenceCity: zoneData.referenceCity,
      distance: zoneData.distance,
      description: zoneData.description
    });
    
    if (onZoneChange) {
      onZoneChange(zoneData.zone);
    }
  }, [onZoneChange]);

  const setZoneOnly = useCallback((zone: string) => {
    console.log('🌍 Zone changée manuellement:', zone);
    setClimateZone(zone);
    setClimateData({});
    
    if (onZoneChange) {
      onZoneChange(zone);
    }
  }, [onZoneChange]);

  return {
    climateZone,
    climateData,
    updateClimateZone,
    setZoneOnly
  };
};
