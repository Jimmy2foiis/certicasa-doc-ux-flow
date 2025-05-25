
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calculator, FileText, Save, Download } from "lucide-react";
import { CalculationData } from "@/hooks/useCalculationState";
import AutomaticBillingGenerator from "@/components/billing/AutomaticBillingGenerator";
import { useToast } from "@/hooks/use-toast";
import { useCalculationEventEmitter } from "@/hooks/useCalculationEvents";

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
  const { toast } = useToast();
  const { emitCalculationSaved } = useCalculationEventEmitter();

  const handleSave = () => {
    try {
      const dataToSave = {
        ...calculationData,
        projectName: projectName || `Projet ${new Date().toLocaleDateString()}`,
        clientName,
        clientAddress,
        savedAt: new Date().toISOString()
      };

      console.log('💾 Sauvegarde du calcul:', dataToSave);

      if (onSave) {
        onSave(dataToSave);
      }

      // Émettre l'événement de sauvegarde pour notifier les autres composants
      emitCalculationSaved(dataToSave);

      toast({
        title: "Calcul sauvegardé",
        description: `Le calcul thermique a été sauvegardé avec succès. Surface: ${calculationData.surfaceArea}m², Amélioration: ${calculationData.improvementPercent?.toFixed(1)}%`,
      });

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur est survenue lors de la sauvegarde du calcul.",
        variant: "destructive",
      });
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
      <Button onClick={handleSave} variant="outline" size="sm" className="bg-blue-50 hover:bg-blue-100 border-blue-200">
        <Save className="h-4 w-4 mr-1" />
        Sauvegarder
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
