
import React from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const ProjectDetails = () => {
  const { id } = useParams();
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Détail du Projet: {id}</h1>
          <p className="text-gray-600">
            Affichage de toutes les informations, documents, tâches et historique du projet sélectionné.
          </p>
          
          {/* Contenu détaillé du projet à implémenter */}
        </main>
      </div>
    </div>
  );
};

export default ProjectDetails;
