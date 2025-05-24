
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
    <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
            {workspace.name}
          </h1>
          <Badge variant="secondary" className="text-xs hidden xs:inline-flex">
            {workspace.type}
          </Badge>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Workspace switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                <span className="hidden sm:inline">Changer d'espace</span>
                <span className="sm:hidden">Espace</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-auto">
              <DropdownMenuLabel>Espaces de travail</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaces.map((ws) => (
                <DropdownMenuItem 
                  key={ws.id}
                  onClick={() => setWorkspace(ws.id === "admin" ? "administrative" : "commercial")}
                  className={workspace.id === ws.id ? "bg-accent" : ""}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{ws.name}</span>
                    <span className="text-xs text-muted-foreground">{ws.type}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          {workspace.id === "admin" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 sm:h-9 sm:w-9">
                  <BellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 sm:w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start space-y-1 p-3">
                    <div className="font-medium text-sm">{notification.message}</div>
                    <div className="text-xs text-muted-foreground">{notification.time}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User avatar */}
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
            <AvatarFallback className="text-xs sm:text-sm">U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
