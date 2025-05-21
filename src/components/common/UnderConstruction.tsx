import React from "react";

interface UnderConstructionProps {
  title: string;
  description: string;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
      <div className="text-4xl mb-4">🚧</div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 text-center max-w-md">{description}</p>
    </div>
  );
};

export default UnderConstruction; 