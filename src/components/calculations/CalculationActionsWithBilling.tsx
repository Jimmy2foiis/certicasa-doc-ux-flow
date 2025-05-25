
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

      // LOG complet de ce qui va être sauvegardé AVANT la création
      console.log('💾 CalculationActionsWithBilling - ÉTAT ACTUEL DES COUCHES AVANT SAUVEGARDE:');
      console.log('📋 beforeLayers (état actuel):', 
        calculationData.beforeLayers?.map(l => ({ 
          id: l.id, 
          name: l.name, 
          thickness: l.thickness, 
          lambda: l.lambda, 
          r: l.r 
        })) || []
      );
      console.log('📋 afterLayers (état actuel):', 
        calculationData.afterLayers?.map(l => ({ 
          id: l.id, 
          name: l.name, 
          thickness: l.thickness, 
          lambda: l.lambda, 
          r: l.r 
        })) || []
      );

      // Créer l'objet de données COMPLET à sauvegarder avec les VRAIES valeurs actuelles
      const completeDataToSave = {
        id: calculationId,
        project_id: projectId,
        client_id: clientId,
        project_name: projectName || `Calcul thermique ${new Date().toLocaleDateString()}`,
        client_name: clientName || 'Client',
        client_address: clientAddress || '',
        type: calculationData.projectType || 'RES010',
        surface_area: parseFloat(calculationData.surfaceArea) || 0,
        roof_area: parseFloat(calculationData.roofArea) || 0,
        improvement_percent: calculationData.improvementPercent || 0,
        u_value_before: calculationData.uValueBefore || 0,
        u_value_after: calculationData.uValueAfter || 0,
        climate_zone: calculationData.climateZone || 'C3',
        // TOUTES les données du calcul thermique avec les VRAIES valeurs actuelles
        calculation_data: {
          ...calculationData,
          // S'assurer que les couches avec leurs VRAIES épaisseurs modifiées sont incluses
          beforeLayers: calculationData.beforeLayers?.map(layer => ({
            id: layer.id,
            name: layer.name,
            thickness: layer.thickness, // ÉPAISSEUR RÉELLE MODIFIÉE par l'utilisateur
            lambda: layer.lambda,
            r: layer.r,
            isNew: layer.isNew
          })) || [],
          afterLayers: calculationData.afterLayers?.map(layer => ({
            id: layer.id,
            name: layer.name,
            thickness: layer.thickness, // ÉPAISSEUR RÉELLE MODIFIÉE par l'utilisateur
            lambda: layer.lambda,
            r: layer.r,
            isNew: layer.isNew
          })) || [],
          // S'assurer que tous les paramètres critiques sont inclus
          rsiBefore: calculationData.rsiBefore || '0.10',
          rseBefore: calculationData.rseBefore || '0.10',
          rsiAfter: calculationData.rsiAfter || '0.10',
          rseAfter: calculationData.rseAfter || '0.10',
          ventilationBefore: calculationData.ventilationBefore || 'caso1',
          ventilationAfter: calculationData.ventilationAfter || 'caso1',
          ratioBefore: calculationData.ratioBefore || 0.58,
          ratioAfter: calculationData.ratioAfter || 0.58
        },
        created_at: new Date().toISOString(),
        saved_at: new Date().toISOString()
      };

      console.log('💾 CalculationActionsWithBilling - DONNÉES COMPLÈTES À SAUVEGARDER:');
      console.log('📊 Surface:', completeDataToSave.surface_area, 'm²');
      console.log('📊 Amélioration:', completeDataToSave.improvement_percent, '%');
      console.log('📊 beforeLayers count:', completeDataToSave.calculation_data.beforeLayers.length);
      console.log('📊 afterLayers count:', completeDataToSave.calculation_data.afterLayers.length);
      console.log('📊 beforeLayers épaisseurs:', 
        completeDataToSave.calculation_data.beforeLayers.map(l => `${l.name}: ${l.thickness}mm`)
      );
      console.log('📊 afterLayers épaisseurs:', 
        completeDataToSave.calculation_data.afterLayers.map(l => `${l.name}: ${l.thickness}mm`)
      );

      // Utiliser le service de calculs pour sauvegarder
      const savedCalculation = await createCalculation(completeDataToSave);

      if (savedCalculation) {
        // Callback personnalisé si fourni
        if (onSave) {
          onSave(completeDataToSave);
        }

        // Émettre l'événement de sauvegarde pour notifier les autres composants
        emitCalculationSaved(completeDataToSave);

        // Toast de confirmation avec détails des couches
        const beforeLayersInfo = completeDataToSave.calculation_data.beforeLayers.length;
        const afterLayersInfo = completeDataToSave.calculation_data.afterLayers.length;
        const souflrLayer = completeDataToSave.calculation_data.afterLayers.find(l => 
          l.name.includes('SOUFL') || l.name.includes('Laine')
        );
        
        toast({
          title: "✅ Calcul sauvegardé avec toutes les modifications",
          description: `Surface: ${calculationData.surfaceArea}m² • Amélioration: ${calculationData.improvementPercent?.toFixed(1)}% • Couches: ${beforeLayersInfo}+${afterLayersInfo}${souflrLayer ? ` • ${souflrLayer.name}: ${souflrLayer.thickness}mm` : ''}`,
          duration: 5000,
        });
        
        console.log('✅ CalculationActionsWithBilling - Sauvegarde réussie avec toutes les modifications d\'épaisseur');
      } else {
        throw new Error('Échec de la sauvegarde');
      }

    } catch (error) {
      console.error('❌ CalculationActionsWithBilling - Erreur lors de la sauvegarde:', error);
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
