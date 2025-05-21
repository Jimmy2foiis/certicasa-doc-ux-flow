import React from "react";
import UnderConstruction from "@/components/common/UnderConstruction";

const FacturationContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Facturation</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Nouvelle Facture
        </button>
      </div>
      
      <UnderConstruction 
        title="Facturation"
        description="Cette section permettra de gérer la facturation des projets et le suivi des paiements."
      />
    </div>
  );
};

export default FacturationContent; 