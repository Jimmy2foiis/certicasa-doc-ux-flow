
import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import FinancesModule from "@/components/finances/FinancesModule";

const FinancesPage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-gray-900">Finances</h1>
            <FinancesModule />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FinancesPage;
