
import {
  Home,
  Users,
  Coins,
  Package,
  FileText,
  Settings,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

export interface NavLink {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const navigationLinks: NavLink[] = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: Home,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Finances",
    url: "/finances",
    icon: Coins,
  },
  {
    title: "Dépôt de Lots",
    url: "/lots",
    icon: Package,
  },
  {
    title: "Templates",
    url: "/documents",
    icon: FileText,
  },
  {
    title: "Paramètres",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Aide",
    url: "/help",
    icon: HelpCircle,
  },
];
