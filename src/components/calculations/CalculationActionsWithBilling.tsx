
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calculator, FileText, Save, Download } from "lucide-react";
import { CalculationData } from "@/hooks/useCalculationState";
import AutomaticBillingGenerator from "@/components/billing/AutomaticBillingGenerator";
import { useToast } from "@/hooks/use-toast";
import { useCalculationEventEmitter } from "@/hooks/useCalculationEvents";
import { createCalculation } from "@/services/api/calculationService";

interface CalculationActionsWithBillingProps {
  calculationData: CalculationData;
  onSave?: (calculationData: any) => void;
  clientName?: string;
  clientAddress?: string;
  projectName?: string;
  clientData?: {
    name: string;
    nif?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

const CalculationActionsWithBilling = ({ 
  calculationData,
  onSave,
  clientName,
  clientAddress,
  projectName,
  clientData
}: CalculationActionsWithBillingProps) => {
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { emitCalculationSaved } = useCalculationEventEmitter();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Générer un ID unique pour ce calcul
      const calculationId = `calc_${Date.now()}`;
      const clientId = `local_${Date.now()}`;
      const projectId = `project_${Date.now()}`;

      const dataToSave = {
        id: calculationId,
        project_id: projectId,
        client_id: clientId,
        project_name: projectName || `Calcul thermique ${new Date().toLocaleDateString()}`,
        client_name: clientName || 'Client',
        client_address: clientAddress || '',
        type: calculationData.projectType || 'RES010',
        surface_area: parseFloat(calculationData.surfaceArea) || 0,
        improvement_percent: calculationData.improvementPercent || 0,
        u_value_before: calculationData.uValueBefore || 0,
        u_value_after: calculationData.uValueAfter || 0,
        climate_zone: calculationData.climateZone || 'C3',
        calculation_data: calculationData,
        created_at: new Date().toISOString(),
        saved_at: new Date().toISOString()
      };

      console.log('💾 Sauvegarde du calcul:', dataToSave);

      // Utiliser le service de calculs pour sauvegarder
      const savedCalculation = await createCalculation(dataToSave);

      if (savedCalculation) {
        // Callback personnalisé si fourni
        if (onSave) {
          onSave(dataToSave);
        }

        // Émettre l'événement de sauvegarde pour notifier les autres composants
        emitCalculationSaved(dataToSave);

        toast({
          title: "✅ Calcul sauvegardé avec succès",
          description: `Surface: ${calculationData.surfaceArea}m² • Amélioration: ${calculationData.improvementPercent?.toFixed(1)}% • Zone: ${calculationData.climateZone}`,
          duration: 4000,
        });
      } else {
        throw new Error('Échec de la sauvegarde');
      }

    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      toast({
        title: "❌ Erreur de sauvegarde",
        description: "Une erreur est survenue lors de la sauvegarde du calcul. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportExcel = () => {
    console.log("Export Excel functionality to be implemented");
    toast({
      title: "Export Excel",
      description: "Fonctionnalité d'export Excel en cours de développement.",
    });
  };

  const defaultClientData = clientData || {
    name: clientName || 'Client',
    address: clientAddress || '',
    nif: '',
    phone: '',
    email: ''
  };

  return (
    <div className="flex gap-2">
      {/* Save Button */}
      <Button 
        onClick={handleSave} 
        disabled={isSaving}
        variant="outline" 
        size="sm" 
        className="bg-blue-50 hover:bg-blue-100 border-blue-200 disabled:opacity-50"
      >
        <Save className="h-4 w-4 mr-1" />
        {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
      </Button>

      {/* Export Excel Button */}
      <Button onClick={handleExportExcel} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-1" />
        Export Excel
      </Button>

      {/* Billing Generator Dialog */}
      <Dialog open={showBillingDialog} onOpenChange={setShowBillingDialog}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <FileText className="h-4 w-4 mr-1" />
            Générer Facture
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Système de Facturation Automatique CEE
            </DialogTitle>
          </DialogHeader>
          <AutomaticBillingGenerator 
            calculationData={calculationData}
            clientData={defaultClientData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalculationActionsWithBilling;
