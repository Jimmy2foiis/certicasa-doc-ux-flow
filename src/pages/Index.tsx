
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Dashboard from '@/components/dashboard/Dashboard';
import ClientsSection from '@/components/clients/ClientsSection';
import ProjectCalculation from '@/components/calculations/ProjectCalculation';
import DocumentGeneration from '@/features/documents/DocumentGeneration';
import Billing from '@/components/billing/Billing';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Synchroniser l'onglet actif avec la route actuelle
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  // Gérer le changement d'onglet et mettre à jour l'URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Rediriger vers la page correspondante pour les onglets qui ont leurs propres pages
    switch (value) {
      case 'clients':
        navigate('/clients');
        break;
      case 'finances':
        navigate('/finances');
        break;
      case 'calculettes':
        navigate('/calculations');
        break;
      case 'templates':
        navigate('/documents');
        break;
      default:
        // Rester sur la page d'accueil pour le tableau de bord
        break;
    }
  };

  // Fonction pour naviguer vers la liste complète des projets
  const handleViewAllProjects = () => {
    navigate('/projects');
  };

  // Fonction pour naviguer vers le détail d'un projet
  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-6 bg-white p-1 shadow-sm rounded-md">
              <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="finances">Finances</TabsTrigger>
              <TabsTrigger value="calculettes">Calculettes</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>
            <TabsContent value="clients">
              <ClientsSection />
            </TabsContent>
            <TabsContent value="finances">
              <Billing />
            </TabsContent>
            <TabsContent value="calculettes">
              <ProjectCalculation />
            </TabsContent>
            <TabsContent value="templates">
              <DocumentGeneration />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
