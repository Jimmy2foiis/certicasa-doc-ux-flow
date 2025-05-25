
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, User } from "lucide-react";

interface StatusBannerProps {
  client?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    province?: string;
    community?: string;
  };
}

const StatusBanner = ({ client }: StatusBannerProps) => {
  return (
    <div className="bg-white border rounded-lg p-4 mb-4 space-y-4">
      {/* Section Contact */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <User className="h-4 w-4" />
          Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Input
              type="email"
              value={client?.email || ""}
              placeholder="email@example.com"
              className="text-sm h-8"
              readOnly
            />
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Input
              type="tel"
              value={client?.phone || ""}
              placeholder="+34 XXX XXX XXX"
              className="text-sm h-8"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Section Adresse complète */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Adresse complète
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="md:col-span-2 lg:col-span-1">
            <Input
              value={client?.address || ""}
              placeholder="Rue"
              className="text-sm h-8"
              readOnly
            />
          </div>
          <div>
            <Input
              value={client?.postalCode || ""}
              placeholder="Code postal"
              className="text-sm h-8"
              readOnly
            />
          </div>
          <div>
            <Input
              value={client?.city || ""}
              placeholder="Ville"
              className="text-sm h-8"
              readOnly
            />
          </div>
          <div>
            <Input
              value={client?.province || ""}
              placeholder="Province"
              className="text-sm h-8"
              readOnly
            />
          </div>
          <div className="md:col-span-2">
            <Input
              value={client?.community || ""}
              placeholder="Communauté autonome"
              className="text-sm h-8"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Bloc existant */}
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Actif
        </Badge>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          RES020
        </Badge>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Équipe RA BAT 2
        </Badge>
      </div>
    </div>
  );
};

export default StatusBanner;
