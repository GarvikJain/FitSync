import RewardsSection from "@/components/RewardsSection";
import Leaderboard from "@/components/Leaderboard";

const RewardsPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-wellness-primary mb-2">Rewards & Achievements</h1>
          <p className="text-muted-foreground">
            Earn points, unlock achievements, and track your progress on your wellness journey.
          </p>
        </div>
        
        {/* Leaderboard at the top */}
        <div className="mb-8">
          <Leaderboard />
        </div>
        
        <RewardsSection />
      </div>
    </div>
  );
};

export default RewardsPage;
