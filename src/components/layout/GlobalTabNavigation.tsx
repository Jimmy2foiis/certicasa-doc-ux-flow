
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

  return (
    <div className="border-b bg-white sticky top-16 z-40">
      <div className="px-4">
        <Tabs value={getActiveTab()} onValueChange={handleTabChange}>
          <TabsList className="bg-transparent p-0 h-12 w-full justify-start border-none">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none px-6 h-12"
            >
              Tableau de bord
            </TabsTrigger>
            <TabsTrigger 
              value="clients"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none px-6 h-12"
            >
              Clients
            </TabsTrigger>
            <TabsTrigger 
              value="certificates"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none px-6 h-12"
            >
              Certificat Energetique
            </TabsTrigger>
            <TabsTrigger 
              value="finances"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none px-6 h-12"
            >
              Finances
            </TabsTrigger>
            <TabsTrigger 
              value="lots"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none px-6 h-12"
            >
              Dépôt de Lots
            </TabsTrigger>
            <TabsTrigger 
              value="templates"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none px-6 h-12"
            >
              Templates
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default GlobalTabNavigation;
