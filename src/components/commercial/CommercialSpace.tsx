import React from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import CommercialSidebar from "./CommercialSidebar";
import LeadContent from "./content/LeadContent";
import QualificationContent from "./content/QualificationContent";
import PlanningContent from "./content/PlanningContent";
import PoseContent from "./content/PoseContent";
import ParrainageContent from "./content/ParrainageContent";
import ProductsContent from "./content/ProductsContent";
import SettingsContent from "./content/SettingsContent";
import TrainingContent from "./content/TrainingContent";
import HelpContent from "./content/HelpContent";

const CommercialSpace = () => {
  const location = useLocation();
  
  // Rediriger vers /workflow/lead si on est juste sur /workflow
  if (location.pathname === "/workflow") {
    return <Navigate to="/workflow/lead" replace />;
  }

  return (
    <div className="h-full flex">
      {/* Arborescence latérale */}
      <CommercialSidebar />
      
      {/* Contenu principal basé sur la route */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <h1 className="text-2xl font-semibold text-gray-800">ESPACE COMMERCIALE</h1>
        </header>
        <div className="flex-1 p-4 overflow-auto">
          <Routes>
            <Route path="/lead" element={<LeadContent />} />
            <Route path="/qualification" element={<QualificationContent />} />
            <Route path="/planning" element={<PlanningContent />} />
            <Route path="/pose" element={<PoseContent />} />
            <Route path="/parrainage" element={<ParrainageContent />} />
            <Route path="/products" element={<ProductsContent />} />
            <Route path="/settings" element={<SettingsContent />} />
            <Route path="/training" element={<TrainingContent />} />
            <Route path="/help" element={<HelpContent />} />
            <Route path="*" element={<Navigate to="/workflow/lead" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CommercialSpace;
