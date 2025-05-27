
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle, Clock, Users } from "lucide-react";

interface ThermicianSelectorProps {
  selectedThermician: string;
  onThermicianSelect: (thermician: string) => void;
  disabled?: boolean;
}

const thermicians = [
  {
    id: "tramitting",
    name: "Tramitting",
    description: "Solution complète pour les certificats énergétiques",
    status: "active",
    processingTime: "2-3 jours",
    clients: 1250,
    color: "bg-blue-500",
  },
  {
    id: "certipro",
    name: "CertiPro",
    description: "Expertise professionnelle en certification",
    status: "active",
    processingTime: "1-2 jours",
    clients: 890,
    color: "bg-purple-500",
  },
  {
    id: "energiecert",
    name: "EnergieCert",
    description: "Spécialiste des audits énergétiques",
    status: "active",
    processingTime: "3-4 jours",
    clients: 670,
    color: "bg-orange-500",
  },
];

const ThermicianSelector = ({ selectedThermician, onThermicianSelect, disabled = false }: ThermicianSelectorProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {thermicians.map((thermician) => (
        <Card
          key={thermician.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            disabled 
              ? "opacity-50 cursor-not-allowed" 
              : selectedThermician === thermician.id
                ? "ring-2 ring-green-500 bg-green-50"
                : "hover:bg-gray-50"
          }`}
          onClick={() => !disabled && onThermicianSelect(thermician.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${thermician.color} rounded-lg flex items-center justify-center`}>
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{thermician.name}</h3>
                  <p className="text-sm text-gray-600">{thermician.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {thermician.processingTime}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="h-3 w-3" />
                      {thermician.clients} clients
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {selectedThermician === thermician.id && !disabled && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                <Badge variant={thermician.status === "active" ? "default" : "secondary"}>
                  {thermician.status === "active" ? "Actif" : "Inactif"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ThermicianSelector;
