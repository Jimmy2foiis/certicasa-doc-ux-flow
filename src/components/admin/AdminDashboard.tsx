
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DossiersTable from "./DossiersTable";
import DossierFilters from "./DossierFilters";
import { mockDossiers } from "@/data/mockDossiers";

export interface Dossier {
  id: string;
  clientName: string;
  clientId: string;
  contactPhone: string;
  contactEmail: string;
  responsiblePerson: string;
  date: string;
  status: "en_attente" | "termine" | "rejete" | "validation" | "annule";
  duration: string;
  documentsCount: number;
  driveLink: string;
}

const AdminDashboard = () => {
  const [dossiers, setDossiers] = useState<Dossier[]>(mockDossiers);
  const [filteredDossiers, setFilteredDossiers] = useState<Dossier[]>(mockDossiers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [responsibleFilter, setResponsibleFilter] = useState<string>("all");
  
  // Count dossiers by status
  const dossiersCount = {
    all: dossiers.length,
    en_attente: dossiers.filter(d => d.status === "en_attente").length,
    termine: dossiers.filter(d => d.status === "termine").length,
    rejete: dossiers.filter(d => d.status === "rejete").length,
    validation: dossiers.filter(d => d.status === "validation").length,
    annule: dossiers.filter(d => d.status === "annule").length
  };
  
  // Count dossiers by responsible person
  const responsibleCount = {
    all: dossiers.length,
    "Anna Latour": dossiers.filter(d => d.responsiblePerson === "Anna Latour").length,
    "Marc Moreno": dossiers.filter(d => d.responsiblePerson === "Marc Moreno").length
  };
  
  // Filter dossiers based on search term, status filter and responsible filter
  useEffect(() => {
    let result = dossiers;
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(dossier => dossier.status === statusFilter);
    }
    
    // Apply responsible filter
    if (responsibleFilter !== "all") {
      result = result.filter(dossier => dossier.responsiblePerson === responsibleFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(dossier => 
        dossier.clientName.toLowerCase().includes(term) ||
        dossier.clientId.toLowerCase().includes(term) ||
        dossier.contactEmail.toLowerCase().includes(term) ||
        dossier.contactPhone.includes(term)
      );
    }
    
    setFilteredDossiers(result);
  }, [searchTerm, statusFilter, responsibleFilter, dossiers]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Portail Admin</h1>
      
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Liste des Dossiers</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Status tabs */}
          <Tabs 
            value={statusFilter} 
            onValueChange={setStatusFilter}
            className="w-full mb-6"
          >
            <TabsList className="w-full justify-start mb-4 bg-transparent p-0 space-x-2">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Tous les dossiers [{dossiersCount.all}]
              </TabsTrigger>
              <TabsTrigger 
                value="en_attente"
                className="data-[state=active]:bg-orange-50 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
              >
                En attente [{dossiersCount.en_attente}]
              </TabsTrigger>
              <TabsTrigger 
                value="termine"
                className="data-[state=active]:bg-green-50 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none"
              >
                Terminé [{dossiersCount.termine}]
              </TabsTrigger>
              <TabsTrigger 
                value="rejete"
                className="data-[state=active]:bg-red-50 data-[state=active]:border-b-2 data-[state=active]:border-red-500 rounded-none"
              >
                Rejeté [{dossiersCount.rejete}]
              </TabsTrigger>
              <TabsTrigger 
                value="validation"
                className="data-[state=active]:bg-purple-50 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
              >
                En attente de validation [{dossiersCount.validation}]
              </TabsTrigger>
              <TabsTrigger 
                value="annule"
                className="data-[state=active]:bg-gray-50 data-[state=active]:border-b-2 data-[state=active]:border-gray-500 rounded-none"
              >
                Annulé [{dossiersCount.annule}]
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Responsible filter */}
          <DossierFilters 
            responsibleFilter={responsibleFilter} 
            setResponsibleFilter={setResponsibleFilter} 
            responsibleCount={responsibleCount}
          />
          
          {/* Dossiers Table */}
          <DossiersTable dossiers={filteredDossiers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
