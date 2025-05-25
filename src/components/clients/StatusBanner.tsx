
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Client } from "@/services/api/types";

interface StatusBannerProps {
  client: Client;
}

const StatusBanner = ({ client }: StatusBannerProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-sm text-gray-500 mt-1">Client Certicasa</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm font-medium">
                RES020
              </Badge>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <div>Numéro lot: {client.lotNumber || "Non assigné"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBanner;
