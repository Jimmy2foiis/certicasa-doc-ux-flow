
import Sidebar from "@/components/layout/Sidebar";
import GlobalTabNavigation from "@/components/layout/GlobalTabNavigation";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <GlobalTabNavigation />
        <div className="flex-1 p-6">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default Index;
