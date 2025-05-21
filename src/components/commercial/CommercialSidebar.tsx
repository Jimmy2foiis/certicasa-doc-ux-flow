
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface CommercialSidebarProps {
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

const CommercialSidebar: React.FC<CommercialSidebarProps> = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { id: "leads", label: "Leads", description: "Gestion des leads et prospects" },
    { id: "qualification", label: "Qualification", description: "Qualification des projets" },
    { id: "planning", label: "Planning", description: "Planification des rendez-vous" },
    { id: "suivi", label: "Suivi", description: "Suivi des projets" },
    { id: "facturation", label: "Facturation", description: "Gestion de la facturation" },
    { id: "products", label: "Produits", description: "Catalogue de produits" },
    { id: "pose", label: "Pose", description: "Gestion des installations" },
    { id: "parrainage", label: "Parrainage", description: "Programme de parrainage" },
    { id: "formation", label: "Formation", description: "Modules de formation" },
    { id: "parametres", label: "Paramètres", description: "Configuration du compte" },
    { id: "aide", label: "Aide", description: "Centre d'aide et support" }
  ];

  const handleMenuItemClick = (itemId: string) => {
    if (setActiveSection) {
      setActiveSection(itemId);
    } else {
      // Using react-router for navigation
      navigate(`/workflow/${itemId}`);
    }
  };

  // Determine active item based on current location if activeSection is not provided
  const currentActive = activeSection || location.pathname.split('/').pop() || 'leads';

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-4 border-b border-gray-200">
        <div className="text-xl font-bold text-gray-900">ESPACE COMMERCIAL</div>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleMenuItemClick(item.id)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  currentActive === item.id
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                title={item.description}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default CommercialSidebar;
