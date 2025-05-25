
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/services/api/types";

interface ClientHeaderProps {
  client: Client;
}

export const ClientHeader = ({ client }: ClientHeaderProps) => {
  return (
    <div className="text-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{client.name}</h1>
      <div className="flex justify-center">
        <Badge className="bg-green-600 hover:bg-green-700 px-4 py-2">
          RES020
        </Badge>
      </div>
    </div>
  );
};
