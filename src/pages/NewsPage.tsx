import NewsSection from "@/components/NewsSection";

const NewsPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-wellness-primary mb-2">Wellness News</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest wellness news, health tips, and industry insights.
          </p>
        </div>
        
        <NewsSection />
      </div>
    </div>
  );
};

export default NewsPage;
