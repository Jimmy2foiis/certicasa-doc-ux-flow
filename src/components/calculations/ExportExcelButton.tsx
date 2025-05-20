
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download } from "lucide-react";
import { exportToExcel } from "@/utils/excelExport";
import { useToast } from "@/hooks/use-toast";
import { CalculationData } from "@/hooks/useCalculationState";

interface ExportExcelButtonProps {
  calculationData: CalculationData | any;
  clientName?: string;
  clientAddress?: string;
  projectName?: string;
}

const ExportExcelButton = ({ 
  calculationData, 
  clientName, 
  clientAddress,
  projectName 
}: ExportExcelButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Préparer les données pour l'export
      const exportData = {
        ...calculationData,
        clientName,
        clientAddress,
        projectName,
        date: new Date().toLocaleDateString('fr-FR')
      };
      
      // Exporter vers Excel
      const fileName = exportToExcel(exportData);
      
      // Notification de succès
      toast({
        title: "Export réussi",
        description: `Le fichier ${fileName} a été téléchargé avec succès.`,
        duration: 5000
      });
    } catch (error) {
      console.error("Erreur lors de l'export Excel:", error);
      
      // Notification d'erreur
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export Excel. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      className="bg-green-600 hover:bg-green-700"
    >
      {isExporting ? (
        <>
          <FileSpreadsheet className="h-4 w-4 mr-2 animate-pulse" />
          Export en cours...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Exporter Excel
        </>
      )}
    </Button>
  );
};

export default ExportExcelButton;
