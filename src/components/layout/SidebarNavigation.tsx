
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { navigationLinks } from "./navigationData";

const SidebarNavigation = () => {
  const location = useLocation();

  const isActiveLink = (url: string) => {
    return location.pathname === url;
  };

  return (
    <div className="flex flex-col gap-1 px-3 flex-1">
      {navigationLinks.map((link) => {
        const isActive = isActiveLink(link.url);
        return (
          <Button
            key={link.title}
            variant="ghost"
            asChild
            className={`justify-start font-medium h-12 px-4 text-sm w-full transition-colors ${
              isActive 
                ? "bg-green-50 text-green-700 hover:bg-green-100" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Link to={link.url} className="w-full">
              <link.icon className={`h-5 w-5 mr-3 flex-shrink-0 ${
                isActive ? "text-green-600" : "text-gray-500"
              }`} />
              <span className="truncate">{link.title}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
};

export default SidebarNavigation;
