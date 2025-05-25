
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw } from "lucide-react";

interface Template {
  id: string;
  name: string;
  type: "facture" | "devis";
  content: string;
  layout: {
    elements: any[];
    styles: any;
  };
  logo?: {
    url: string;
    position: string;
    size: number;
  };
}

interface LivePDFPreviewProps {
  template: Template;
  zoom: number;
}

const LivePDFPreview = ({ template, zoom }: LivePDFPreviewProps) => {
  const [format, setFormat] = useState("A4");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Sample data for preview
  const sampleData = {
    numero_factura: "FACT-2025-001",
    cliente_nombre: "Jean Dupont",
    cliente_nif: "12345678A",
    cliente_direccion: "123 Rue Example, 28001 Madrid",
    cliente_telefono: "+34 123 456 789",
    cliente_email: "jean.dupont@email.com",
    fecha_hoy: new Date().toLocaleDateString('es-ES'),
    zona_climatica: "D3",
    superficie: "85",
    cae_kwh: "21677.01",
    precio_rachat: "0.100",
    producto_nombre: "SOUFL'R 47",
    precio_material: "7.00",
    precio_mo: "15.42",
    total_material: "595.00",
    total_mo: "1310.70",
    total_ht: "1905.70",
    total_ttc: "2167.70"
  };

  const generatePreview = () => {
    setIsGenerating(true);
    // Simulate PDF generation
    setTimeout(() => {
      // Create a simple HTML preview for demonstration
      const htmlContent = generateHTMLPreview();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setIsGenerating(false);
    }, 1000);
  };

  const generateHTMLPreview = () => {
    let html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .logo { max-width: 150px; margin-bottom: 20px; }
            .header { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            .table th { background-color: #f0f0f0; }
            .totals { text-align: right; margin-top: 20px; }
          </style>
        </head>
        <body>
    `;

    // Add logo if exists
    if (template.logo) {
      html += `<img src="${template.logo.url}" class="logo" />`;
    }

    // Process template elements
    if (template.layout?.elements) {
      template.layout.elements.forEach(element => {
        let content = element.content;
        
        // Replace variables with sample data
        Object.entries(sampleData).forEach(([key, value]) => {
          content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });

        if (element.type === 'table') {
          html += `
            <table class="table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>PU HT</th>
                  <th>Total HT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${sampleData.producto_nombre}</td>
                  <td>${sampleData.superficie} m²</td>
                  <td>${sampleData.precio_material} €</td>
                  <td>${sampleData.total_material} €</td>
                </tr>
                <tr>
                  <td>MANO DE OBRA</td>
                  <td>${sampleData.superficie} m²</td>
                  <td>${sampleData.precio_mo} €</td>
                  <td>${sampleData.total_mo} €</td>
                </tr>
              </tbody>
            </table>
          `;
        } else {
          html += `<div style="margin: 10px 0; font-size: ${element.style.fontSize}px; color: ${element.style.color};">${content}</div>`;
        }
      });
    }

    // Add totals section
    html += `
      <div class="totals">
        <div>Base imponible: ${sampleData.total_ht}€</div>
        <div>IVA (21%): 400.20€</div>
        <div><strong>TOTAL: ${sampleData.total_ttc}€</strong></div>
      </div>
    `;

    html += `
        </body>
      </html>
    `;

    return html;
  };

  useEffect(() => {
    generatePreview();
  }, [template]);

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    console.log("Downloading PDF...");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Toolbar */}
      <Card className="m-4 mb-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">📄 Prévisualisation PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A4">A4</SelectItem>
                <SelectItem value="Letter">Letter</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generatePreview}
              disabled={isGenerating}
            >
              <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadPDF}
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Content */}
      <div className="flex-1 m-4 mt-0 bg-gray-100 rounded-lg overflow-auto">
        {isGenerating ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <div>Génération de la prévisualisation...</div>
            </div>
          </div>
        ) : previewUrl ? (
          <iframe
            src={previewUrl}
            className="w-full h-full border-0 rounded-lg"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-2xl mb-2">📄</div>
              <div>Prévisualisation en cours...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePDFPreview;
