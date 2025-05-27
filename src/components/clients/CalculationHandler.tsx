
import React, { useState } from "react";
import CalculationHeader from "@/components/calculations/CalculationHeader";
import CalculationContent from "@/components/calculations/CalculationContent";
import CalculationActions from "@/components/calculations/CalculationActions";
import { useProjectCalculationState } from "@/hooks/useProjectCalculationState";

interface CalculationHandlerProps {
  client: any;
  clientId: string;
  currentProjectId: string | null;
  savedCalculations: any[];
  onBack: () => void;
}

const CalculationHandler = ({ client, clientId, currentProjectId, savedCalculations, onBack }: CalculationHandlerProps) => {
  // Utiliser le hook approprié qui fonctionne
  const {
    calculationData,
    handleAddLayer,
    handleUpdateLayer,
    handleDeleteBeforeLayer,
    handleDeleteAfterLayer,
    handleAddSouflr47,
    copyBeforeToAfter,
    setRsiBefore,
    setRseBefore,
    setRsiAfter,
    setRseAfter,
    setVentilationBefore,
    setVentilationAfter,
    setRatioBefore,
    setRatioAfter,
    handleClimateZoneChange
  } = useProjectCalculationState({
    clientId,
    surfaceArea: "70",
    roofArea: "85",
    floorType: "Bois"
  });

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

  return (
    <div className="space-y-6">
      <CalculationHeader
        calculationData={calculationData}
        onSave={handleSave}
        clientName={client.name}
        clientAddress={client.address}
        projectName={`Projet ${new Date().toLocaleDateString()}`}
        clientData={{
          name: client.name || '',
          nif: client.nif || '',
          address: client.address || '',
          phone: client.phone || '',
          email: client.email || ''
        }}
      />
      
      <CalculationContent
        calculationData={calculationData}
        onAddLayer={handleAddLayer}
        onUpdateLayer={handleUpdateLayer}
        onDeleteBeforeLayer={handleDeleteBeforeLayer}
        onDeleteAfterLayer={handleDeleteAfterLayer}
        onAddSouflr47={handleAddSouflr47}
        onCopyBeforeToAfter={copyBeforeToAfter}
        setRsiBefore={setRsiBefore || (() => {})}
        setRseBefore={setRseBefore || (() => {})}
        setRsiAfter={setRsiAfter || (() => {})}
        setRseAfter={setRseAfter || (() => {})}
        setVentilationBefore={setVentilationBefore || (() => {})}
        setVentilationAfter={setVentilationAfter || (() => {})}
        setRatioBefore={setRatioBefore || (() => {})}
        setRatioAfter={setRatioAfter || (() => {})}
        onClimateZoneChange={handleClimateZoneChange}
        clientInfo={clientInfo}
      />

      <CalculationActions
        calculationData={calculationData}
        onSave={handleSave}
        clientName={client.name}
        clientAddress={client.address}
        projectName={`Projet ${new Date().toLocaleDateString()}`}
      />
    </div>
  );
};

export default CalculationHandler;
