
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/dashboard/Dashboard";
import ClientsSection from "@/components/clients/ClientsSection";
import ProjectCalculation from "@/components/calculations/ProjectCalculation";
import DocumentGeneration from "@/components/documents/DocumentGeneration";
import WorkflowManagement from "@/components/workflow/WorkflowManagement";
import Billing from "@/components/billing/Billing";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const Index = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="mb-6 bg-white p-1 shadow-sm rounded-md">
              <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="calculations">Calculs</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="workflow">Suivi de projet</TabsTrigger>
              <TabsTrigger value="billing">Facturation</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>
            <TabsContent value="clients">
              <ClientsSection />
            </TabsContent>
            <TabsContent value="calculations">
              <ProjectCalculation />
            </TabsContent>
            <TabsContent value="documents">
              <DocumentGeneration />
            </TabsContent>
            <TabsContent value="workflow">
              <WorkflowManagement />
            </TabsContent>
            <TabsContent value="billing">
              <Billing />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
