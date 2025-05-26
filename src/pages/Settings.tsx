
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import BeetoolTokenInput from "@/components/settings/BeetoolTokenInput";

const Settings = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Paramètres</h1>
              <p className="text-gray-500">
                Configuration de l'application et des intégrations API
              </p>
            </div>
            
            <BeetoolTokenInput />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
