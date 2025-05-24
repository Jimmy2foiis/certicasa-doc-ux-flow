
import { BellIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/context/WorkspaceContext";

const Header = () => {
  const { workspace, setWorkspace } = useWorkspace();

  const notifications = [
    {
      id: 1,
      message: "Nouveau dossier prêt pour validation",
      type: "info",
      time: "Il y a 5 min",
    },
    {
      id: 2,
      message: "3 dossiers en attente de signature",
      type: "warning", 
      time: "Il y a 1h",
    },
  ];

  const workspaces = [
    { id: "admin", name: "CertiCasa Doc", type: "Administration" },
    { id: "commercial", name: "CertiCasa Commercial", type: "Commercial" },
  ];

  const toggleWorkspace = () => {
    if (workspace.id === "admin") {
      setWorkspace("commercial");
    } else {
      setWorkspace("administrative");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - workspace info with proper spacing for mobile menu */}
        <div className="flex items-center space-x-3 min-w-0 flex-1 lg:ml-0 ml-16">
          <h1 className="text-xl font-semibold text-gray-900 truncate">
            {workspace.name}
          </h1>
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 hidden sm:inline-flex">
            {workspace.type}
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          {/* Workspace switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-sm px-3 border-gray-300 hover:bg-gray-50">
                <span className="hidden sm:inline">Changer d'espace</span>
                <span className="sm:hidden">Espace</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
              <DropdownMenuLabel className="text-gray-900">Espaces de travail</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaces.map((ws) => (
                <DropdownMenuItem 
                  key={ws.id}
                  onClick={() => setWorkspace(ws.id === "admin" ? "administrative" : "commercial")}
                  className={`${workspace.id === ws.id ? "bg-green-50 text-green-700" : "text-gray-700"} hover:bg-gray-50`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{ws.name}</span>
                    <span className="text-xs text-gray-500">{ws.type}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          {workspace.id === "admin" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9 hover:bg-gray-100">
                  <BellIcon className="h-5 w-5 text-gray-600" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-green-500 hover:bg-green-600">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200 shadow-lg">
                <DropdownMenuLabel className="text-gray-900">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start space-y-1 p-3 hover:bg-gray-50">
                    <div className="font-medium text-sm text-gray-900">{notification.message}</div>
                    <div className="text-xs text-gray-500">{notification.time}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User avatar */}
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-sm bg-green-100 text-green-700">U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
