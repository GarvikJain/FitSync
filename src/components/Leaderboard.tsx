import { TrendingUp, Crown, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Leaderboard = () => {
  const leaderboard = [
    { rank: 1, name: "Alex Chen", points: 3240, avatar: "AC", change: "+12" },
    { rank: 2, name: "Sarah Johnson", points: 2847, avatar: "SJ", change: "+8", isUser: true },
    { rank: 3, name: "Mike Rodriguez", points: 2756, avatar: "MR", change: "+15" },
    { rank: 4, name: "Emily Davis", points: 2698, avatar: "ED", change: "+5" },
    { rank: 5, name: "James Wilson", points: 2542, avatar: "JW", change: "-3" }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Award className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <Card className="wellness-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-wellness-primary" />
          Leaderboard
        </CardTitle>
        <p className="text-sm text-muted-foreground">See how you rank among your colleagues</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                user.isUser ? 'bg-wellness-primary/5 border border-wellness-primary/20' : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(user.rank)}
                </div>
                <div className="w-10 h-10 rounded-full bg-wellness-primary/10 flex items-center justify-center font-semibold text-wellness-primary">
                  {user.avatar}
                </div>
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {user.name}
                    {user.isUser && <Badge variant="outline" className="text-xs">You</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">{user.points.toLocaleString()} points</div>
                </div>
              </div>
              <div className={`text-sm font-medium ${
                user.change.startsWith('+') ? 'text-wellness-success' : 'text-destructive'
              }`}>
                {user.change}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
