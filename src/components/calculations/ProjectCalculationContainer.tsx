
import { Card } from "@/components/ui/card";
import { useCadastralData } from "@/hooks/useCadastralData";
import CalculationHeader from "./CalculationHeader";
import CalculationContent from "./CalculationContent";
import { useCalculationState } from "@/hooks/useCalculationState";
import { useProjectCalculationHandlers } from "./hooks/useProjectCalculationHandlers";
import { ProjectCalculationProps } from "./types/ProjectCalculationProps";

const ProjectCalculationContainer = ({ 
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

  const {
    handleDeleteBeforeLayer,
    handleDeleteAfterLayer,
    handleClimateZoneChange,
    handleAddLayer,
    handleUpdateLayer,
    handleAddSouflr47
  } = useProjectCalculationHandlers({
    beforeLayers,
    afterLayers,
    setBeforeLayers,
    setAfterLayers,
    addLayer,
    addSouflr47,
    copyBeforeToAfter,
    updateLayer,
    setClimateZone,
    onClimateZoneChange
  });

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

export default ProjectCalculationContainer;
