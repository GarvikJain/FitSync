import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  User, 
  Activity, 
  Heart, 
  MessageCircle, 
  Music, 
  Gamepad2, 
  Trophy, 
  Newspaper, 
  Flower2,
  TrendingUp,
  Calendar,
  Target
} from "lucide-react";

const DashboardPage = () => {
  const features = [
    {
      title: "Profile",
      description: "View and manage your personal information and schedule",
      icon: User,
      path: "/profile",
      color: "bg-blue-500",
      gradient: "from-blue-50 to-blue-100"
    },
    {
      title: "Wellness Stats",
      description: "Track your overall wellness metrics and progress",
      icon: Activity,
      path: "/wellness",
      color: "bg-green-500",
      gradient: "from-green-50 to-green-100"
    },
    {
      title: "Health Metrics",
      description: "Monitor your health data and Google Fit integration",
      icon: Heart,
      path: "/health",
      color: "bg-red-500",
      gradient: "from-red-50 to-red-100"
    },
    {
      title: "Health Assistant",
      description: "Get AI-powered health guidance and wellness tips",
      icon: MessageCircle,
      path: "/assistant",
      color: "bg-purple-500",
      gradient: "from-purple-50 to-purple-100"
    },
    {
      title: "Music Hub",
      description: "Discover wellness-focused music and playlists",
      icon: Music,
      path: "/music",
      color: "bg-yellow-500",
      gradient: "from-yellow-50 to-yellow-100"
    },
    {
      title: "Games",
      description: "Engage in wellness games and activities",
      icon: Gamepad2,
      path: "/games",
      color: "bg-indigo-500",
      gradient: "from-indigo-50 to-indigo-100"
    },
    {
      title: "Rewards",
      description: "Earn points and rewards for your wellness journey",
      icon: Trophy,
      path: "/rewards",
      color: "bg-orange-500",
      gradient: "from-orange-50 to-orange-100"
    },
    {
      title: "News",
      description: "Stay updated with the latest wellness news and tips",
      icon: Newspaper,
      path: "/news",
      color: "bg-teal-500",
      gradient: "from-teal-50 to-teal-100"
    },
    {
      title: "She Shines",
      description: "Self-care space for women with mood tracking and journaling",
      icon: Flower2,
      path: "/she-shines",
      color: "bg-pink-500",
      gradient: "from-pink-50 to-pink-100"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-wellness-primary mb-2">
          Welcome to WellnessHub
        </h1>
        <p className="text-muted-foreground text-lg">
          Your comprehensive wellness platform for health, fitness, and personal growth
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-wellness-primary/10 to-wellness-accent/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-wellness-primary rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-wellness-primary">85%</p>
                <p className="text-sm text-muted-foreground">Wellness Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-wellness-accent/10 to-wellness-secondary/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-wellness-accent rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-wellness-accent">12</p>
                <p className="text-sm text-muted-foreground">Days Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-wellness-secondary/10 to-wellness-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-wellness-secondary rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-wellness-secondary">7</p>
                <p className="text-sm text-muted-foreground">Goals Achieved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.path} className={`bg-gradient-to-r ${feature.gradient} hover:shadow-lg transition-all duration-300`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${feature.color} text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {feature.description}
                </CardDescription>
                <Link to={feature.path}>
                  <Button className="w-full bg-wellness-primary hover:bg-wellness-primary/90">
                    Explore {feature.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <Card className="bg-gradient-to-r from-wellness-primary/5 to-wellness-accent/5 border-wellness-primary/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-wellness-primary mb-4">
              Start Your Wellness Journey Today
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Discover personalized wellness features, track your progress, and achieve your health goals 
              with our comprehensive platform designed for your well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/profile">
                <Button size="lg" className="bg-wellness-primary hover:bg-wellness-primary/90">
                  Complete Your Profile
                </Button>
              </Link>
              <Link to="/wellness">
                <Button size="lg" variant="outline" className="border-wellness-primary text-wellness-primary hover:bg-wellness-primary/10">
                  View Wellness Stats
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
