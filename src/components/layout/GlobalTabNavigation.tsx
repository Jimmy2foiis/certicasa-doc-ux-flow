import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
const GlobalTabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Déterminer l'onglet actif basé sur la route actuelle
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path.startsWith('/clients')) return 'clients';
    if (path.startsWith('/certificats-energetiques')) return 'certificates';
    if (path.startsWith('/finances')) return 'finances';
    if (path.startsWith('/lots')) return 'lots';
    if (path.startsWith('/documents')) return 'templates';
    return 'dashboard';
  };
  const handleTabChange = (value: string) => {
    switch (value) {
      case 'dashboard':
        navigate('/');
        break;
      case 'clients':
        navigate('/clients');
        break;
      case 'certificates':
        navigate('/certificats-energetiques/envoi');
        break;
      case 'finances':
        navigate('/finances');
        break;
      case 'lots':
        navigate('/lots');
        break;
      case 'templates':
        navigate('/documents');
        break;
      default:
        navigate('/');
        break;
    }
  };
  return <div className="border-b bg-white sticky top-16 z-40">
      
    </div>;
};
export default GlobalTabNavigation;