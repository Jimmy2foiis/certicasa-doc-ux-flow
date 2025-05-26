
import { Routes, Route, Navigate } from "react-router-dom";
import EnergyCertificatesLayout from "@/components/energy-certificates/EnergyCertificatesLayout";
import SendPage from "@/components/energy-certificates/SendPage";
import TrackingPage from "@/components/energy-certificates/TrackingPage";

const EnergyCertificates = () => {
  return (
    <EnergyCertificatesLayout>
      <Routes>
        <Route path="envoi" element={<SendPage />} />
        <Route path="suivi" element={<TrackingPage />} />
        <Route path="*" element={<Navigate to="envoi" replace />} />
      </Routes>
    </EnergyCertificatesLayout>
  );
};

export default EnergyCertificates;
