import React, { useState } from "react";
import CalculationHeader from "@/components/calculations/CalculationHeader";
import CalculationContent from "@/components/calculations/CalculationContent";
import CalculationActions from "@/components/calculations/CalculationActions";

interface CalculationHandlerProps {
  client: any;
  clientId: string;
  currentProjectId: string | null;
  savedCalculations: any[];
  onBack: () => void;
}

const CalculationHandler = ({ client, clientId, currentProjectId, savedCalculations, onBack }: CalculationHandlerProps) => {
  const [surfaceArea, setSurfaceArea] = useState("70");
  const [roofArea, setRoofArea] = useState("85");
  const [floorType, setFloorType] = useState("Bois");
  const [climateZone, setClimateZone] = useState("C3");

  const handleSurfaceAreaChange = (value: string) => {
    setSurfaceArea(value);
  };

  const handleRoofAreaChange = (value: string) => {
    setRoofArea(value);
  };

  const handleFloorTypeChange = (value: string) => {
    setFloorType(value);
  };

  const handleClimateZoneChange = (value: string) => {
    setClimateZone(value);
  };

  // Préparer les informations client pour le certificat énergétique
  const clientInfo = {
    id: clientId,
    name: client.name || "Client",
    email: client.email || "",
    address: client.address || ""
  };

  const handleSave = (calculationData: any) => {
    console.log("Saving calculation:", calculationData);
    onBack();
  };

  const handleDelete = (projectId: string) => {
    console.log("Deleting calculation:", projectId);
    onBack();
  };

  return (
    <div className="space-y-6">
      <CalculationHeader
        client={client}
        clientId={clientId}
        onBack={onBack}
      />
      
      <CalculationContent
        surfaceArea={surfaceArea}
        roofArea={roofArea}
        floorType={floorType}
        climateZone={climateZone}
        onSurfaceAreaChange={handleSurfaceAreaChange}
        onRoofAreaChange={handleRoofAreaChange}
        onFloorTypeChange={handleFloorTypeChange}
        onClimateZoneChange={handleClimateZoneChange}
        clientInfo={clientInfo}
      />

      <CalculationActions
        onSave={handleSave}
        onDelete={handleDelete}
        onBack={onBack}
      />
    </div>
  );
};

export default CalculationHandler;
