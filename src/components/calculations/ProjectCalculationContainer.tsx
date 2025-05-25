import { Card } from "@/components/ui/card";
import { useCadastralData } from "@/hooks/useCadastralData";
import CalculationHeader from "./CalculationHeader";
import CalculationContent from "./CalculationContent";
import SaveDebugPanel from "./SaveDebugPanel";
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
    setClimateZone,
    isRestoringData
  } = useCalculationState({
    savedData: {
      ...savedData,
      clientId: clientId, // Passer le clientId pour la persistance
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
      {/* Indicateur de restauration des données */}
      {isRestoringData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-700 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Restauration des calculs sauvegardés...</span>
          </div>
        </div>
      )}

      {/* Panel de debug pour la sauvegarde */}
      <SaveDebugPanel 
        clientId={clientId || 'default'}
        onSave={handleSave}
        calculationData={calculationData}
      />
      
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
