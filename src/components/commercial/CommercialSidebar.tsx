import React from "react";
import { Link, useLocation } from "react-router-dom";

const CommercialSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/commercial/leads",
      label: "Leads",
      description: "Gestion des leads et prospects"
    },
    {
      path: "/commercial/qualification",
      label: "Qualification",
      description: "Qualification des projets"
    },
    {
      path: "/commercial/planning",
      label: "Planning",
      description: "Planification des rendez-vous"
    },
    {
      path: "/commercial/suivi",
      label: "Suivi",
      description: "Suivi des projets"
    },
    {
      path: "/commercial/facturation",
      label: "Facturation",
      description: "Gestion de la facturation"
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-4 border-b border-gray-200">
        <div className="text-xl font-bold text-gray-900">ESPACE COMMERCIALE</div>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-4 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                title={item.description}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default CommercialSidebar;
