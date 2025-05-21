import React from "react";
import UnderConstruction from "@/components/common/UnderConstruction";

const LeadContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Gestion des Leads</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Nouveau Lead
        </button>
      </div>
      
      <UnderConstruction 
        title="Gestion des Leads"
        description="Cette section permettra de gérer les leads et opportunités commerciales. Vous pourrez ajouter, suivre et qualifier vos prospects."
      />
    </div>
  );
};

export default LeadContent;
