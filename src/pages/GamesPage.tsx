import GamesSection from "@/components/GamesSection";

const GamesPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-wellness-primary mb-2">Wellness Games</h1>
          <p className="text-muted-foreground">
            Engage in fun wellness activities, challenges, and games to boost your health journey.
          </p>
        </div>
        
        <GamesSection />
      </div>
    </div>
  );
};

export default GamesPage;
