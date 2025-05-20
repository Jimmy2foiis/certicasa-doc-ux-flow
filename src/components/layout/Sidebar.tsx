
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  FileText, 
  GitBranch, 
  Receipt, 
  Settings, 
  HelpCircle 
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", value: "/" },
  { icon: Users, label: "Clientes", value: "/clients" },
  { icon: Calculator, label: "Cálculos", value: "/calculations" },
  { icon: FileText, label: "Documentos", value: "/documents" },
  { icon: GitBranch, label: "Flujo de trabajo", value: "/workflow" },
  { icon: Receipt, label: "Facturación", value: "/billing" },
  { icon: Settings, label: "Ajustes", value: "/settings" },
  { icon: HelpCircle, label: "Ayuda", value: "/help" },
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
