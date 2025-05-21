
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DocumentAccordion from "./DocumentAccordion";
import ClientInfoSection from "./ClientInfoSection";
import { mockDossiers } from "@/data/mockDossiers";

const DossierDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find dossier from mock data (would be replaced with API call)
  const dossier = mockDossiers.find(d => d.id === id);
  
  if (!dossier) {
    return (
      <div className="p-8">
        <Button variant="outline" onClick={() => navigate('/admin')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-gray-500">Dossier non trouvé</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          <h1 className="text-2xl font-bold">
            Dossier {dossier.clientName} <span className="text-gray-400 text-lg">({dossier.clientId})</span>
          </h1>
        </div>
        <Button className="ml-auto">
          <Download className="mr-2 h-4 w-4" />
          Exporter le Dossier Complet (ZIP)
        </Button>
      </div>
      
      {/* Status Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="font-medium">Statut global:</div>
          <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
            En attente CEE PREVIO
          </Badge>
        </div>
      </div>
      
      {/* Client Information Section */}
      <ClientInfoSection clientId={dossier.clientId} />
      
      {/* Documents Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Pôle des 8 Documents Administratifs</CardTitle>
          <CardDescription>
            Gestion des documents officiels requis pour le dossier client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentAccordion />
        </CardContent>
      </Card>
    </div>
  );
};

export default DossierDetail;
