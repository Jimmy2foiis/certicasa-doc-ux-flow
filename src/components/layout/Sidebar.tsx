

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
import { Link } from "react-router-dom";
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

  const SidebarContent = () => (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-4">
        <div className="px-4 lg:px-6 pt-4 lg:pt-6">
          <h2 className="font-semibold text-base lg:text-lg">
            CertiCasa <span className="font-normal">Doc</span>
          </h2>
          <p className="text-xs lg:text-sm text-muted-foreground mt-1">
            Gérez vos prospects, projets et documents.
          </p>
        </div>
        <Separator />
        <div className="flex flex-col gap-1 px-2 lg:px-3">
          {navigationLinks.map((link) => (
            <Button
              key={link.title}
              variant="ghost"
              asChild
              className="justify-start font-normal h-10 px-3 text-sm w-full"
            >
              <Link to={link.url} className="w-full">
                <link.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="truncate">{link.title}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 pb-4 lg:pb-6 px-4 lg:px-6 mt-auto">
        <Separator />
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
            <AvatarImage src={workspace.logo} />
            <AvatarFallback className="text-xs lg:text-sm">
              {workspace.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-xs lg:text-sm min-w-0 flex-1">
            <span className="font-medium truncate">{workspace.name}</span>
            <span className="text-muted-foreground truncate">{workspace.type}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - hidden on mobile and small tablets */}
      <div className={`hidden lg:flex w-56 xl:w-64 bg-white border-r border-gray-200 flex-shrink-0 ${className}`}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - visible on mobile and tablets */}
      {showTrigger && (
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden fixed top-3 left-3 z-50 bg-white shadow-lg border h-10 w-10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 sm:w-80 p-0 border-r"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default Sidebar;

