
import { useState, useEffect } from "react";

interface UseClimateZoneStateProps {
  clientClimateZone?: string;
}

export const useClimateZoneState = ({ clientClimateZone }: UseClimateZoneStateProps) => {
  const [climateZone, setClimateZone] = useState(clientClimateZone || "C3");

  // Update climate zone when clientClimateZone changes
  useEffect(() => {
    if (clientClimateZone) {
      setClimateZone(clientClimateZone);
    }
  }, [clientClimateZone]);

  return {
    climateZone,
    setClimateZone,
  };
};
