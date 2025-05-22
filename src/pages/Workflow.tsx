
import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import WorkflowSpace from "@/components/workflow/WorkflowSpace";
import CommercialSpace from "@/components/commercial/CommercialSpace";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Building2, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Workflow = () => {
  const { workspace, setWorkspace } = useWorkspace();
  const { toast } = useToast();

  const toggleWorkspace = () => {
    const newWorkspace = workspace === "administrative" ? "commercial" : "administrative";
    setWorkspace(newWorkspace);
    toast({
      title: `Espace ${newWorkspace === "administrative" ? "Administratif" : "Commercial"} activé`,
      description: `Vous êtes maintenant dans l'espace ${newWorkspace === "administrative" ? "administratif" : "commercial"}.`,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {workspace === "administrative" ? (
        <>
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <div className="flex justify-end p-4">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={toggleWorkspace}
                >
                  <Building2 className="h-4 w-4" />
                  Passer à l'espace commercial
                </Button>
              </div>
              <WorkflowSpace />
            </main>
          </div>
        </>
      ) : (
        <>
          <CommercialSpace />
          <div className="fixed bottom-4 right-4 z-50">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 shadow-lg"
              onClick={toggleWorkspace}
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Passer à l'espace administratif
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Workflow;
