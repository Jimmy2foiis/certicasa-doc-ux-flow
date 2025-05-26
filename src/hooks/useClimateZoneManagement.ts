
import { useState, useCallback, useEffect } from 'react';

interface ClimateZoneData {
  zone: string;
  confidence?: number;
  method?: string;
  referenceCity?: string;
  distance?: number;
  description?: string;
}

interface UseClimateZoneManagementProps {
  initialZone?: string;
  onZoneChange?: (zone: string) => void;
}

export const useClimateZoneManagement = ({
  initialZone = "C3",
  onZoneChange
}: UseClimateZoneManagementProps) => {
  const [climateZone, setClimateZone] = useState<string>(initialZone);
  const [climateData, setClimateData] = useState<Omit<ClimateZoneData, 'zone'>>({});

  // Synchroniser avec la zone initiale quand elle change
  useEffect(() => {
    if (initialZone && initialZone !== climateZone) {
      console.log('🌍 Synchronisation zone climatique:', initialZone);
      setClimateZone(initialZone);
    }
  }, [initialZone]);

  // Mettre à jour la zone climatique avec données automatiques
  const updateClimateZone = useCallback((zoneData: ClimateZoneData) => {
    console.log('🌍 Mise à jour zone climatique complète:', zoneData);
    setClimateZone(zoneData.zone);
    setClimateData({
      confidence: zoneData.confidence,
      method: zoneData.method,
      referenceCity: zoneData.referenceCity,
      distance: zoneData.distance,
      description: zoneData.description
    });
    
    // Propager vers le parent
    if (onZoneChange) {
      onZoneChange(zoneData.zone);
    }
  }, [onZoneChange]);

  // Mettre à jour seulement la zone (changement manuel)
  const updateZoneOnly = useCallback((zone: string) => {
    console.log('🌍 Changement manuel zone climatique:', zone);
    setClimateZone(zone);
    
    // Réinitialiser les données automatiques
    setClimateData({});
    
    // Propager vers le parent
    if (onZoneChange) {
      onZoneChange(zone);
    }
  }, [onZoneChange]);

  return {
    climateZone,
    climateData,
    updateClimateZone,
    updateZoneOnly
  };
};
