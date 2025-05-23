
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientFilters } from "@/hooks/useClients";

interface ClientsFiltersProps {
  filters: ClientFilters;
  setFilters: (filters: ClientFilters) => void;
}

const ClientsFilters = ({ filters, setFilters }: ClientsFiltersProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleFilterChange = (key: keyof ClientFilters, value: string | null) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher par nom, email, NIF..."
            className="pl-9"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <Select
          value={filters.status || "all"}
          onValueChange={(value) => handleFilterChange("status", value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Statut dossier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Prêt à déposer">Prêt à déposer</SelectItem>
            <SelectItem value="Déposé">Déposé</SelectItem>
            <SelectItem value="Validé">Validé</SelectItem>
            <SelectItem value="Rejeté">Rejeté</SelectItem>
            <SelectItem value="Blocage">Blocage</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.ficheType || "all"}
          onValueChange={(value) => handleFilterChange("ficheType", value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Type fiche" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="RES010">RES010</SelectItem>
            <SelectItem value="RES020">RES020</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.climateZone || "all"}
          onValueChange={(value) => handleFilterChange("climateZone", value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Zone climatique" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
            <SelectItem value="D">D</SelectItem>
            <SelectItem value="E">E</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mt-4">
        <Select
          value={filters.isolationType || "all"}
          onValueChange={(value) => handleFilterChange("isolationType", value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Type d'isolation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="Combles">Combles</SelectItem>
            <SelectItem value="Rampants">Rampants</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.floorType || "all"}
          onValueChange={(value) => handleFilterChange("floorType", value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Type de plancher" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="Bois">Bois</SelectItem>
            <SelectItem value="Béton">Béton</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.depositStatus || "all"}
          onValueChange={(value) => handleFilterChange("depositStatus", value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Statut de dépôt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="Non déposé">Non déposé</SelectItem>
            <SelectItem value="Déposé">Déposé</SelectItem>
            <SelectItem value="Accepté">Accepté</SelectItem>
            <SelectItem value="Rejeté">Rejeté</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ClientsFilters;
