
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useWorkspace } from "@/context/WorkspaceContext";

const AdminPortal = () => {
  const { workspace } = useWorkspace();
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;
