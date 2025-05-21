
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateRange } from "../utils/planningUtils";
import { teams } from "../data/sampleData";

interface PlanningNavigationProps {
  date?: Date;
  view: "day" | "week" | "month" | "list";
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTeam: string;
  setSelectedTeam: (team: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  handlePreviousDay: () => void;
  handleNextDay: () => void;
}

const PlanningNavigation = ({
  date,
  view,
  searchQuery,
  setSearchQuery,
  selectedTeam,
  setSelectedTeam,
  selectedType,
  setSelectedType,
  handlePreviousDay,
  handleNextDay
}: PlanningNavigationProps) => {
  return (
    <div className="flex items-center justify-between mb-4 px-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handlePreviousDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium min-w-32 text-center">
          {formatDateRange(date, view)}
        </div>
        <Button variant="outline" size="icon" onClick={handleNextDay}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-9 pr-4 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select 
          value={selectedTeam} 
          onValueChange={setSelectedTeam}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Toutes les équipes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les équipes</SelectItem>
            {teams.map(team => (
              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={selectedType} 
          onValueChange={setSelectedType}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="installation">Installation</SelectItem>
            <SelectItem value="sav">SAV</SelectItem>
            <SelectItem value="measure">Mesures</SelectItem>
            <SelectItem value="visit">Visite</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlanningNavigation;
