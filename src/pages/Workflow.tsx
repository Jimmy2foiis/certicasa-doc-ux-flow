
import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { PlanningCalendar } from "@/components/workflow/PlanningCalendar";

const Workflow = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <PlanningCalendar />
        </main>
      </div>
    </div>
  );
};

export default Workflow;
