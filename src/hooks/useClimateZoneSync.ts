
import { useState, useCallback } from 'react';

interface ClimateZoneData {
  zone: string;
  confidence?: number;
  method?: string;
  referenceCity?: string;
  distance?: number;
  description?: string;
}

export const useClimateZoneSync = (initialZone?: string) => {
  const [climateZone, setClimateZone] = useState(initialZone || '');
  const [climateData, setClimateData] = useState<Omit<ClimateZoneData, 'zone'>>({});

  const updateClimateZone = useCallback((zoneData: ClimateZoneData) => {
    console.log('🌍 Mise à jour zone climatique globale:', zoneData);
    setClimateZone(zoneData.zone);
    setClimateData({
      confidence: zoneData.confidence,
      method: zoneData.method,
      referenceCity: zoneData.referenceCity,
      distance: zoneData.distance,
      description: zoneData.description
    });
  }, []);

  const updateZoneOnly = useCallback((zone: string) => {
    console.log('🌍 Mise à jour zone climatique seulement:', zone);
    setClimateZone(zone);
    // Réinitialiser les données automatiques quand on change manuellement
    setClimateData({});
  }, []);

  return {
    climateZone,
    climateData,
    updateClimateZone,
    updateZoneOnly
  };
};
