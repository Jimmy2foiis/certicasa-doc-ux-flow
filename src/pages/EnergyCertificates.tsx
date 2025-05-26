
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import GlobalTabNavigation from "@/components/layout/GlobalTabNavigation";
import EnergyCertificatesLayout from "@/components/energy-certificates/EnergyCertificatesLayout";
import SendPage from "@/components/energy-certificates/SendPage";
import TrackingPage from "@/components/energy-certificates/TrackingPage";

const EnergyCertificates = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <GlobalTabNavigation />
        <EnergyCertificatesLayout>
          <Routes>
            <Route path="envoi" element={<SendPage />} />
            <Route path="suivi" element={<TrackingPage />} />
            <Route path="*" element={<Navigate to="envoi" replace />} />
          </Routes>
        </EnergyCertificatesLayout>
      </div>
    </div>
  );
};

export default EnergyCertificates;
