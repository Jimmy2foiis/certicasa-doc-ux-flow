import React from "react";
import UnderConstruction from "@/components/common/UnderConstruction";

const QualificationContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Qualification Commerciale</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Nouvelle Qualification
        </button>
      </div>
      
      <UnderConstruction 
        title="Qualification Commerciale"
        description="Cette section permettra de qualifier les projets et de suivre leur progression dans le pipeline commercial."
      />
    </div>
  );
};

export default QualificationContent;
