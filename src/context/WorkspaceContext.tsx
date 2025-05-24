
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define workspace object with all necessary properties
interface WorkspaceData {
  id: string;
  name: string;
  type: string;
  logo?: string;
}

// Define the available workspaces in the application
export type Workspace = "administrative" | "commercial";

interface WorkspaceContextType {
  workspace: WorkspaceData;
  setWorkspace: (workspace: Workspace) => void;
}

const workspaceData: Record<Workspace, WorkspaceData> = {
  administrative: {
    id: "admin",
    name: "CertiCasa Doc",
    type: "Administration",
    logo: undefined
  },
  commercial: {
    id: "commercial",
    name: "CertiCasa Commercial",
    type: "Commercial",
    logo: undefined
  }
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  // Default to administrative workspace
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>("administrative");

  const setWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  };

  return (
    <WorkspaceContext.Provider value={{ 
      workspace: workspaceData[currentWorkspace], 
      setWorkspace 
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
