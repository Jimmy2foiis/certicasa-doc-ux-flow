
import { Card } from "@/components/ui/card";
import CalculationHeader from "./CalculationHeader";
import CalculationContent from "./CalculationContent";
import { CalculationData } from "@/hooks/useCalculationState";

interface ProjectCalculationLayoutProps {
  calculationData: CalculationData;
  climateZone: string;
  floorType?: string;
  clientName?: string;
  clientAddress?: string;
  projectName?: string;
  clientData: {
    name: string;
    nif?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  onSave?: (calculationData: any) => void;
  handlers: {
    handleAddLayer: (type: "before" | "after") => void;
    handleUpdateLayer: (id: string, field: string, updatedLayer: any) => void;
    handleDeleteBeforeLayer: (id: string) => void;
    handleDeleteAfterLayer: (id: string) => void;
    handleAddSouflr47: () => void;
    handleClimateZoneChange: (zone: string) => void;
  };
  thermalSettings: {
    setRsiBefore: (value: string) => void;
    setRseBefore: (value: string) => void;
    setRsiAfter: (value: string) => void;
    setRseAfter: (value: string) => void;
    setVentilationBefore: (value: any) => void;
    setVentilationAfter: (value: any) => void;
    setRatioBefore: (value: number) => void;
    setRatioAfter: (value: number) => void;
    copyBeforeToAfter: () => void;
  };
  climateData?: {
    clientClimateConfidence?: number;
    clientClimateMethod?: string;
    clientClimateReferenceCity?: string;
    clientClimateDistance?: number;
    clientClimateDescription?: string;
  };
}

const ProjectCalculationLayout = ({
  calculationData,
  climateZone,
  floorType = "Bois",
  clientName,
  clientAddress,
  projectName,
  clientData,
  onSave,
  handlers,
  thermalSettings,
  climateData
}: ProjectCalculationLayoutProps) => {
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
            clientData={clientData}
            floorType={floorType}
            climateZone={climateZone}
          />
          <CalculationContent 
            calculationData={{...calculationData, climateZone: climateZone}}
            onAddLayer={handlers.handleAddLayer}
            onUpdateLayer={handlers.handleUpdateLayer}
            onDeleteBeforeLayer={handlers.handleDeleteBeforeLayer}
            onDeleteAfterLayer={handlers.handleDeleteAfterLayer}
            onAddSouflr47={handlers.handleAddSouflr47}
            onCopyBeforeToAfter={thermalSettings.copyBeforeToAfter}
            setRsiBefore={thermalSettings.setRsiBefore}
            setRseBefore={thermalSettings.setRseBefore}
            setRsiAfter={thermalSettings.setRsiAfter}
            setRseAfter={thermalSettings.setRseAfter}
            setVentilationBefore={thermalSettings.setVentilationBefore}
            setVentilationAfter={thermalSettings.setVentilationAfter}
            setRatioBefore={thermalSettings.setRatioBefore}
            setRatioAfter={thermalSettings.setRatioAfter}
            onClimateZoneChange={handlers.handleClimateZoneChange}
            climateConfidence={climateData?.clientClimateConfidence}
            climateMethod={climateData?.clientClimateMethod}
            climateReferenceCity={climateData?.clientClimateReferenceCity}
            climateDistance={climateData?.clientClimateDistance}
            climateDescription={climateData?.clientClimateDescription}
          />
        </Card>
      </div>
    </div>
  );
};

export default ProjectCalculationLayout;
