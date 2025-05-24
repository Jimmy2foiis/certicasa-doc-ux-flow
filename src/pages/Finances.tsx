
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
            <FinancesModule />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FinancesPage;
