
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
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {workspace.name}
          </h1>
          <Badge variant="secondary" className="text-xs">
            {workspace.type}
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          {/* Workspace switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Changer d'espace
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Espaces de travail</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaces.map((ws) => (
                <DropdownMenuItem 
                  key={ws.id}
                  onClick={() => setWorkspace(ws.id === "admin" ? "administrative" : "commercial")}
                  className={workspace.id === ws.id ? "bg-accent" : ""}
                >
                  {ws.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          {workspace.id === "admin" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <BellIcon className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start space-y-1">
                    <div className="font-medium">{notification.message}</div>
                    <div className="text-xs text-muted-foreground">{notification.time}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User avatar */}
          <Avatar>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
