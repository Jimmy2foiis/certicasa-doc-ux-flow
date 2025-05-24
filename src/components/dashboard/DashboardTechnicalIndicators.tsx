
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface DashboardTechnicalIndicatorsProps {
  selectedPeriod: string;
  selectedFicheType: string;
  selectedTeam: string;
}

const DashboardTechnicalIndicators: React.FC<DashboardTechnicalIndicatorsProps> = ({
  selectedPeriod,
  selectedFicheType,
  selectedTeam,
}) => {
  // Données mockées pour les indicateurs techniques
  const technicalData = {
    uiMoyenInitial: 2.10,
    uiMoyenFinal: 0.85,
    caeMoyenProjet: 6450,
    gainThermiqueMoyen: 1.25,
    projetsSansPosterior: 4,
    dossiersBloquesAnomalies: 2,
  };

  const IndicatorCard = ({ 
    title, 
    value, 
    unit, 
    status, 
    description 
  }: {
    title: string;
    value: string | number;
    unit?: string;
    status?: "good" | "warning" | "error";
    description?: string;
  }) => {
    const getStatusColor = () => {
      switch (status) {
        case "good": return "bg-green-100 text-green-800";
        case "warning": return "bg-yellow-100 text-yellow-800";
        case "error": return "bg-red-100 text-red-800";
        default: return "bg-gray-100 text-gray-800";
      }
    };

    const getStatusIcon = () => {
      switch (status) {
        case "good": return <CheckCircle className="h-4 w-4" />;
        case "warning": case "error": return <AlertTriangle className="h-4 w-4" />;
        default: return null;
      }
    };

    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
            {status && (
              <div className={`flex items-center px-2 py-1 rounded text-xs ${getStatusColor()}`}>
                {getStatusIcon()}
              </div>
            )}
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{value}</span>
            {unit && <span className="ml-1 text-sm text-muted-foreground">{unit}</span>}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">🧮 Indicateurs techniques CAE</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <IndicatorCard
            title="Ui moyen initial"
            value={technicalData.uiMoyenInitial}
            status="good"
            description="Coefficient avant isolation"
          />
          
          <IndicatorCard
            title="Ui moyen final"
            value={technicalData.uiMoyenFinal}
            status="good"
            description="Coefficient après isolation"
          />
          
          <IndicatorCard
            title="CAE moyen par projet"
            value={technicalData.caeMoyenProjet.toLocaleString()}
            unit="kWh/an"
            status="good"
            description="Économie d'énergie générée"
          />
          
          <IndicatorCard
            title="Gain thermique moyen"
            value={technicalData.gainThermiqueMoyen}
            status="good"
            description="Amélioration Ui (avant - après)"
          />
          
          <IndicatorCard
            title="Projets sans POSTERIOR"
            value={technicalData.projetsSansPosterior}
            unit="dossiers"
            status="warning"
            description="Nécessitent une vérification"
          />
          
          <IndicatorCard
            title="Dossiers bloqués"
            value={technicalData.dossiersBloquesAnomalies}
            unit="anomalies"
            status="error"
            description="Erreurs techniques à résoudre"
          />
        </div>

        {/* Section détails techniques */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium mb-3">Détails techniques par zone climatique</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Zone E1 D3:</span>
              <div className="font-medium">Ui moyen: 0.78</div>
            </div>
            <div>
              <span className="text-muted-foreground">Zone D2:</span>
              <div className="font-medium">Ui moyen: 0.92</div>
            </div>
            <div>
              <span className="text-muted-foreground">Zone D1:</span>
              <div className="font-medium">Ui moyen: 0.88</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardTechnicalIndicators;
