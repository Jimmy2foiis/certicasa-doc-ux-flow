
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  FileText, 
  GitBranch, 
  Receipt, 
  Settings, 
  HelpCircle,
  Package,
  Upload,
  Shield
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", value: "/" },
  { icon: Users, label: "Clients", value: "/clients" },
  { icon: Calculator, label: "Calculs", value: "/calculations" },
  { icon: FileText, label: "Documents", value: "/documents" },
  { icon: GitBranch, label: "Suivi de projet", value: "/workflow" },
  { icon: Shield, label: "Portail Admin", value: "/admin" },
  { icon: Upload, label: "Dépôts des Lots", value: "/lots" },
  { icon: Package, label: "Produits & Stock", value: "/products" },
  { icon: Receipt, label: "Facturation", value: "/billing" },
  { icon: Settings, label: "Paramètres", value: "/settings" },
  { icon: HelpCircle, label: "Aide", value: "/help" },
];

const Sidebar = () => {
  return (
    <aside className="bg-white border-r border-gray-200 w-16 md:w-64 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="h-8 w-8 md:h-10 md:w-10 bg-emerald-500 text-white rounded flex items-center justify-center font-bold text-xl">
          C
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.value}>
              <NavLink
                to={item.value}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                    "transition-colors duration-200",
                    isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )
                }
                end={item.value === "/"} // Pour éviter que le lien racine soit toujours actif
              >
                <item.icon className="h-5 w-5 mr-2 md:mr-3 flex-shrink-0" />
                <span className="hidden md:inline">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
