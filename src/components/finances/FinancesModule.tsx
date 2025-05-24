
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ClientInvoicesTab from "./tabs/ClientInvoicesTab";
import DelegateInvoicesTab from "./tabs/DelegateInvoicesTab";
import CreditNotesTab from "./tabs/CreditNotesTab";
import ProfitabilitySection from "./ProfitabilitySection";
import FinancesFilters from "./FinancesFilters";
import { useToast } from "@/hooks/use-toast";

const FinancesModule = () => {
  const [activeTab, setActiveTab] = useState("client-invoices");
  
  // Initialiser avec le mois courant
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };
  
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
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
      <FinancesFilters
        selectedMonth={selectedMonth}
        selectedStatuses={selectedStatuses}
        searchTerm={searchTerm}
        onFilterChange={handleFilterChange}
        onExportSelected={handleExportSelected}
      />

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="client-invoices">Factures Clients</TabsTrigger>
            <TabsTrigger value="delegate-invoices">
              Factures Délégataires
            </TabsTrigger>
            <TabsTrigger value="credit-notes">Notes de Crédit</TabsTrigger>
          </TabsList>

          <TabsContent value="client-invoices">
            <ClientInvoicesTab
              selectedMonth={selectedMonth}
              selectedStatuses={selectedStatuses}
              searchTerm={searchTerm}
            />
          </TabsContent>

          <TabsContent value="delegate-invoices">
            <DelegateInvoicesTab
              selectedMonth={selectedMonth}
              selectedStatuses={selectedStatuses}
              searchTerm={searchTerm}
            />
          </TabsContent>

          <TabsContent value="credit-notes">
            <CreditNotesTab
              selectedMonth={selectedMonth}
              selectedStatuses={selectedStatuses}
              searchTerm={searchTerm}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <ProfitabilitySection selectedMonth={selectedMonth} />
    </div>
  );
};

export default FinancesModule;
