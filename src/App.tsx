import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import TestLandingPage from "./pages/TestLandingPage";
import TechnicalPage from "./pages/TechnicalPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import CompaniesPage from "./pages/CompaniesPage";
import StrategyPage from "./pages/StrategyPage";
import EmailPage from "./pages/EmailPage";
import ImportPage from "./pages/ImportPage";
import EventsPage from "./pages/EventsPage";
import PeoplePage from "./pages/PeoplePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/" || location.pathname === "/old-landing";

  if (isLandingPage && location.pathname === "/") {
    return <TestLandingPage />;
  }
  
  if (location.pathname === "/old-landing") {
    return <LandingPage />;
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/strategy" element={<StrategyPage />} />
            <Route path="/email" element={<EmailPage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<TestLandingPage />} />
            <Route path="/old-landing" element={<LandingPage />} />
            <Route path="/technical_stuff" element={<TechnicalPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
