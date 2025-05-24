
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import SidebarContent from "./SidebarContent";

interface SidebarProps {
  showTrigger?: boolean;
  className?: string;
}

const Sidebar = ({ showTrigger = true, className = "" }: SidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex w-64 bg-white border-r border-gray-200 flex-shrink-0 ${className}`}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {showTrigger && (
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg border h-10 w-10 hover:bg-gray-50"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 p-0 border-r bg-white"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default Sidebar;
