
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClientFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ClientFilters = ({ searchTerm, onSearchChange }: ClientFiltersProps) => {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);

  const clearSearch = () => {
    onSearchChange("");
  };

  const clearFilters = () => {
    setStatus(undefined);
    setCity(undefined);
    setType(undefined);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un client..."
            className="pl-9 w-full max-w-sm pr-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-2.5"
              aria-label="Effacer la recherche"
            >
              <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Statut
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
                <DropdownMenuRadioItem value="all">Tous</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Actif">Actifs</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Inactif">Inactifs</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Ville
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={city} onValueChange={setCity}>
                <DropdownMenuRadioItem value="all">Toutes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Madrid">Madrid</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Barcelone">Barcelone</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Valence">Valence</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Type
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={type} onValueChange={setType}>
                <DropdownMenuRadioItem value="all">Tous</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="RES010">RES010</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="RES020">RES020</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {(status || city || type) && (
        <div className="flex flex-wrap gap-2 pt-2">
          {status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Statut: {status === "all" ? "Tous" : status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setStatus(undefined)} 
              />
            </Badge>
          )}
          {city && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Ville: {city === "all" ? "Toutes" : city}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setCity(undefined)} 
              />
            </Badge>
          )}
          {type && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {type === "all" ? "Tous" : type}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setType(undefined)} 
              />
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-xs h-7"
          >
            Effacer tous les filtres
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClientFilters;
