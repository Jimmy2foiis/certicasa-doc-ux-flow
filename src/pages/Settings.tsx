
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/components/settings/ProfileTab";
import CompanyTab from "@/components/settings/CompanyTab";
import MaterialsAndProductsSection from "@/components/settings/MaterialsAndProductsSection";
import NotificationsTab from "@/components/settings/NotificationsTab";
import SecurityTab from "@/components/settings/SecurityTab";
import TemplatesTab from "@/components/settings/TemplatesTab";

const Settings = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Paramètres</h1>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6 bg-white p-1 shadow-sm rounded-md">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="company">Entreprise</TabsTrigger>
                <TabsTrigger value="materials">Matériaux & Produits</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <ProfileTab />
              </TabsContent>
              
              <TabsContent value="company">
                <CompanyTab />
              </TabsContent>
              
              <TabsContent value="materials">
                <MaterialsAndProductsSection />
              </TabsContent>
              
              <TabsContent value="templates">
                <TemplatesTab />
              </TabsContent>
              
              <TabsContent value="notifications">
                <NotificationsTab />
              </TabsContent>
              
              <TabsContent value="security">
                <SecurityTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
