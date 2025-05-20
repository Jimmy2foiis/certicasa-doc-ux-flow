
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ClientsSection from "@/components/clients/ClientsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Receipt, Users, GitBranch, BarChart } from "lucide-react";

const Clients = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <Tabs defaultValue="clients" className="w-full">
            <TabsList className="mb-6 bg-white p-1 shadow-sm rounded-md">
              <TabsTrigger value="clients" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Clients</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-1">
                <GitBranch className="h-4 w-4" />
                <span>Projets</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Documents</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-1">
                <Receipt className="h-4 w-4" />
                <span>Facturation</span>
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>Statistiques</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="clients">
              <ClientsSection />
            </TabsContent>
            <TabsContent value="projects">
              <div className="h-full p-6 flex items-center justify-center border rounded-lg">
                <p className="text-muted-foreground">Contenu des projets à venir</p>
              </div>
            </TabsContent>
            <TabsContent value="documents">
              <div className="h-full p-6 flex items-center justify-center border rounded-lg">
                <p className="text-muted-foreground">Contenu des documents à venir</p>
              </div>
            </TabsContent>
            <TabsContent value="billing">
              <div className="h-full p-6 flex items-center justify-center border rounded-lg">
                <p className="text-muted-foreground">Contenu de la facturation à venir</p>
              </div>
            </TabsContent>
            <TabsContent value="statistics">
              <div className="h-full p-6 flex items-center justify-center border rounded-lg">
                <p className="text-muted-foreground">Contenu des statistiques à venir</p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Clients;
