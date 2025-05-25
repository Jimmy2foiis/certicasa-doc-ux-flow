
import React from "react";
import { Input } from "@/components/ui/input";
import { Client } from "@/services/api/types";

interface TeamSectionProps {
  client: Client;
}

export const TeamSection = ({ client }: TeamSectionProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Équipe assignée</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-500 mb-2">Téléprospecteur</label>
          <Input
            value={client.teleprospector || "Amir"}
            readOnly
            className="w-full bg-gray-100 cursor-not-allowed"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-500 mb-2">Confirmateur</label>
          <Input
            value={client.confirmer || "Cynthia"}
            readOnly
            className="w-full bg-gray-100 cursor-not-allowed"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-500 mb-2">Équipe de pose</label>
          <Input
            value={client.installationTeam || "RA BAT 2"}
            readOnly
            className="w-full bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};
