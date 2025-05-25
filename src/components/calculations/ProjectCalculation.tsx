
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useCadastralData } from "@/hooks/useCadastralData";
import CalculationHeader from "./CalculationHeader";
import CalculationContent from "./CalculationContent";
import { useCalculationState } from "@/hooks/useCalculationState";

interface ProjectCalculationProps {
  clientId?: string;
  projectId?: string | null;
  savedData?: any;
  onSave?: (calculationData: any) => void;
  clientClimateZone?: string;
  clientName?: string;
  clientAddress?: string;
  projectName?: string;
  clientData?: {
    id?: string;
    name: string;
    nif?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  surfaceArea?: string;
  roofArea?: string;
  floorType?: string;
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
  onFloorTypeChange?: (value: string) => void;
  onClimateZoneChange?: (value: string) => void;
}

const ProjectCalculation = ({ 
  clientId, 
  projectId, 
  savedData, 
  onSave,
  clientClimateZone,
  clientName,
  clientAddress,
  projectName,
  clientData,
  surfaceArea = "70",
  roofArea = "85",
  floorType = "Bois",
  onSurfaceAreaChange,
  onRoofAreaChange,
  onFloorTypeChange,
  onClimateZoneChange
}: ProjectCalculationProps) => {
  // Get climate zone from cadastral data (for demo purposes)
  const { climateZone: fetchedClimateZone } = useCadastralData(clientId ? `Client ID ${clientId}` : "123 Demo Street");
  
  const {
    beforeLayers,
    setBeforeLayers,
    afterLayers,
    setAfterLayers,
    projectType,
    setProjectType,
    surfaceArea: calcSurfaceArea,
    setSurfaceArea,
    roofArea: calcRoofArea,
    setRoofArea,
    ventilationBefore,
    setVentilationBefore,
    ventilationAfter,
    setVentilationAfter,
    ratioBefore,
    setRatioBefore,
    ratioAfter,
    setRatioAfter,
    rsiBefore,
    setRsiBefore,
    rseBefore,
    setRseBefore,
    rsiAfter,
    setRsiAfter,
    rseAfter,
    setRseAfter,
    totalRBefore,
    upValueBefore,
    uValueBefore,
    totalRAfter,
    upValueAfter,
    uValueAfter,
    improvementPercent,
    bCoefficientBefore,
    bCoefficientAfter,
    meetsRequirements,
    addLayer,
    addSouflr47,
    copyBeforeToAfter,
    updateLayer,
    calculationData,
    climateZone,
    setClimateZone
  } = useCalculationState({
    savedData: {
      ...savedData,
      surfaceArea: surfaceArea,
      roofArea: roofArea,
      climateZone: clientClimateZone || "C3"
    },
    clientClimateZone: clientClimateZone || "C3",
    floorType: floorType
  });

  const handleDeleteBeforeLayer = (id: string) => {
    setBeforeLayers(beforeLayers.filter(l => l.id !== id));
  };

  const handleDeleteAfterLayer = (id: string) => {
    setAfterLayers(afterLayers.filter(l => l.id !== id));
  };

  // 🔧 FIX: Gestionnaire de changement de zone climatique unifié et correct
  const handleClimateZoneChange = (zone: string) => {
    console.log('🔄 Changement de zone climatique dans le calcul:', zone);
    
    // Mettre à jour immédiatement la zone climatique dans le state de calcul
    setClimateZone(zone);
    
    // Propager le changement vers le parent (ClientTabsContainer)
    if (onClimateZoneChange) {
      onClimateZoneChange(zone);
    }
  };

  const handleAddLayer = (type: "before" | "after") => {
    const defaultMaterial = { 
      id: Date.now().toString(), 
      name: "Sélectionnez un matériau", 
      thickness: 10, 
      lambda: 0.5, 
      r: 0.02 
    };
    addLayer(type, defaultMaterial);
  };

  // 🔧 FIX: Simplifier la mise à jour des couches - utiliser directement updateLayer
  const handleUpdateLayer = (id: string, field: string, updatedLayer: any) => {
    console.log(`🔧 Mise à jour couche ID ${id}:`, updatedLayer);
    
    // Déterminer si c'est une couche "before" ou "after"
    const isBeforeLayer = beforeLayers.some(l => l.id === id);
    const isAfterLayer = afterLayers.some(l => l.id === id);
    
    if (isBeforeLayer) {
      updateLayer("before", updatedLayer);
    } else if (isAfterLayer) {
      updateLayer("after", updatedLayer);
    }
  };

  const handleAddSouflr47 = () => {
    addSouflr47();
  };

  // Prepare client data with fallbacks
  const preparedClientData = {
    name: clientData?.name || clientName || 'Client',
    nif: clientData?.nif || '',
    address: clientData?.address || clientAddress || '',
    phone: clientData?.phone || '',
    email: clientData?.email || ''
  };

  const handleSave = () => {
    if (onSave) {
      onSave(calculationData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Thermal Calculations - Full width */}
        <Card className="lg:col-span-12">
          <CalculationHeader 
            calculationData={{...calculationData, climateZone: climateZone}} 
            onSave={onSave}
            clientName={clientName}
            clientAddress={clientAddress}
            projectName={projectName}
            clientData={preparedClientData}
            floorType={floorType}
            climateZone={climateZone}
          />
          <CalculationContent 
            calculationData={{...calculationData, climateZone: climateZone}}
            onAddLayer={handleAddLayer}
            onUpdateLayer={handleUpdateLayer}
            onDeleteBeforeLayer={handleDeleteBeforeLayer}
            onDeleteAfterLayer={handleDeleteAfterLayer}
            onAddSouflr47={handleAddSouflr47}
            onCopyBeforeToAfter={copyBeforeToAfter}
            setRsiBefore={setRsiBefore}
            setRseBefore={setRseBefore}
            setRsiAfter={setRsiAfter}
            setRseAfter={setRseAfter}
            setVentilationBefore={setVentilationBefore}
            setVentilationAfter={setVentilationAfter}
            setRatioBefore={setRatioBefore}
            setRatioAfter={setRatioAfter}
            onClimateZoneChange={handleClimateZoneChange}
          />
        </Card>
      </div>
    </div>
  );
};

export default ProjectCalculation;
