
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Download, Calculator, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  calculateBilling,
  formatCurrency,
  formatNumber,
  type ThermalCalculationData,
  type BillingCalculationResult,
  isValidClimateZone,
  getAvailableClimateZones
} from "@/utils/billingCalculations";
import { CalculationData } from "@/hooks/useCalculationState";

interface AutomaticBillingGeneratorProps {
  calculationData: CalculationData;
  clientData: {
    name: string;
    nif?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

const AutomaticBillingGenerator = ({ calculationData, clientData }: AutomaticBillingGeneratorProps) => {
  const [billingResult, setBillingResult] = useState<BillingCalculationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Extract data from calculation
  const extractThermalData = (): ThermalCalculationData | null => {
    try {
      // Validate required data
      if (!calculationData.climateZone || !isValidClimateZone(calculationData.climateZone)) {
        throw new Error(`Zone climatique invalide: ${calculationData.climateZone}. Zones valides: ${getAvailableClimateZones().join(', ')}`);
      }

      if (!calculationData.surfaceArea || parseFloat(calculationData.surfaceArea) <= 0) {
        throw new Error('Surface isolée invalide ou manquante');
      }

      if (calculationData.uValueBefore <= 0 || calculationData.uValueAfter <= 0) {
        throw new Error('Valeurs de transmittance invalides');
      }

      const surface = parseFloat(calculationData.surfaceArea);

      return {
        ui: calculationData.uValueBefore, // Ui (transmittance après coefficient b)
        uf: calculationData.uValueAfter,  // Uf (transmittance après coefficient b)
        surface: surface,
        climateZone: calculationData.climateZone,
        clientInfo: {
          fullName: clientData.name || 'Client',
          nif: clientData.nif || '',
          address: clientData.address || '',
          postalCode: '',
          city: '',
          phone: clientData.phone || '',
          email: clientData.email || ''
        }
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'extraction des données');
      return null;
    }
  };

  const handleGenerateBilling = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const thermalData = extractThermalData();
      if (!thermalData) {
        return;
      }

      // Calculate billing
      const result = calculateBilling(thermalData);
      setBillingResult(result);

      toast({
        title: "Facturation générée",
        description: `CAE calculés: ${formatNumber(result.cae)} kWh/an - Valeur: ${formatCurrency(result.caeValue)}`,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du calcul de facturation';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateInvoice = () => {
    toast({
      title: "Génération de facture",
      description: "Fonctionnalité en développement - Facture CERT-XXXXX",
    });
  };

  const handleGenerateCreditNote = () => {
    toast({
      title: "Génération de note de crédit",
      description: "Fonctionnalité en développement - Note de crédit NC-XXXXX",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Génération Automatique de Facturation CEE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="font-medium">{clientData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Zone Climatique</p>
              <p className="font-medium">{calculationData.climateZone || 'Non définie'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Surface Isolée</p>
              <p className="font-medium">{calculationData.surfaceArea} m²</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amélioration</p>
              <p className="font-medium">{formatNumber(calculationData.improvementPercent)}%</p>
            </div>
          </div>

          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleGenerateBilling}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              "Calcul en cours..."
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Calculer les CAE et générer la facturation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Billing Results */}
      {billingResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Résultats du Calcul CAE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* CAE Calculation */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Calcul des Certificats d'Économie d'Énergie (CAE)</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Formule:</span>
                    <p className="font-mono">CAE = 1 × (Ui - Uf) × S × G</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Valeurs:</span>
                    <p className="font-mono">
                      CAE = 1 × ({formatNumber(calculationData.uValueBefore, 3)} - {formatNumber(calculationData.uValueAfter, 3)}) × {calculationData.surfaceArea} × {billingResult.climateCoefficient}
                    </p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <p className="text-lg font-bold text-blue-800">
                    CAE = {formatNumber(billingResult.cae)} kWh/año
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    Valeur monétaire = {formatCurrency(billingResult.caeValue)}
                  </p>
                </div>
              </div>

              {/* Billing Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Décomposition de la Facture</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Matériel ({calculationData.surfaceArea} m² × 7€)</span>
                    <span className="font-medium">{formatCurrency(billingResult.materialCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Main d'œuvre</span>
                    <span className="font-medium">{formatCurrency(billingResult.laborCost)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Sous-total HT</span>
                    <span className="font-medium">{formatCurrency(billingResult.subtotalHT)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA (10%)</span>
                    <span className="font-medium">{formatCurrency(billingResult.vat)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>Total TTC</span>
                    <span>{formatCurrency(billingResult.totalTTC)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleGenerateInvoice}
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Générer Facture (CERT-XXXXX)
                </Button>
                <Button 
                  onClick={handleGenerateCreditNote}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Générer Note de Crédit (NC-XXXXX)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutomaticBillingGenerator;
