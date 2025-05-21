
import React from "react";
import {
  User,
  CheckSquare,
  Calendar,
  Users,
  Gift,
  Package,
  Settings,
  BookOpen,
  HelpCircle,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

const sidebarItems = [
  { id: "lead", label: "Lead", icon: User },
  { id: "qualification", label: "Qualification Commerciale", icon: CheckSquare },
  { id: "planning", label: "Confirmation & Planification", icon: Calendar },
  { id: "pose", label: "VT & Pose", icon: Building2 },
  { id: "parrainage", label: "Parrainage", icon: Gift },
  { id: "products", label: "Produits & Stocks", icon: Package },
  { id: "settings", label: "Paramètre", icon: Settings },
  { id: "training", label: "Outils de formation", icon: BookOpen },
  { id: "help", label: "Aide", icon: HelpCircle },
];

const CommercialSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = React.useState("lead");

  React.useEffect(() => {
    // Extraire l'ID actif de l'URL si présent
    const path = location.pathname;
    const segments = path.split("/");
    const lastSegment = segments[segments.length - 1];
    
    // Si on trouve un ID correspondant dans nos items, on l'active
    const foundItem = sidebarItems.find(item => item.id === lastSegment);
    if (foundItem) {
      setActiveItem(foundItem.id);
    } else {
      setActiveItem("lead"); // Par défaut
    }
  }, [location]);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    navigate(`/workflow/${itemId}`);
  };

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200">
      <div className="py-4">
        <h2 className="px-4 text-lg font-semibold text-gray-700 mb-4">
          ESPACE COMMERCIALE
        </h2>
        <nav className="mt-2">
          <ul className="space-y-1 px-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={cn(
                    "flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                    activeItem === item.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default CommercialSidebar;
