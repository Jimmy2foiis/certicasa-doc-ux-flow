
import React from "react";
import { Badge } from "@/components/ui/badge";
import { User, CheckSquare, Building } from "lucide-react";

const TeamBadgesSection = () => {
  return (
    <div className="flex items-center gap-3">
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1.5 px-3 py-1">
        <User className="h-3 w-3" />
        Téléprospecteur : Amir
      </Badge>
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5 px-3 py-1">
        <CheckSquare className="h-3 w-3" />
        Confirmateur : Cynthia
      </Badge>
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1.5 px-3 py-1">
        <Building className="h-3 w-3" />
        Équipe de pose : RA BAT 2
      </Badge>
    </div>
  );
};

export default TeamBadgesSection;
