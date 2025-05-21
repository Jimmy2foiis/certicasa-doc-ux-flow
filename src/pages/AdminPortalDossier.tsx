
import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import DossierDetail from "@/components/admin/DossierDetail";

const AdminPortalDossier = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <DossierDetail />
        </main>
      </div>
    </div>
  );
};

export default AdminPortalDossier;
