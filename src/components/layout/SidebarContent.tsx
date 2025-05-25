

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWorkspace } from "@/context/WorkspaceContext";
import SidebarNavigation from "./SidebarNavigation";

const SidebarContent = () => {
  const { workspace } = useWorkspace();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex flex-col gap-4 flex-1">
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/c74bbb7a-efc5-4bed-a654-08e9efa54e8c.png" 
                alt="CertiCasa Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-gray-900">
                CertiCasa <span className="font-normal">Doc</span>
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Gérez vos prospects, projets et documents.
              </p>
            </div>
          </div>
        </div>
        
        <Separator className="mx-4" />
        
        <SidebarNavigation />
      </div>

      <div className="flex flex-col gap-3 pb-6 px-4 mt-auto">
        <Separator />
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={workspace.logo} />
            <AvatarFallback className="text-sm bg-green-100 text-green-700">
              {workspace.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm min-w-0 flex-1">
            <span className="font-medium truncate text-gray-900">{workspace.name}</span>
            <span className="text-gray-600 truncate">{workspace.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarContent;

