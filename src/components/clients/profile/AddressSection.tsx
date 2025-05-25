
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Client } from "@/services/api/types";
import AddressSearch from "../AddressSearch";
import { GeoCoordinates } from "@/services/geoCoordinatesService";

interface AddressSectionProps {
  client: Client;
}

export const AddressSection = ({ client }: AddressSectionProps) => {
  const [editableAddress, setEditableAddress] = useState(client?.address || "");
  const [editablePostalCode, setEditablePostalCode] = useState(client?.postalCode || "");
  const [editableCity, setEditableCity] = useState("Valencia de Don Juan");
  const [editableProvince, setEditableProvince] = useState("León");
  const [editableCommunity, setEditableCommunity] = useState(client?.community || "Castille-et-León");
  const [editableGeolocation, setEditableGeolocation] = useState("À définir");
  const [editableUTM, setEditableUTM] = useState("À définir");

  const handleAddressChange = (address: string) => {
    setEditableAddress(address);
  };

  const handleCoordinatesChange = (coordinates: GeoCoordinates) => {
    setEditableGeolocation(`${coordinates.lat}, ${coordinates.lng}`);
    const utmEasting = Math.round(500000 + coordinates.lng * 111320 * Math.cos(coordinates.lat * Math.PI / 180));
    const utmNorthing = Math.round(coordinates.lat * 111320);
    setEditableUTM(`UTM 30N E: ${utmEasting} N: ${utmNorthing}`);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Adresse complète</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-500 mb-2">Adresse avec autocomplétion</label>
          <AddressSearch
            initialAddress={editableAddress}
            onAddressChange={handleAddressChange}
            onCoordinatesChange={handleCoordinatesChange}
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-500 mb-2">Rue</label>
          <Input
            value={editableAddress}
            onChange={(e) => setEditableAddress(e.target.value)}
            className="w-full"
            placeholder="Nom de la rue"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-500 mb-2">Code postal</label>
          <Input
            value={editablePostalCode}
            onChange={(e) => setEditablePostalCode(e.target.value)}
            className="w-full"
            placeholder="Code postal"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-500 mb-2">Ville</label>
          <Input
            value={editableCity}
            onChange={(e) => setEditableCity(e.target.value)}
            className="w-full"
            placeholder="Ville"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-500 mb-2">Province</label>
          <Input
            value={editableProvince}
            onChange={(e) => setEditableProvince(e.target.value)}
            className="w-full"
            placeholder="Province"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-500 mb-2">Communauté autonome</label>
          <Input
            value={editableCommunity}
            onChange={(e) => setEditableCommunity(e.target.value)}
            className="w-full"
            placeholder="Communauté autonome"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-500 mb-2">Géolocalisation</label>
          <Input
            value={editableGeolocation}
            onChange={(e) => setEditableGeolocation(e.target.value)}
            className="w-full"
            placeholder="Latitude, Longitude"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-500 mb-2">UTM</label>
          <Input
            value={editableUTM}
            onChange={(e) => setEditableUTM(e.target.value)}
            className="w-full"
            placeholder="Coordonnées UTM"
          />
        </div>
      </div>
    </div>
  );
};
