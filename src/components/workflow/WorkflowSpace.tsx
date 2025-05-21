
import React from "react";
import WorkflowManagement from "@/components/workflow/WorkflowManagement";

const WorkflowSpace = () => {
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Suivi de projet</h1>
      <WorkflowManagement />
    </div>
  );
};

export default WorkflowSpace;
