
import ProjectCalculation from "@/components/calculations/ProjectCalculation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const Calculations = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Calcul Thermique</h1>
          <ProjectCalculation />
        </main>
      </div>
    </div>
  );
};

export default Calculations;
