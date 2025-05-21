
import { useState } from "react";
import { useLocation } from "react-router-dom";

export const usePlanningFilters = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const location = useLocation();
  
  // Get client ID from query params if it exists
  const queryParams = new URLSearchParams(location.search);
  const clientIdParam = queryParams.get('clientId');
  
  return {
    searchQuery,
    setSearchQuery,
    selectedTeam,
    setSelectedTeam,
    selectedType,
    setSelectedType,
    clientIdParam
  };
};
