
import React from "react";
import { User, CheckSquare, Building } from "lucide-react";

interface ProjectTeamSectionProps {
  teleprospector: string;
  confirmer: string;
  installationTeam: string;
}

const ProjectTeamSection = ({ teleprospector, confirmer, installationTeam }: ProjectTeamSectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-base border-b pb-1">Équipe projet</h3>
      
      <div className="space-y-2.5">
        <div className="flex items-center">
          <User className="h-4 w-4 text-gray-500 mr-2.5" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Téléprospecteur</span>
            <span className="font-medium">{teleprospector}</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <CheckSquare className="h-4 w-4 text-gray-500 mr-2.5" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Confirmateur</span>
            <span className="font-medium">{confirmer}</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <Building className="h-4 w-4 text-gray-500 mr-2.5" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Équipe de pose</span>
            <span className="font-medium">{installationTeam}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTeamSection;
