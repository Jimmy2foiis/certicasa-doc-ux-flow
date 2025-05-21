import React from "react";
import UnderConstruction from "@/components/common/UnderConstruction";

const SuiviContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Suivi des Projets</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Nouveau Projet
        </button>
      </div>
      
      <UnderConstruction 
        title="Suivi des Projets"
        description="Cette section permettra de suivre l'avancement des projets et de gérer les différentes étapes de réalisation."
      />
    </div>
  );
};

export default SuiviContent; 