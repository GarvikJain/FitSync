import { Outlet } from "react-router-dom";
import { AuthButtons } from "@/components/AuthButtons";
import { useAuthContext } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";

const Layout = () => {
  const { user, isAuthenticated } = useAuthContext();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 lg:gap-6">
              <h1 className="text-xl lg:text-2xl font-bold text-wellness-primary">WellnessHub</h1>
              <Navbar />
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="hidden sm:block text-sm text-muted-foreground">
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

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
