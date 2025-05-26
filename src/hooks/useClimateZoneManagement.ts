
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

  // 🚨 DEBUG HOOK ENTRÉE
  console.error('🚨 useClimateZoneManagement - initialZone ENTRÉE:', initialZone);
  console.error('🚨 useClimateZoneManagement - initialZone type:', typeof initialZone);
  console.error('🚨 useClimateZoneManagement - initialZone length:', initialZone?.length);

  const [climateZone, setClimateZone] = useState<string>(initialZone);
  const [climateData, setClimateData] = useState<Omit<ClimateZoneData, 'zone'>>({});

  // 🚨 DEBUG HOOK STATE
  console.error('🚨 useClimateZoneManagement - climateZone STATE:', climateZone);
  console.error('🚨 useClimateZoneManagement - climateZone STATE type:', typeof climateZone);
  console.error('🚨 useClimateZoneManagement - climateZone STATE length:', climateZone?.length);

  // Synchroniser avec la zone initiale quand elle change
  useEffect(() => {
    console.error('🚨 useClimateZoneManagement - useEffect initialZone:', initialZone);
    console.error('🚨 useClimateZoneManagement - useEffect climateZone actuel:', climateZone);
    
    if (initialZone && initialZone !== climateZone) {
      console.log('🌍 Synchronisation zone climatique:', initialZone);
      setClimateZone(initialZone);
    }
  }, [initialZone, climateZone]);

  // Mettre à jour la zone climatique avec données automatiques
  const updateClimateZone = useCallback((zoneData: ClimateZoneData) => {
    console.log('🌍 Mise à jour zone climatique complète:', zoneData);
    console.error('🚨 updateClimateZone - zoneData.zone:', zoneData.zone);
    console.error('🚨 updateClimateZone - zoneData.zone type:', typeof zoneData.zone);
    console.error('🚨 updateClimateZone - zoneData.zone length:', zoneData.zone?.length);
    
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
      console.error('🚨 updateClimateZone - Propagation vers parent:', zoneData.zone);
      onZoneChange(zoneData.zone);
    }
  }, [onZoneChange]);

  // Mettre à jour seulement la zone (changement manuel)
  const updateZoneOnly = useCallback((zone: string) => {
    console.log('🌍 Changement manuel zone climatique:', zone);
    console.error('🚨 updateZoneOnly - zone:', zone);
    console.error('🚨 updateZoneOnly - zone type:', typeof zone);
    console.error('🚨 updateZoneOnly - zone length:', zone?.length);
    
    setClimateZone(zone);
    
    // Réinitialiser les données automatiques
    setClimateData({});
    
    // Propager vers le parent
    if (onZoneChange) {
      console.error('🚨 updateZoneOnly - Propagation vers parent:', zone);
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
