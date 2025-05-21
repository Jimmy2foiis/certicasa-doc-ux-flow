import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CommercialSidebar from "./CommercialSidebar";
import LeadContent from "./content/LeadContent";
import QualificationContent from "./content/QualificationContent";
import PlanningContent from "./content/PlanningContent";
import SuiviContent from "./content/SuiviContent";
import FacturationContent from "./content/FacturationContent";

const Workflow = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <CommercialSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={<Navigate to="/commercial/leads" replace />} />
          <Route path="/leads" element={<LeadContent />} />
          <Route path="/qualification" element={<QualificationContent />} />
          <Route path="/planning" element={<PlanningContent />} />
          <Route path="/suivi" element={<SuiviContent />} />
          <Route path="/facturation" element={<FacturationContent />} />
        </Routes>
      </main>
    </div>
  );
};

export default Workflow; 