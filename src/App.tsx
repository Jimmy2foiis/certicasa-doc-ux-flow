
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Lots from "./pages/Lots";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Calculations from "./pages/Calculations";
import Clients from "./pages/Clients";
import Documents from "./pages/Documents";
import Workflow from "./pages/Workflow";
import Billing from "./pages/Billing";
import Help from "./pages/Help";
import CommercialSpace from "./components/commercial/CommercialSpace";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WorkspaceProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lots" element={<Lots />} />
          <Route path="/products" element={<Products />} />
          <Route path="/calculations" element={<Calculations />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/workflow/*" element={<Workflow />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/help" element={<Help />} />
          {/* Commercial space routes */}
          <Route path="/commercial/*" element={<CommercialSpace />} />
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </WorkspaceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
