import UserProfile from "@/components/UserProfile";
import WellnessStats from "@/components/WellnessStats";
import HealthMetrics from "@/components/HealthMetrics";
import MusicHub from "@/components/MusicHub";
import GamesSection from "@/components/GamesSection";
import RewardsSection from "@/components/RewardsSection";
import NewsSection from "@/components/NewsSection";
import HealthAssistant from "@/components/HealthAssistant";
import GoogleFitWidget from "@/components/GoogleFitWidget";
import { AuthButtons } from "@/components/AuthButtons";
import { useAuthContext } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, isAuthenticated } = useAuthContext();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
                      <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h1 className="text-2xl font-bold text-wellness-primary">WellnessHub</h1>
                <nav className="flex items-center gap-4">
                  <Link 
                    to="/she-shines" 
                    className="text-sm font-medium text-muted-foreground hover:text-wellness-primary transition-colors flex items-center gap-2"
                  >
                    <span>🌸</span>
                    She Shines
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {isAuthenticated 
                    ? `Welcome back, ${user?.displayName || 'User'}! 🌟`
                    : 'Welcome to WellnessHub! 🌟'
                  }
                </div>
                <AuthButtons />
              </div>
            </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - User Profile & Calendar */}
          <div className="lg:col-span-3">
            <UserProfile />
          </div>

          {/* Middle Panel - Wellness Stats */}
          <div className="lg:col-span-4">
            <WellnessStats />
          </div>

          {/* Right Panel - Health Metrics */}
          <div className="lg:col-span-5">
            <HealthMetrics />
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Music Hub */}
          <div>
            <MusicHub />
          </div>

          {/* News Section */}
          <div>
            <NewsSection />
          </div>
        </div>

        {/* Games and Rewards */}
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Games Section */}
          <div>
            <GamesSection />
          </div>

          {/* Rewards Section */}
          <div>
            <RewardsSection />
          </div>
        </div>

        {/* Health Assistant and Google Fit */}
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-8">
          <HealthAssistant />
          <GoogleFitWidget />
        </div>

        {/* She Shines Section */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-pink-700">
                <span className="text-2xl">🌸</span>
                She Shines - Self-Care Space
              </CardTitle>
              <CardDescription className="text-pink-600">
                A dedicated space for women to reflect, recharge, and track emotions with daily self-care tips, mood tracking, and journaling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-2xl mb-2">💖</div>
                  <h4 className="font-medium text-pink-700">Daily Self-Care Tips</h4>
                  <p className="text-sm text-pink-600">Personalized wellness suggestions</p>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-2xl mb-2">😊</div>
                  <h4 className="font-medium text-pink-700">Mood Tracking</h4>
                  <p className="text-sm text-pink-600">Monitor your emotional journey</p>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-2xl mb-2">📝</div>
                  <h4 className="font-medium text-pink-700">Personal Journaling</h4>
                  <p className="text-sm text-pink-600">Reflect and grow through writing</p>
                </div>
              </div>
              <div className="text-center">
                <Link to="/she-shines">
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                    <span className="mr-2">🌸</span>
                    Explore She Shines
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
