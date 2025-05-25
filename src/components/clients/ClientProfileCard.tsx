
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Mail, Phone, MapPin, ChevronDown, ChevronRight, MoreVertical, Users } from "lucide-react";
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
  const [isTeamExpanded, setIsTeamExpanded] = useState(false);
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
    // Calcul UTM simplifié (en réalité il faudrait une vraie conversion)
    const utmEasting = Math.round(500000 + coordinates.lng * 111320 * Math.cos(coordinates.lat * Math.PI / 180));
    const utmNorthing = Math.round(coordinates.lat * 111320);
    setEditableUTM(`UTM 30N E: ${utmEasting} N: ${utmNorthing}`);
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardContent className="p-8">
        {/* Header avec plus d'espacement */}
        <div className="text-center space-y-6 mb-12">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{client.name}</h1>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-green-600 hover:bg-green-700 px-4 py-2">
              RES020
            </Badge>
          </div>
        </div>

        {/* Section Contact avec champs éditables */}
        <div className="bg-white p-6 rounded-lg border mb-8">
          <div className="flex items-center mb-6">
            <Mail className="h-5 w-5 mr-3 text-gray-600" />
            <h3 className="font-semibold text-gray-900 text-lg">Contact</h3>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Email</label>
              <Input
                type="email"
                value={editableEmail}
                onChange={(e) => setEditableEmail(e.target.value)}
                className="w-full"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Téléphone</label>
              <Input
                type="tel"
                value={editablePhone}
                onChange={(e) => setEditablePhone(e.target.value)}
                className="w-full"
                placeholder="+34 XXX XXX XXX"
              />
            </div>
          </div>
        </div>

        {/* Section Adresse avec autocomplétion Google Maps */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="flex items-center mb-6">
            <MapPin className="h-5 w-5 mr-3 text-gray-600" />
            <h3 className="font-semibold text-gray-900 text-lg">Adresse complète</h3>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Adresse avec autocomplétion</label>
              <AddressSearch
                initialAddress={editableAddress}
                onAddressChange={handleAddressChange}
                onCoordinatesChange={handleCoordinatesChange}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Rue</label>
                <Input
                  value={editableAddress}
                  onChange={(e) => setEditableAddress(e.target.value)}
                  className="w-full"
                  placeholder="Nom de la rue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Code postal</label>
                <Input
                  value={editablePostalCode}
                  onChange={(e) => setEditablePostalCode(e.target.value)}
                  className="w-full"
                  placeholder="Code postal"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Ville</label>
                <Input
                  value={editableCity}
                  onChange={(e) => setEditableCity(e.target.value)}
                  className="w-full"
                  placeholder="Ville"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Province</label>
                <Input
                  value={editableProvince}
                  onChange={(e) => setEditableProvince(e.target.value)}
                  className="w-full"
                  placeholder="Province"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Communauté autonome</label>
                <Input
                  value={editableCommunity}
                  onChange={(e) => setEditableCommunity(e.target.value)}
                  className="w-full"
                  placeholder="Communauté autonome"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Géolocalisation</label>
                <Input
                  value={editableGeolocation}
                  onChange={(e) => setEditableGeolocation(e.target.value)}
                  className="w-full"
                  placeholder="Latitude, Longitude"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">UTM</label>
                <Input
                  value={editableUTM}
                  onChange={(e) => setEditableUTM(e.target.value)}
                  className="w-full"
                  placeholder="Coordonnées UTM"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Équipe */}
        <Collapsible open={isTeamExpanded} onOpenChange={setIsTeamExpanded} className="mb-8">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-3 text-gray-600" />
              <h3 className="font-semibold text-gray-900 text-lg">Équipe assignée</h3>
            </div>
            {isTeamExpanded ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="bg-white p-6 rounded-lg border space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Téléprospecteur</label>
                <Input
                  value={client.teleprospector || "Amir"}
                  readOnly
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Confirmateur</label>
                <Input
                  value={client.confirmer || "Cynthia"}
                  readOnly
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Équipe de pose</label>
                <Input
                  value={client.installationTeam || "RA BAT 2"}
                  readOnly
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Footer avec plus d'espacement */}
        <div className="pt-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2 py-3">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientProfileCard;
