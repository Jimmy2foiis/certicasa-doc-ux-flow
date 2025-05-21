
import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import WorkflowSpace from "@/components/workflow/WorkflowSpace";
import CommercialSpace from "@/components/commercial/CommercialSpace";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Routes, Route } from "react-router-dom";

const Workflow = () => {
  const { workspace } = useWorkspace();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {workspace === "administrative" ? (
            <WorkflowSpace />
          ) : (
            <Routes>
              <Route path="/*" element={<CommercialSpace />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
};

export default Workflow;
