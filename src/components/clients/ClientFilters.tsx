
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown } from "lucide-react";

interface ClientFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ClientFilters = ({ searchTerm, onSearchChange }: ClientFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher un client..."
          className="pl-9 w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              Statut
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Tous</DropdownMenuItem>
            <DropdownMenuItem>Actifs</DropdownMenuItem>
            <DropdownMenuItem>Inactifs</DropdownMenuItem>
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
            <DropdownMenuItem>Toutes</DropdownMenuItem>
            <DropdownMenuItem>Madrid</DropdownMenuItem>
            <DropdownMenuItem>Barcelone</DropdownMenuItem>
            <DropdownMenuItem>Valence</DropdownMenuItem>
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
            <DropdownMenuItem>Tous</DropdownMenuItem>
            <DropdownMenuItem>RES010</DropdownMenuItem>
            <DropdownMenuItem>RES020</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ClientFilters;
