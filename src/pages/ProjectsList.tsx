
import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const ProjectsList = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Liste Complète des Projets</h1>
          <p className="text-gray-600">
            Affichage de tous les projets avec options de pagination, de recherche et de filtrage avancées.
          </p>
          
          {/* Liste complète des projets à implémenter */}
        </main>
      </div>
    </div>
  );
};

export default ProjectsList;
