import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useCadastralData } from "@/hooks/useCadastralData";
import ProjectInfo from "./ProjectInfo";
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
  clientData
}: ProjectCalculationProps) => {
  // Get climate zone from cadastral data (for demo purposes)
  const { climateZone: fetchedClimateZone } = useCadastralData(clientId ? `Client ID ${clientId}` : "123 Demo Street");
  const effectiveClimateZone = clientClimateZone || fetchedClimateZone || "C3";
  
  const {
    beforeLayers,
    setBeforeLayers,
    afterLayers,
    setAfterLayers,
    projectType,
    setProjectType,
    surfaceArea,
    setSurfaceArea,
    roofArea,
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
    calculationData
  } = useCalculationState({
    savedData,
    clientClimateZone: effectiveClimateZone
  });

  const handleDeleteBeforeLayer = (id: string) => {
    setBeforeLayers(beforeLayers.filter(l => l.id !== id));
  };

  const handleDeleteAfterLayer = (id: string) => {
    setAfterLayers(afterLayers.filter(l => l.id !== id));
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
        {/* Project Information */}
        <ProjectInfo 
          projectType={projectType}
          setProjectType={setProjectType}
          surfaceArea={surfaceArea}
          setSurfaceArea={setSurfaceArea}
          roofArea={roofArea}
          setRoofArea={setRoofArea}
          improvementPercent={improvementPercent}
          meetsRequirements={meetsRequirements}
          onSave={handleSave}
        />

        {/* Thermal Calculations */}
        <Card className="lg:col-span-9">
          <CalculationHeader 
            calculationData={calculationData} 
            onSave={onSave}
            clientName={clientName}
            clientAddress={clientAddress}
            projectName={projectName}
            clientData={preparedClientData}
          />
          <CalculationContent 
            calculationData={calculationData}
            onAddLayer={addLayer}
            onUpdateLayer={updateLayer}
            onDeleteBeforeLayer={handleDeleteBeforeLayer}
            onDeleteAfterLayer={handleDeleteAfterLayer}
            onAddSouflr47={addSouflr47}
            onCopyBeforeToAfter={copyBeforeToAfter}
            setRsiBefore={setRsiBefore}
            setRseBefore={setRseBefore}
            setRsiAfter={setRsiAfter}
            setRseAfter={setRseAfter}
            setVentilationBefore={setVentilationBefore}
            setVentilationAfter={setVentilationAfter}
            setRatioBefore={setRatioBefore}
            setRatioAfter={setRatioAfter}
          />
        </Card>
      </div>
    </div>
  );
};

export default ProjectCalculation;
