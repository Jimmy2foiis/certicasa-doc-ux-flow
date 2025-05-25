
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Template {
  id: string;
  name: string;
  type: "facture" | "devis";
  content: string;
  created_at: string;
  updated_at: string;
}

interface TemplatePreviewProps {
  template: Template;
}

const TemplatePreview = ({ template }: TemplatePreviewProps) => {
  // Données exemple pour la prévisualisation
  const sampleData = {
    numero_factura: "FACT-2025-001",
    numero_presupuesto: "PRES-2025-001",
    cliente_nombre: "Jean Dupont",
    cliente_nif: "12345678A",
    cliente_direccion: "123 Rue Example, 28001 Madrid",
    cliente_telefono: "+34 123 456 789",
    cliente_email: "jean.dupont@email.com",
    zona_climatica: "D3",
    superficie: "85",
    cae_kwh: "21677.01",
    precio_rachat: "0.100",
    producto_nombre: "SOUFL'R 47",
    producto_descripcion: "Aislamiento por soplado R=5.51",
    precio_material: "7.00",
    precio_mo: "15.42",
    total_material: "595.00",
    total_mo: "1310.70",
    total_ht: "1905.70",
    tva_taux: "21",
    tva_montant: "400.20",
    total_ttc: "2167.70",
    fecha_hoy: new Date().toLocaleDateString('es-ES'),
    empresa_nombre: "CertiCasa",
    empresa_direccion: "Calle Empresa 123, Madrid",
    empresa_telefono: "+34 900 123 456",
    empresa_email: "info@certicasa.com"
  };

  // Remplacer les variables dans le template
  const renderPreview = (content: string) => {
    let renderedContent = content;
    
    // Remplacer toutes les variables {{variable}} par les données exemple
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      renderedContent = renderedContent.replace(regex, value.toString());
    });
    
    // Remplacer les variables non trouvées par un placeholder
    renderedContent = renderedContent.replace(/\{\{([^}]+)\}\}/g, '[${$1}]');
    
    return renderedContent;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prévisualisation - {template.name}</CardTitle>
        <p className="text-sm text-gray-600">
          Aperçu avec des données d'exemple
        </p>
      </CardHeader>
      <CardContent>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {renderPreview(template.content)}
          </pre>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 rounded-md">
          <h4 className="font-medium text-yellow-800 mb-2">ℹ️ Information :</h4>
          <p className="text-sm text-yellow-700">
            Cette prévisualisation utilise des données d'exemple. 
            Les variables en format [${`variable`}] n'ont pas été trouvées dans les données d'exemple.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplatePreview;
