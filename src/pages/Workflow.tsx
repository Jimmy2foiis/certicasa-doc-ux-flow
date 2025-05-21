
import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import WorkflowSpace from "@/components/workflow/WorkflowSpace";
import CommercialSpace from "@/components/commercial/CommercialSpace";
import { useWorkspace } from "@/context/WorkspaceContext";

const Workflow = () => {
  const { workspace } = useWorkspace();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          {workspace === "administrative" ? (
            <WorkflowSpace />
          ) : (
            <CommercialSpace />
          )}
        </main>
      </div>
    </div>
  );
};

export default Workflow;
