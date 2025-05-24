
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ClientInvoicesTab from "./tabs/ClientInvoicesTab";
import DelegateInvoicesTab from "./tabs/DelegateInvoicesTab";
import CreditNotesTab from "./tabs/CreditNotesTab";
import FinancesDashboard from "./FinancesDashboard";
import FinancesFilters from "./FinancesFilters";
import { useToast } from "@/hooks/use-toast";

const FinancesModule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleExportSelected = () => {
    toast({
      title: "Export en cours",
      description: "Préparation de l'export des documents sélectionnés...",
    });
    // Logique d'export à implémenter
  };

  const handleFilterChange = (
    month: string,
    statuses: string[],
    search: string
  ) => {
    setSelectedMonth(month);
    setSelectedStatuses(statuses);
    setSearchTerm(search);
  };

  return (
    <div className="space-y-6">
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="client-invoices">Factures Clients</TabsTrigger>
            <TabsTrigger value="delegate-invoices">
              Factures Délégataires
            </TabsTrigger>
            <TabsTrigger value="credit-notes">Notes de Crédit</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <FinancesDashboard />
          </TabsContent>

          <TabsContent value="client-invoices">
            <FinancesFilters
              selectedMonth={selectedMonth}
              selectedStatuses={selectedStatuses}
              searchTerm={searchTerm}
              onFilterChange={handleFilterChange}
              onExportSelected={handleExportSelected}
            />
            <div className="mt-6">
              <ClientInvoicesTab
                selectedMonth={selectedMonth}
                selectedStatuses={selectedStatuses}
                searchTerm={searchTerm}
              />
            </div>
          </TabsContent>

          <TabsContent value="delegate-invoices">
            <FinancesFilters
              selectedMonth={selectedMonth}
              selectedStatuses={selectedStatuses}
              searchTerm={searchTerm}
              onFilterChange={handleFilterChange}
              onExportSelected={handleExportSelected}
            />
            <div className="mt-6">
              <DelegateInvoicesTab
                selectedMonth={selectedMonth}
                selectedStatuses={selectedStatuses}
                searchTerm={searchTerm}
              />
            </div>
          </TabsContent>

          <TabsContent value="credit-notes">
            <FinancesFilters
              selectedMonth={selectedMonth}
              selectedStatuses={selectedStatuses}
              searchTerm={searchTerm}
              onFilterChange={handleFilterChange}
              onExportSelected={handleExportSelected}
            />
            <div className="mt-6">
              <CreditNotesTab
                selectedMonth={selectedMonth}
                selectedStatuses={selectedStatuses}
                searchTerm={searchTerm}
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default FinancesModule;
