
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface ProjectInfoSectionProps {
  isolationType?: string;
  floorType?: string;
  climateZone?: string;
  surfaceArea: string;
  roofArea: string;
  onSurfaceAreaChange?: (value: string) => void;
  onRoofAreaChange?: (value: string) => void;
  onFloorTypeChange?: (value: string) => void;
  onClimateZoneChange?: (value: string) => void;
}
const ProjectInfoSection = ({
  isolationType = "Combles",
  floorType = "Bois",
  climateZone = "C3",
  surfaceArea,
  roofArea,
  onSurfaceAreaChange,
  onRoofAreaChange,
  onFloorTypeChange,
  onClimateZoneChange
}: ProjectInfoSectionProps) => {
  const [localSurfaceArea, setLocalSurfaceArea] = useState(surfaceArea);
  const [localRoofArea, setLocalRoofArea] = useState(roofArea);
  const [localFloorType, setLocalFloorType] = useState(floorType);
  const [localClimateZone, setLocalClimateZone] = useState(climateZone);
  
  // États locaux pour les nouveaux champs
  const [email, setEmail] = useState("contact@example.com");
  const [phone, setPhone] = useState("+34 XXX XXX XXX");
  const [address, setAddress] = useState("Rue Serrano 120");
  const [postalCode, setPostalCode] = useState("28006");
  const [city, setCity] = useState("Madrid");
  const [province, setProvince] = useState("Madrid");
  const [community, setCommunity] = useState("Communauté de Madrid");
  
  const handleSurfaceAreaChange = (value: string) => {
    setLocalSurfaceArea(value);
    if (onSurfaceAreaChange) {
      onSurfaceAreaChange(value);
    }
  };
  const handleRoofAreaChange = (value: string) => {
    setLocalRoofArea(value);
    if (onRoofAreaChange) {
      onRoofAreaChange(value);
    }
  };
  const handleFloorTypeChange = (value: string) => {
    setLocalFloorType(value);
    if (onFloorTypeChange) {
      onFloorTypeChange(value);
    }
  };
  const handleClimateZoneChange = (value: string) => {
    setLocalClimateZone(value);
    if (onClimateZoneChange) {
      onClimateZoneChange(value);
    }
  };
  const floorTypeOptions = [{
    value: "Béton",
    label: "🪨 Béton"
  }, {
    value: "Bois",
    label: "🪵 Bois"
  }, {
    value: "Céramique",
    label: "🧱 Céramique"
  }];
  const climateZoneOptions = [{
    value: "A3",
    label: "A3"
  }, {
    value: "A4",
    label: "A4"
  }, {
    value: "B3",
    label: "B3"
  }, {
    value: "B4",
    label: "B4"
  }, {
    value: "C1",
    label: "C1"
  }, {
    value: "C2",
    label: "C2"
  }, {
    value: "C3",
    label: "C3"
  }, {
    value: "C4",
    label: "C4"
  }, {
    value: "D1",
    label: "D1"
  }, {
    value: "D2",
    label: "D2"
  }, {
    value: "D3",
    label: "D3"
  }, {
    value: "E1",
    label: "E1"
  }];
  return <Card className="mb-4">
      <CardContent className="pt-6">
        {/* Section Contact */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Téléphone</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
                placeholder="+34 XXX XXX XXX"
              />
            </div>
          </div>
        </div>

        {/* Section Adresse complète */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Adresse complète</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">Rue</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full"
                placeholder="Nom de la rue"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Code postal</label>
                <Input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full"
                  placeholder="Code postal"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Ville</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full"
                  placeholder="Ville"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-500 mb-2">Province</label>
              <Input
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full"
                placeholder="Province"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-500 mb-2">Communauté autonome</label>
              <Input
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full"
                placeholder="Communauté autonome"
              />
            </div>
          </div>
        </div>

        {/* Section Données Techniques avec titre H3 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Données Techniques</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">Type de plancher</label>
              <Select value={localFloorType} onValueChange={handleFloorTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {floorTypeOptions.map(option => <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2">Zone climatique</label>
              <Select value={localClimateZone} onValueChange={handleClimateZoneChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {climateZoneOptions.map(option => <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Surface combles (m²)</label>
                <Input type="number" value={localSurfaceArea} onChange={e => handleSurfaceAreaChange(e.target.value)} className="w-full" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Surface toiture (m²)</label>
                <Input type="number" value={localRoofArea} onChange={e => handleRoofAreaChange(e.target.value)} className="w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Section récapitulatif avec badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {/* Type de plancher */}
          <div className="flex flex-col">
            
            
          </div>
          
          {/* Zone climatique */}
          <div className="flex flex-col">
            
            
          </div>
          
          {/* Superficie des combles */}
          <div className="flex flex-col">
            
            
          </div>
          
          {/* Superficie de la toiture */}
          
        </div>
      </CardContent>
    </Card>;
};
export default ProjectInfoSection;
