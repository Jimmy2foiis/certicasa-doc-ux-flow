
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsTabContent from "./ProjectsTabContent";
import CalculationsTabContent from "./CalculationsTabContent";
import { DocumentsTabContent } from "./DocumentsTabContent";
import SignaturesTabContent from "./SignaturesTabContent";
import { Card } from "@/components/ui/card";

interface ClientTabsContainerProps {
  client: any;
  clientId: string;
  savedCalculations: any[];
  onNewCalculation: () => void;
  onEditCalculation: (projectId: string) => void;
  onDeleteCalculation: (projectId: string) => void;
  onBack: () => void;
}

export const ClientTabsContainer = ({ 
  client,
  clientId,
  savedCalculations,
  onNewCalculation,
  onEditCalculation,
  onDeleteCalculation,
  onBack
}: ClientTabsContainerProps) => {
  const [currentTab, setCurrentTab] = useState("projects");

  return (
    <Card>
      <Tabs defaultValue="projects" onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/20">
          <TabsTrigger 
            value="projects" 
            className={`${currentTab === "projects" ? "bg-primary text-primary-foreground" : ""} transition-all`}
          >
            Projets
          </TabsTrigger>
          <TabsTrigger 
            value="calculations" 
            className={`${currentTab === "calculations" ? "bg-primary text-primary-foreground" : ""} transition-all`}
          >
            Calculs
          </TabsTrigger>
          <TabsTrigger 
            value="documents" 
            className={`${currentTab === "documents" ? "bg-primary text-primary-foreground" : ""} transition-all`}
          >
            Documents
          </TabsTrigger>
          <TabsTrigger 
            value="signatures" 
            className={`${currentTab === "signatures" ? "bg-primary text-primary-foreground" : ""} transition-all`}
          >
            Signatures
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="p-4">
          <ProjectsTabContent clientId={clientId} />
        </TabsContent>

        <TabsContent value="calculations" className="p-4">
          <CalculationsTabContent 
            onOpenCalculation={onEditCalculation} 
            clientId={clientId} 
            savedCalculations={savedCalculations}
            onNewCalculation={onNewCalculation}
            onDeleteCalculation={onDeleteCalculation}
          />
        </TabsContent>

        <TabsContent value="documents" className="p-4">
          <DocumentsTabContent clientId={clientId} clientName={client?.name} />
        </TabsContent>

        <TabsContent value="signatures" className="p-4">
          <SignaturesTabContent clientId={clientId} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
