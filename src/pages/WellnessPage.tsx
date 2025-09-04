import WellnessStats from "@/components/WellnessStats";

const WellnessPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-wellness-primary mb-2">Wellness Stats</h1>
          <p className="text-muted-foreground">
            Track your overall wellness metrics, progress, and achievements.
          </p>
        </div>
        
        <WellnessStats />
      </div>
    </div>
  );
};

export default WellnessPage;
