
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TemplateVariablesProps {
  onInsertVariable: (variable: string) => void;
}

const TemplateVariables = ({ onInsertVariable }: TemplateVariablesProps) => {
  const variableCategories = {
    client: {
      title: "CLIENT",
      icon: "👤",
      variables: [
        { name: "cliente_nombre", description: "Nom du client" },
        { name: "cliente_nif", description: "NIF du client" },
        { name: "cliente_direccion", description: "Adresse du client" },
        { name: "cliente_telefono", description: "Téléphone du client" },
        { name: "cliente_email", description: "Email du client" },
        { name: "cliente_codigo_postal", description: "Code postal" },
        { name: "cliente_ciudad", description: "Ville" }
      ]
    },
    projet: {
      title: "PROJET",
      icon: "🏠",
      variables: [
        { name: "zona_climatica", description: "Zone climatique" },
        { name: "superficie", description: "Surface en m²" },
        { name: "cae_kwh", description: "CAE en kWh/an" },
        { name: "precio_rachat", description: "Prix de rachat (€/kWh)" },
        { name: "tipo_instalacion", description: "Type d'installation" },
        { name: "referencia_cae", description: "Référence CAE" }
      ]
    },
    produit: {
      title: "PRODUIT",
      icon: "📦",
      variables: [
        { name: "producto_nombre", description: "Nom du produit" },
        { name: "producto_descripcion", description: "Description du produit" },
        { name: "producto_referencia", description: "Référence produit" },
        { name: "precio_material", description: "Prix matériel (€/m²)" },
        { name: "resistencia_termica", description: "Résistance thermique" }
      ]
    },
    calculs: {
      title: "CALCULS",
      icon: "🧮",
      variables: [
        { name: "precio_mo", description: "Prix main d'œuvre calculé" },
        { name: "total_material", description: "Total matériel" },
        { name: "total_mo", description: "Total main d'œuvre" },
        { name: "total_ht", description: "Total HT" },
        { name: "tva_taux", description: "Taux TVA (%)" },
        { name: "tva_montant", description: "Montant TVA" },
        { name: "total_ttc", description: "Total TTC" },
        { name: "economia_anual_euros", description: "Économie annuelle en €" }
      ]
    },
    systeme: {
      title: "SYSTÈME",
      icon: "⚙️",
      variables: [
        { name: "numero_factura", description: "Numéro de facture" },
        { name: "numero_presupuesto", description: "Numéro de devis" },
        { name: "fecha_hoy", description: "Date du jour" },
        { name: "fecha_emision", description: "Date d'émission" },
        { name: "empresa_nombre", description: "Nom de l'entreprise" },
        { name: "empresa_direccion", description: "Adresse entreprise" },
        { name: "empresa_telefono", description: "Téléphone entreprise" },
        { name: "empresa_email", description: "Email entreprise" }
      ]
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">📌 Variables disponibles</CardTitle>
        <p className="text-sm text-gray-600">Cliquez pour insérer</p>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="client" orientation="vertical" className="h-[500px]">
          <TabsList className="flex flex-col h-fit w-full space-y-1 p-2">
            {Object.entries(variableCategories).map(([key, category]) => (
              <TabsTrigger 
                key={key} 
                value={key} 
                className="w-full justify-start data-[state=active]:bg-blue-100"
              >
                <span className="mr-2">{category.icon}</span>
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(variableCategories).map(([key, category]) => (
            <TabsContent key={key} value={key} className="p-4 space-y-2 max-h-[450px] overflow-y-auto">
              <h4 className="font-medium text-sm text-gray-700 mb-3">
                {category.icon} {category.title}
              </h4>
              {category.variables.map((variable) => (
                <Button
                  key={variable.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => onInsertVariable(variable.name)}
                  className="w-full justify-start text-left h-auto p-2 hover:bg-blue-50"
                >
                  <div className="flex flex-col items-start w-full">
                    <div className="flex items-center w-full">
                      <Badge variant="secondary" className="text-xs font-mono mr-2">
                        {variable.name}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-600 mt-1">
                      {variable.description}
                    </span>
                  </div>
                </Button>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TemplateVariables;
