
import { Bell, Search, Settings, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold text-gray-800 mr-6">CertiCasa Doc</h1>
        <div className="relative max-w-xs hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="pl-9 w-full md:w-64 rounded-md border-gray-300"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings size={20} />
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border border-gray-300"
        >
          <User size={18} />
          <span className="hidden md:inline">Mon Compte</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
