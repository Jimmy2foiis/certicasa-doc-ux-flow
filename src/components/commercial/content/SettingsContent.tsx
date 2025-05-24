
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaterialsAndProductsSection from "@/components/settings/MaterialsAndProductsSection";
import GeneralTab from "@/components/commercial/settings/GeneralTab";
import CommercialNotificationsTab from "@/components/commercial/settings/CommercialNotificationsTab";
import WorkflowTab from "@/components/commercial/settings/WorkflowTab";
import AdvancedTab from "@/components/commercial/settings/AdvancedTab";

const SettingsContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Sauvegarder les modifications
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="materials">Matériaux & Produits</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab />
        </TabsContent>

        <TabsContent value="materials">
          <MaterialsAndProductsSection />
        </TabsContent>

        <TabsContent value="notifications">
          <CommercialNotificationsTab />
        </TabsContent>

        <TabsContent value="workflow">
          <WorkflowTab />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsContent;
