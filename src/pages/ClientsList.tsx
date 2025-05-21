
import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const ClientsList = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Gestion des Clients</h1>
          <p className="text-gray-600">Interface pour lister, ajouter, modifier et consulter les fiches clients.</p>
          
          {/* Contenu de la page clients à implémenter */}
        </main>
      </div>
    </div>
  );
};

export default ClientsList;
