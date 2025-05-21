import { Bell, Search, Settings, User, Building2, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { workspace, setWorkspace } = useWorkspace();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const workspaceLabels = {
    administrative: "Espace Administratif",
    commercial: "Espace Commercial / Terrain"
  };

  const handleWorkspaceChange = (newWorkspace) => {
    setWorkspace(newWorkspace);
    setIsDropdownOpen(false);
    navigate("/workflow");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        {workspace === "administrative" && (
          <>
            <h1 className="text-2xl font-semibold text-gray-800 mr-6">CertiCasa Doc</h1>
            <div className="relative max-w-xs hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-9 w-full md:w-64 rounded-md border-gray-300"
              />
            </div>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {/* Workspace Selector */}
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border border-gray-300 min-w-40 justify-between"
            >
              <div className="flex items-center gap-2">
                {workspace === "administrative" ? (
                  <FileSpreadsheet size={18} className="text-emerald-600" />
                ) : (
                  <Building2 size={18} className="text-indigo-600" />
                )}
                <span className="hidden md:inline">{workspaceLabels[workspace]}</span>
              </div>
              <span className="text-xs">▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem 
              className={`flex items-center gap-2 p-3 ${workspace === "administrative" ? "bg-gray-100" : ""}`}
              onClick={() => handleWorkspaceChange("administrative")}
            >
              <FileSpreadsheet size={18} className="text-emerald-600" />
              <div className="flex flex-col">
                <span className="font-medium">Espace Administratif</span>
                <span className="text-xs text-gray-500">Gestion documentaire, calculs, facturation</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={`flex items-center gap-2 p-3 ${workspace === "commercial" ? "bg-gray-100" : ""}`}
              onClick={() => handleWorkspaceChange("commercial")}
            >
              <Building2 size={18} className="text-indigo-600" />
              <div className="flex flex-col">
                <span className="font-medium">Espace Commercial / Terrain</span>
                <span className="text-xs text-gray-500">Pipeline, visites, planification</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {workspace === "administrative" && (
          <>
            <Button variant="ghost" size="icon">
              <Bell size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings size={20} />
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border border-gray-300"
            >
              <User size={18} />
              <span className="hidden md:inline">Mon Compte</span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
