
import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import DocumentGeneration from "@/components/documents/DocumentGeneration";

const Documents = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Documents</h1>
          <DocumentGeneration />
        </main>
      </div>
    </div>
  );
};

export default Documents;
