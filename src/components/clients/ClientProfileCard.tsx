
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Mail, Phone, MapPin, MoreVertical, Users } from "lucide-react";
import { Client } from "@/services/api/types";
import AddressSearch from "./AddressSearch";
import { GeoCoordinates } from "@/services/geoCoordinatesService";

interface ClientProfileCardProps {
  client: Client | null;
  surfaceArea?: string;
  roofArea?: string;
  floorType?: string;
  climateZone?: string;
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
  onFloorTypeChange?: (value: string) => void;
  onClimateZoneChange?: (value: string) => void;
}

const ClientProfileCard = ({
  client,
  surfaceArea = "56",
  roofArea = "89",
  floorType = "Bois",
  climateZone = "C3",
  onSurfaceAreaChange,
  onRoofAreaChange,
  onFloorTypeChange,
  onClimateZoneChange
}: ClientProfileCardProps) => {
  const [editableEmail, setEditableEmail] = useState(client?.email || "");
  const [editablePhone, setEditablePhone] = useState(client?.phone || "");
  const [editableAddress, setEditableAddress] = useState(client?.address || "");
  const [editablePostalCode, setEditablePostalCode] = useState(client?.postalCode || "");
  const [editableCity, setEditableCity] = useState("Valencia de Don Juan");
  const [editableProvince, setEditableProvince] = useState("León");
  const [editableCommunity, setEditableCommunity] = useState(client?.community || "Castille-et-León");
  const [editableGeolocation, setEditableGeolocation] = useState("À définir");
  const [editableUTM, setEditableUTM] = useState("À définir");

  if (!client) return null;

  const handleAddressChange = (address: string) => {
    setEditableAddress(address);
  };

  const handleCoordinatesChange = (coordinates: GeoCoordinates) => {
    setEditableGeolocation(`${coordinates.lat}, ${coordinates.lng}`);
    const utmEasting = Math.round(500000 + coordinates.lng * 111320 * Math.cos(coordinates.lat * Math.PI / 180));
    const utmNorthing = Math.round(coordinates.lat * 111320);
    setEditableUTM(`UTM 30N E: ${utmEasting} N: ${utmNorthing}`);
  };

  const floorTypeOptions = [
    { value: "Béton", label: "🪨 Béton" },
    { value: "Bois", label: "🪵 Bois" },
    { value: "Céramique", label: "🧱 Céramique" }
  ];

  const climateZoneOptions = [
    { value: "A3", label: "A3" },
    { value: "A4", label: "A4" },
    { value: "B3", label: "B3" },
    { value: "B4", label: "B4" },
    { value: "C1", label: "C1" },
    { value: "C2", label: "C2" },
    { value: "C3", label: "C3" },
    { value: "C4", label: "C4" },
    { value: "D1", label: "D1" },
    { value: "D2", label: "D2" },
    { value: "D3", label: "D3" },
    { value: "E1", label: "E1" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Colonne de gauche : Données Techniques */}
      <div className="space-y-8">
        <Card>
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold mb-6">Données Techniques</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-500 mb-3">Type de plancher</label>
                <Select value={floorType} onValueChange={onFloorTypeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {floorTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-3">Zone climatique</label>
                <Select value={climateZone} onValueChange={onClimateZoneChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {climateZoneOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-3">Surface combles (m²)</label>
                  <Input 
                    type="number" 
                    value={surfaceArea} 
                    onChange={(e) => onSurfaceAreaChange?.(e.target.value)} 
                    className="w-full" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-3">Surface toiture (m²)</label>
                  <Input 
                    type="number" 
                    value={roofArea} 
                    onChange={(e) => onRoofAreaChange?.(e.target.value)} 
                    className="w-full" 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Colonne de droite : Header + Contact + Adresse + Équipe */}
      <div className="space-y-8">
        {/* Header avec nom et badge */}
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{client.name}</h1>
            <div className="flex justify-center">
              <Badge className="bg-green-600 hover:bg-green-700 px-6 py-3 text-sm">
                RES020
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Section Contact */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-500 mb-3">Email</label>
                <Input
                  type="email"
                  value={editableEmail}
                  onChange={(e) => setEditableEmail(e.target.value)}
                  className="w-full"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-3">Téléphone</label>
                <Input
                  type="tel"
                  value={editablePhone}
                  onChange={(e) => setEditablePhone(e.target.value)}
                  className="w-full"
                  placeholder="+34 XXX XXX XXX"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Adresse complète */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold mb-6">Adresse complète</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-500 mb-3">Adresse avec autocomplétion</label>
                <AddressSearch
                  initialAddress={editableAddress}
                  onAddressChange={handleAddressChange}
                  onCoordinatesChange={handleCoordinatesChange}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-3">Rue</label>
                <Input
                  value={editableAddress}
                  onChange={(e) => setEditableAddress(e.target.value)}
                  className="w-full"
                  placeholder="Nom de la rue"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-3">Code postal</label>
                  <Input
                    value={editablePostalCode}
                    onChange={(e) => setEditablePostalCode(e.target.value)}
                    className="w-full"
                    placeholder="Code postal"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-3">Ville</label>
                  <Input
                    value={editableCity}
                    onChange={(e) => setEditableCity(e.target.value)}
                    className="w-full"
                    placeholder="Ville"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-3">Province</label>
                  <Input
                    value={editableProvince}
                    onChange={(e) => setEditableProvince(e.target.value)}
                    className="w-full"
                    placeholder="Province"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-3">Communauté autonome</label>
                  <Input
                    value={editableCommunity}
                    onChange={(e) => setEditableCommunity(e.target.value)}
                    className="w-full"
                    placeholder="Communauté autonome"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-3">Géolocalisation</label>
                  <Input
                    value={editableGeolocation}
                    onChange={(e) => setEditableGeolocation(e.target.value)}
                    className="w-full"
                    placeholder="Latitude, Longitude"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-3">UTM</label>
                  <Input
                    value={editableUTM}
                    onChange={(e) => setEditableUTM(e.target.value)}
                    className="w-full"
                    placeholder="Coordonnées UTM"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Équipe */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold mb-6">Équipe assignée</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-500 mb-3">Téléprospecteur</label>
                <Input
                  value={client.teleprospector || "Amir"}
                  readOnly
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-3">Confirmateur</label>
                <Input
                  value={client.confirmer || "Cynthia"}
                  readOnly
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-3">Équipe de pose</label>
                <Input
                  value={client.installationTeam || "RA BAT 2"}
                  readOnly
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer avec bouton Action */}
        <Card>
          <CardContent className="p-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2 py-4">
                  Action
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuItem>Modifier les informations</DropdownMenuItem>
                <DropdownMenuItem>Programmer une visite</DropdownMenuItem>
                <DropdownMenuItem>Générer un devis</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Supprimer le client</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientProfileCard;
