import MusicHub from "@/components/MusicHub";

const MusicPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-wellness-primary mb-2">Music Hub</h1>
          <p className="text-muted-foreground">
            Discover wellness-focused music, meditation tracks, and curated playlists for your well-being.
          </p>
        </div>
        
        <MusicHub />
      </div>
    </div>
  );
};

export default MusicPage;
