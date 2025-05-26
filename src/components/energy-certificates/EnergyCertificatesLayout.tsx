
import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Search } from "lucide-react";

interface EnergyCertificatesLayoutProps {
  children: ReactNode;
}

const EnergyCertificatesLayout = ({ children }: EnergyCertificatesLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/envoi')) return 'envoi';
    if (path.includes('/suivi')) return 'suivi';
    return 'envoi';
  };

  const handleTabChange = (value: string) => {
    navigate(`/certificats-energetiques/${value}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Certificats Énergétiques</h1>
            <p className="mt-2 text-gray-600">
              Gérez l'envoi et le suivi de vos certificats énergétiques
            </p>
          </div>
          <Tabs value={getActiveTab()} onValueChange={handleTabChange}>
            <TabsList className="bg-transparent p-0 h-12 border-none">
              <TabsTrigger 
                value="envoi" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none px-6 h-12 flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Envoi
              </TabsTrigger>
              <TabsTrigger 
                value="suivi"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none px-6 h-12 flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Suivi
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
};

export default EnergyCertificatesLayout;
