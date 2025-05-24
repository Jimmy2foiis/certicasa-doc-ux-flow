
import {
  Home,
  LayoutDashboard,
  ListChecks,
  LucideIcon,
  Settings,
  Users,
  FileText,
  ScrollText,
  Coins,
  HelpCircle,
  Building2,
  KanbanSquare,
  Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWorkspace } from "@/context/WorkspaceContext";

interface NavLink {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface SidebarProps {
  showTrigger?: boolean;
  className?: string;
}

const Sidebar = ({ showTrigger = true, className = "" }: SidebarProps) => {
  const { workspace } = useWorkspace();
  const location = useLocation();

  const navigationLinks = [
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Lots",
      url: "/lots",
      icon: LayoutDashboard,
    },
    {
      title: "Prospects",
      url: "/clients",
      icon: Users,
    },
    {
      title: "Projets",
      url: "/projects",
      icon: Building2,
    },
    {
      title: "Calculs",
      url: "/calculations",
      icon: ListChecks,
    },
    {
      title: "Documents",
      url: "/documents",
      icon: FileText,
    },
    {
      title: "Workflow",
      url: "/workflow",
      icon: KanbanSquare,
    },
    {
      title: "Finances",
      url: "/finances",
      icon: Coins,
    },
    {
      title: "Aide",
      url: "/help",
      icon: HelpCircle,
    },
    {
      title: "Paramètres",
      url: "/settings",
      icon: Settings,
    },
  ];

  const isActiveLink = (url: string) => {
    if (url === "/dashboard" && location.pathname === "/") return true;
    return location.pathname === url;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="flex flex-col gap-4 flex-1">
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <h2 className="font-semibold text-lg text-gray-900">
                CertiCasa <span className="font-normal">Doc</span>
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Gérez vos prospects, projets et documents.
              </p>
            </div>
          </div>
        </div>
        
        <Separator className="mx-4" />
        
        <div className="flex flex-col gap-1 px-3 flex-1">
          {navigationLinks.map((link) => {
            const isActive = isActiveLink(link.url);
            return (
              <Button
                key={link.title}
                variant="ghost"
                asChild
                className={`justify-start font-medium h-12 px-4 text-sm w-full transition-colors ${
                  isActive 
                    ? "bg-green-50 text-green-700 hover:bg-green-100" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Link to={link.url} className="w-full">
                  <link.icon className={`h-5 w-5 mr-3 flex-shrink-0 ${
                    isActive ? "text-green-600" : "text-gray-500"
                  }`} />
                  <span className="truncate">{link.title}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-6 px-4 mt-auto">
        <Separator />
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={workspace.logo} />
            <AvatarFallback className="text-sm bg-green-100 text-green-700">
              {workspace.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm min-w-0 flex-1">
            <span className="font-medium truncate text-gray-900">{workspace.name}</span>
            <span className="text-gray-600 truncate">{workspace.type}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex w-64 bg-white border-r border-gray-200 flex-shrink-0 ${className}`}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {showTrigger && (
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg border h-10 w-10 hover:bg-gray-50"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 p-0 border-r bg-white"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default Sidebar;
