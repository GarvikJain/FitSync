import { Coins, Gift, Target, Star, Trophy, Medal, Award, Zap, Heart, Shield, Crown, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const RewardsSection = () => {
  const currentCoins = 2847;
  const monthlyTarget = 3000;
  const progress = (currentCoins / monthlyTarget) * 100;


  const rewards = [
    { name: "Coffee Voucher", coins: 500, type: "Food & Drink", available: 8, image: "☕" },
    { name: "Gym Membership (1 Month)", coins: 2000, type: "Fitness", available: 3, image: "🏋️" },
    { name: "Wellness Day Off", coins: 1500, type: "Time Off", available: 5, image: "🏖️" },
    { name: "Massage Session", coins: 1200, type: "Wellness", available: 4, image: "💆" },
    { name: "Healthy Lunch", coins: 300, type: "Food & Drink", available: 10, image: "🥗" },
    { name: "Yoga Class Pass", coins: 800, type: "Fitness", available: 6, image: "🧘" }
  ];

  const achievements = [
    { name: "First Steps", description: "Completed your first 10,000 steps", icon: "👟", earned: true },
    { name: "Hydration Hero", description: "Drank 8 glasses of water for 7 days", icon: "💧", earned: true },
    { name: "Streak Master", description: "Maintained a 30-day wellness streak", icon: "🔥", earned: false },
    { name: "Game Champion", description: "Won 50 games", icon: "🏆", earned: false }
  ];

  const badges = [
    // Fitness Badges
    { 
      id: 1, 
      name: "Step Counter", 
      description: "Walk 10,000 steps in a day", 
      icon: Trophy, 
      category: "Fitness", 
      rarity: "Common", 
      earned: true, 
      earnedDate: "2024-01-15",
      points: 50
    },
    { 
      id: 2, 
      name: "Marathon Walker", 
      description: "Walk 20,000 steps in a day", 
      icon: Medal, 
      category: "Fitness", 
      rarity: "Rare", 
      earned: true, 
      earnedDate: "2024-01-20",
      points: 150
    },
    { 
      id: 3, 
      name: "Gym Warrior", 
      description: "Complete 30 gym sessions", 
      icon: Shield, 
      category: "Fitness", 
      rarity: "Epic", 
      earned: false, 
      earnedDate: null,
      points: 300
    },
    
    // Wellness Badges
    { 
      id: 4, 
      name: "Hydration Master", 
      description: "Drink 8 glasses of water for 30 days", 
      icon: Heart, 
      category: "Wellness", 
      rarity: "Rare", 
      earned: true, 
      earnedDate: "2024-01-10",
      points: 200
    },
    { 
      id: 5, 
      name: "Meditation Guru", 
      description: "Meditate for 100 hours total", 
      icon: Zap, 
      category: "Wellness", 
      rarity: "Epic", 
      earned: false, 
      earnedDate: null,
      points: 500
    },
    { 
      id: 6, 
      name: "Sleep Champion", 
      description: "Get 8 hours of sleep for 7 consecutive days", 
      icon: Crown, 
      category: "Wellness", 
      rarity: "Common", 
      earned: false, 
      earnedDate: null,
      points: 100
    },
    
    // Social Badges
    { 
      id: 7, 
      name: "Team Player", 
      description: "Complete 10 team challenges", 
      icon: Award, 
      category: "Social", 
      rarity: "Common", 
      earned: true, 
      earnedDate: "2024-01-25",
      points: 75
    },
    { 
      id: 8, 
      name: "Community Leader", 
      description: "Help 5 colleagues reach their goals", 
      icon: Star, 
      category: "Social", 
      rarity: "Rare", 
      earned: false, 
      earnedDate: null,
      points: 250
    },
    
    // Special Badges
    { 
      id: 9, 
      name: "Streak Legend", 
      description: "Maintain a 100-day wellness streak", 
      icon: Flame, 
      category: "Special", 
      rarity: "Legendary", 
      earned: false, 
      earnedDate: null,
      points: 1000
    },
    { 
      id: 10, 
      name: "Early Bird", 
      description: "Complete morning routine for 30 days", 
      icon: Zap, 
      category: "Special", 
      rarity: "Rare", 
      earned: false, 
      earnedDate: null,
      points: 200
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "bg-gray-500 text-white";
      case "Rare": return "bg-blue-500 text-white";
      case "Epic": return "bg-purple-500 text-white";
      case "Legendary": return "bg-yellow-500 text-black";
      default: return "bg-gray-500 text-white";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Fitness": return "💪";
      case "Wellness": return "🧘";
      case "Social": return "👥";
      case "Special": return "⭐";
      default: return "🏆";
    }
  };


  return (
    <div className="space-y-6">
      {/* Coins & Target */}
      <Card className="wellness-card overflow-hidden">
        <div className="energy-gradient p-6 text-white">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Coins className="w-6 h-6" />
              Your Coins
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{currentCoins.toLocaleString()}</div>
                <p className="text-white/80 text-sm">Keep earning!</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">Monthly Target</div>
                <div className="text-2xl font-bold">{monthlyTarget.toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progress} className="h-3 bg-white/20" />
              <p className="text-white/80 text-sm mt-2">
                {monthlyTarget - currentCoins} coins to reach monthly target
              </p>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Available Rewards */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Gift className="w-5 h-5 text-wellness-primary" />
            Available Rewards
          </CardTitle>
          <p className="text-sm text-muted-foreground">Redeem your coins for amazing rewards</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward, index) => (
              <Card key={index} className="border hover:shadow-md transition-shadow group">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{reward.image}</div>
                      <h3 className="font-semibold text-sm">{reward.name}</h3>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {reward.type}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Cost:</span>
                        <span className="font-bold text-wellness-accent flex items-center gap-1">
                          <Coins className="w-4 h-4" />
                          {reward.coins}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Available:</span>
                        <span className="font-medium">{reward.available} left</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={currentCoins < reward.coins}
                    >
                      {currentCoins >= reward.coins ? 'Redeem' : 'Not enough coins'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-wellness-primary" />
            Achievements
          </CardTitle>
          <p className="text-sm text-muted-foreground">Track your wellness milestones</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                  achievement.earned 
                    ? 'bg-wellness-success/5 border-wellness-success/20' 
                    : 'bg-muted/20 border-muted'
                }`}
              >
                <div className={`text-3xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${achievement.earned ? '' : 'text-muted-foreground'}`}>
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <Badge className="bg-wellness-success text-white">
                    Earned
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges Collection */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-wellness-primary" />
            Badge Collection
          </CardTitle>
          <p className="text-sm text-muted-foreground">Earn badges by completing wellness challenges</p>
        </CardHeader>
        <CardContent>
          {/* Badge Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-wellness-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-wellness-primary">
                {badges.filter(b => b.earned).length}
              </div>
              <div className="text-sm text-muted-foreground">Earned</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-muted-foreground">
                {badges.filter(b => !b.earned).length}
              </div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {badges.filter(b => b.rarity === 'Legendary').length}
              </div>
              <div className="text-sm text-muted-foreground">Legendary</div>
            </div>
            <div className="text-center p-3 bg-purple-500/10 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {badges.filter(b => b.rarity === 'Epic').length}
              </div>
              <div className="text-sm text-muted-foreground">Epic</div>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <Card 
                  key={badge.id} 
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    badge.earned 
                      ? 'border-wellness-success/30 bg-gradient-to-br from-wellness-success/5 to-wellness-success/10' 
                      : 'border-muted/30 bg-muted/5'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Badge Icon */}
                      <div className={`p-3 rounded-full ${
                        badge.earned 
                          ? 'bg-wellness-success/20 text-wellness-success' 
                          : 'bg-muted/30 text-muted-foreground'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Badge Name & Category */}
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold text-sm ${
                            badge.earned ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {badge.name}
                          </h3>
                          <span className="text-lg">{getCategoryIcon(badge.category)}</span>
                        </div>
                        
                        {/* Description */}
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {badge.description}
                        </p>
                        
                        {/* Rarity Badge */}
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            className={`text-xs ${getRarityColor(badge.rarity)}`}
                            variant="secondary"
                          >
                            {badge.rarity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {badge.points} pts
                          </span>
                        </div>
                        
                        {/* Earned Date or Progress */}
                        {badge.earned ? (
                          <div className="text-xs text-wellness-success font-medium">
                            ✓ Earned on {badge.earnedDate}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            Not earned yet
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Rarity Glow Effect */}
                    {badge.rarity === 'Legendary' && (
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-xl -translate-y-10 translate-x-10" />
                    )}
                    {badge.rarity === 'Epic' && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-lg -translate-y-8 translate-x-8" />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsSection;