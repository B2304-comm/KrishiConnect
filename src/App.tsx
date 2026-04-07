import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import AdminDemoRequests from "./pages/AdminDemoRequests";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";
import SubsidySchemes from "./pages/SubsidySchemes";
import PriceList from "./pages/PriceList";
import UserGuide from "./pages/UserGuide";
import GovernmentDashboard from "./pages/GovernmentDashboard";
import ReportIssue from "./pages/ReportIssue";
import ContactUs from "./pages/ContactUs";
import CropPrediction from "./pages/CropPrediction";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/demo-requests" element={<AuthGuard><AdminDemoRequests /></AuthGuard>} />
          <Route path="/subsidy-schemes" element={<SubsidySchemes />} />
          <Route path="/price-list" element={<PriceList />} />
          <Route path="/user-guide" element={<UserGuide />} />
          <Route path="/government-dashboard" element={<GovernmentDashboard />} />
          <Route path="/report-issue" element={<ReportIssue />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/crop-prediction" element={<AuthGuard><CropPrediction /></AuthGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
