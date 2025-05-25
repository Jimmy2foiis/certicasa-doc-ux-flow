
import { useCadastralData } from "@/hooks/useCadastralData";
import { useCalculationState } from "@/hooks/useCalculationState";

interface UseProjectCalculationStateProps {
  clientId?: string;
  savedData?: any;
  clientClimateZone?: string;
  surfaceArea?: string;
  roofArea?: string;
  floorType?: string;
}

export const useProjectCalculationState = ({
  clientId,
  savedData,
  clientClimateZone,
  surfaceArea = "70",
  roofArea = "85",
  floorType = "Bois"
}: UseProjectCalculationStateProps) => {
  // Get climate zone from cadastral data (for demo purposes)
  const { climateZone: fetchedClimateZone } = useCadastralData(clientId ? `Client ID ${clientId}` : "123 Demo Street");
  
  const calculationState = useCalculationState({
    savedData: {
      ...savedData,
      surfaceArea: surfaceArea,
      roofArea: roofArea,
      climateZone: clientClimateZone || "C3"
    },
    clientClimateZone: clientClimateZone || "C3",
    floorType: floorType
  });

  return {
    ...calculationState,
    fetchedClimateZone
  };
};
