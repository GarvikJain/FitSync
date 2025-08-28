import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  User, 
  Activity, 
  Heart, 
  MessageCircle, 
  Music, 
  Gamepad2, 
  Trophy, 
  Newspaper, 
  Flower2,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/profile", label: "Profile", icon: User },
    { path: "/wellness", label: "Wellness", icon: Activity },
    { path: "/health", label: "Health", icon: Heart },
    { path: "/assistant", label: "Assistant", icon: MessageCircle },
    { path: "/music", label: "Music", icon: Music },
    { path: "/games", label: "Games", icon: Gamepad2 },
    { path: "/rewards", label: "Rewards", icon: Trophy },
    { path: "/news", label: "News", icon: Newspaper },
    { path: "/she-shines", label: "She Shines", icon: Flower2 },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={isMobile ? handleNavClick : undefined}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-wellness-primary text-white' 
                : 'text-muted-foreground hover:text-wellness-primary hover:bg-wellness-primary/10'
              }
              ${isMobile ? 'w-full text-base py-3' : ''}
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-2">
        <NavLinks />
      </nav>

      {/* Mobile Navigation - Hamburger Menu */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 p-0"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle className="text-left text-lg font-bold text-wellness-primary">
                WellnessHub Menu
              </SheetTitle>
            </SheetHeader>
            <div className="p-4 space-y-2">
              <NavLinks isMobile />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Tablet Navigation - Compact */}
      <nav className="hidden md:flex lg:hidden items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-1 px-2 py-2 rounded-md text-xs font-medium transition-colors
                ${isActive 
                  ? 'bg-wellness-primary text-white' 
                  : 'text-muted-foreground hover:text-wellness-primary hover:bg-wellness-primary/10'
                }
              `}
              title={item.label}
            >
              <Icon className="w-4 h-4" />
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export { Navbar };
