
import React from "react";
import { User, CheckSquare, Building, Target, Calendar } from "lucide-react";

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
        <div className="flex items-start">
          <User className="h-4 w-4 text-gray-500 mr-2.5 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Téléprospecteur</span>
            <span className="font-medium">Amir</span>
          </div>
        </div>
        
        <div className="flex items-start">
          <CheckSquare className="h-4 w-4 text-gray-500 mr-2.5 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Confirmateur</span>
            <span className="font-medium">Cynthia</span>
          </div>
        </div>
        
        <div className="flex items-start">
          <Building className="h-4 w-4 text-gray-500 mr-2.5 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Équipe de pose</span>
            <span className="font-medium">RA BAT 2</span>
          </div>
        </div>
        
        <div className="flex items-start">
          <Target className="h-4 w-4 text-gray-500 mr-2.5 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Leads</span>
            <span className="font-medium">Caviar / Saumon / Caviar</span>
          </div>
        </div>
        
        <div className="flex items-start">
          <Calendar className="h-4 w-4 text-gray-500 mr-2.5 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Date d'inscription</span>
            <span className="font-medium">13/05/2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTeamSection;
