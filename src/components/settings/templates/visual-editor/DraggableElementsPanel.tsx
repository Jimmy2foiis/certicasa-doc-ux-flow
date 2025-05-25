
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DraggableItemProps {
  id: string;
  type?: string;
  children: React.ReactNode;
  icon?: string;
}

const DraggableItem = ({ id, type, children, icon }: DraggableItemProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, type }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="p-3 bg-gray-50 border border-gray-200 rounded-md cursor-grab hover:bg-gray-100 transition-colors mb-2"
    >
      <div className="flex items-center space-x-2">
        {icon && <span>{icon}</span>}
        <span className="text-sm font-medium">{children}</span>
      </div>
    </div>
  );
};

const DraggableElementsPanel = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="text-lg font-bold">🎯 Éléments disponibles</div>
      
      {/* Section Logo */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">🖼️ Logo & En-tête</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DraggableItem id="logo" icon="📷">
            Logo entreprise
          </DraggableItem>
          <DraggableItem id="header" icon="📄">
            En-tête personnalisé
          </DraggableItem>
        </CardContent>
      </Card>

      {/* Variables Client */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">👤 Client</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DraggableItem id="cliente_nombre" icon="🏷️">
            Nom client
          </DraggableItem>
          <DraggableItem id="cliente_nif" icon="🆔">
            NIF client
          </DraggableItem>
          <DraggableItem id="cliente_direccion" icon="📍">
            Adresse
          </DraggableItem>
          <DraggableItem id="cliente_telefono" icon="📞">
            Téléphone
          </DraggableItem>
          <DraggableItem id="cliente_email" icon="📧">
            Email
          </DraggableItem>
        </CardContent>
      </Card>

      {/* Variables Projet */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">🏠 Projet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DraggableItem id="numero_factura" icon="📋">
            Numéro facture
          </DraggableItem>
          <DraggableItem id="fecha_hoy" icon="📅">
            Date du jour
          </DraggableItem>
          <DraggableItem id="zona_climatica" icon="🌡️">
            Zone climatique
          </DraggableItem>
          <DraggableItem id="superficie" icon="📐">
            Surface (m²)
          </DraggableItem>
          <DraggableItem id="cae_kwh" icon="⚡">
            CAE (kWh/an)
          </DraggableItem>
        </CardContent>
      </Card>

      {/* Tableau de facturation */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">📊 Tableau facturation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DraggableItem id="tabla_facturacion" type="table" icon="📋">
            Tableau automatique
          </DraggableItem>
          <DraggableItem id="producto_nombre" icon="📦">
            Nom produit
          </DraggableItem>
          <DraggableItem id="total_ht" icon="💰">
            Total HT
          </DraggableItem>
          <DraggableItem id="total_ttc" icon="💸">
            Total TTC
          </DraggableItem>
        </CardContent>
      </Card>

      {/* Mentions légales */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">⚖️ Mentions légales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DraggableItem id="mentions_paiement" icon="💳">
            Conditions paiement
          </DraggableItem>
          <DraggableItem id="mentions_legales" icon="📜">
            Mentions obligatoires
          </DraggableItem>
          <DraggableItem id="mentions_tva" icon="🧾">
            Mentions TVA
          </DraggableItem>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraggableElementsPanel;
