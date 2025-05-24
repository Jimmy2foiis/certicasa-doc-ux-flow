
import {
  Home,
  Users,
  Coins,
  Calculator,
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
    url: "/dashboard",
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
    title: "Calculettes",
    url: "/calculations",
    icon: Calculator,
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
