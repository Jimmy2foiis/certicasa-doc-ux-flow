
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
        <div className="px-6 pt-6">
          <h2 className="font-semibold text-lg">
            CertiCasa <span className="font-normal">Doc</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Gérez vos prospects, projets et documents.
          </p>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 px-3">
          {navigationLinks.map((link) => (
            <Button
              key={link.title}
              variant="ghost"
              asChild
              className="justify-start font-normal"
            >
              <Link to={link.url} className="w-full">
                <link.icon className="h-4 w-4 mr-2" />
                {link.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 pb-6 px-6 mt-auto">
        <Separator />
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={workspace.logo} />
            <AvatarFallback>{workspace.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span className="font-medium">{workspace.name}</span>
            <span className="text-muted-foreground">{workspace.type}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex w-64 bg-white border-r border-gray-200 ${className}`}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {showTrigger && (
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 flex flex-col justify-between p-0"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default Sidebar;
