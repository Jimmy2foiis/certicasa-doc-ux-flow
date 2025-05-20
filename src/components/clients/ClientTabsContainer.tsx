
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsTabContent from "./ProjectsTabContent";
import CalculationsTabContent from "./CalculationsTabContent";
import DocumentsTabContent from "./DocumentsTabContent";
import SignaturesTabContent from "./SignaturesTabContent";
import { Card } from "@/components/ui/card";

interface ClientTabsContainerProps {
  onShowCalculation?: (projectId?: string) => void;
}

export const ClientTabsContainer = ({ onShowCalculation }: ClientTabsContainerProps) => {
  const [currentTab, setCurrentTab] = useState("projects");

  return (
    <Card className="lg:col-span-2">
      <Tabs defaultValue="projects" onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Projets</TabsTrigger>
          <TabsTrigger value="calculations">Calculs</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="signatures">Signatures</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="p-4">
          <ProjectsTabContent />
        </TabsContent>

        <TabsContent value="calculations" className="p-4">
          <CalculationsTabContent onShowCalculation={onShowCalculation} />
        </TabsContent>

        <TabsContent value="documents" className="p-4">
          <DocumentsTabContent />
        </TabsContent>

        <TabsContent value="signatures" className="p-4">
          <SignaturesTabContent />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
