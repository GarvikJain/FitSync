import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import WellnessPage from "./pages/WellnessPage";
import HealthPage from "./pages/HealthPage";
import AssistantPage from "./pages/AssistantPage";
import MusicPage from "./pages/MusicPage";
import GamesPage from "./pages/GamesPage";
import RewardsPage from "./pages/RewardsPage";
import NewsPage from "./pages/NewsPage";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import SheShinesPage from "./pages/SheShinesPage";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<DashboardPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="wellness" element={<WellnessPage />} />
                <Route path="health" element={<HealthPage />} />
                <Route path="assistant" element={<AssistantPage />} />
                <Route path="music" element={<MusicPage />} />
                <Route path="games" element={<GamesPage />} />
                <Route path="rewards" element={<RewardsPage />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="she-shines" element={<SheShinesPage />} />
              </Route>
              <Route path="/auth-success" element={<AuthCallback />} />
              <Route path="/auth-error" element={<AuthCallback />} />
              <Route path="/auth/google/callback" element={<AuthCallback />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
