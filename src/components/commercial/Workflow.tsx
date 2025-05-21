
import React, { useState } from "react";
import CommercialSidebar from "./CommercialSidebar";
import LeadContent from "./content/LeadContent";
import SuiviContent from "./content/SuiviContent";
import FacturationContent from "./content/FacturationContent";
import ProductsContent from "./content/ProductsContent";
import PoseContent from "./content/PoseContent";
import QualificationContent from "./content/QualificationContent";
import PlanningContent from "./content/PlanningContent";
import ParrainageContent from "./content/ParrainageContent";
import TrainingContent from "./content/TrainingContent";
import SettingsContent from "./content/SettingsContent";
import HelpContent from "./content/HelpContent";

const Workflow = () => {
  const [activeSection, setActiveSection] = useState<string>("leads");

  const renderContent = () => {
    switch (activeSection) {
      case "leads":
        return <LeadContent />;
      case "suivi":
        return <SuiviContent />;
      case "facturation":
        return <FacturationContent />;
      case "products":
        return <ProductsContent />;
      case "pose":
        return <PoseContent />;
      case "qualification":
        return <QualificationContent />;
      case "planning":
        return <PlanningContent />;
      case "parrainage":
        return <ParrainageContent />;
      case "formation":
        return <TrainingContent />;
      case "parametres":
        return <SettingsContent />;
      case "aide":
        return <HelpContent />;
      default:
        return <LeadContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <CommercialSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Workflow;
