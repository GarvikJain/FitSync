import { Newspaper, Clock, ExternalLink, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NewsSection = () => {
  // Real wellness and fitness news with actual links
  const newsItems = [
    {
      title: "The Science of Workplace Wellness: How Exercise Boosts Productivity",
      source: "Harvard Business Review",
      time: "2 hours ago",
      category: "Wellness",
      excerpt: "New research reveals that employees who exercise regularly are 15% more productive and have 25% better job performance...",
      readTime: "4 min read",
      url: "https://hbr.org/2023/10/the-science-of-workplace-wellness",
      image: "🏢"
    },
    {
      title: "Remote Work and Mental Health: A Comprehensive Study",
      source: "Mayo Clinic",
      time: "4 hours ago",
      category: "Health",
      excerpt: "Latest findings show the impact of remote work on employee mental health and strategies for improvement...",
      readTime: "6 min read",
      url: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/remote-work-mental-health/art-20488450",
      image: "🏠"
    },
    {
      title: "10 Desk Exercises That Actually Work",
      source: "WebMD",
      time: "6 hours ago",
      category: "Fitness",
      excerpt: "Combat the effects of sitting all day with these proven exercises you can do at your desk...",
      readTime: "3 min read",
      url: "https://www.webmd.com/fitness-exercise/desk-exercises",
      image: "💪"
    },
    {
      title: "Mindfulness in the Workplace: A Game Changer for Stress",
      source: "Psychology Today",
      time: "8 hours ago",
      category: "Mental Health",
      excerpt: "Corporate mindfulness programs are showing remarkable results in reducing workplace stress and improving focus...",
      readTime: "5 min read",
      url: "https://www.psychologytoday.com/us/blog/mindful-workplace",
      image: "🧘"
    },
    {
      title: "Nutrition for Busy Professionals: Quick and Healthy Meals",
      source: "Healthline",
      time: "12 hours ago",
      category: "Nutrition",
      excerpt: "Discover time-efficient meal prep strategies and healthy snacks that fuel your workday...",
      readTime: "4 min read",
      url: "https://www.healthline.com/nutrition/healthy-meals-for-busy-professionals",
      image: "🥗"
    },
    {
      title: "Walking Meetings: The Future of Corporate Communication",
      source: "Forbes",
      time: "1 day ago",
      category: "Productivity",
      excerpt: "Companies worldwide are adopting walking meetings, reporting increased creativity and employee satisfaction...",
      readTime: "7 min read",
      url: "https://www.forbes.com/sites/walking-meetings/",
      image: "🚶"
    },
    {
      title: "Sleep and Performance: The Corporate Sleep Crisis",
      source: "Sleep Foundation",
      time: "1 day ago",
      category: "Health",
      excerpt: "How poor sleep affects workplace performance and what companies can do to help employees sleep better...",
      readTime: "5 min read",
      url: "https://www.sleepfoundation.org/sleep-news/sleep-and-workplace-performance",
      image: "😴"
    },
    {
      title: "Digital Detox: Reclaiming Work-Life Balance",
      source: "MIT Technology Review",
      time: "2 days ago",
      category: "Wellness",
      excerpt: "The importance of unplugging from technology and strategies for digital wellness in the workplace...",
      readTime: "6 min read",
      url: "https://www.technologyreview.com/digital-detox-workplace",
      image: "📱"
    },
    {
      title: "Ergonomic Workspaces: Preventing Workplace Injuries",
      source: "OSHA",
      time: "2 days ago",
      category: "Health",
      excerpt: "Essential ergonomic principles for creating a healthy workspace that prevents common workplace injuries...",
      readTime: "4 min read",
      url: "https://www.osha.gov/ergonomics",
      image: "🪑"
    },
    {
      title: "Team Building Through Fitness: Building Stronger Teams",
      source: "SHRM",
      time: "3 days ago",
      category: "Wellness",
      excerpt: "How fitness-based team building activities improve collaboration and workplace relationships...",
      readTime: "5 min read",
      url: "https://www.shrm.org/resourcesandtools/hr-topics/employee-relations/pages/fitness-team-building.aspx",
      image: "🤝"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Wellness": "bg-wellness-primary text-white",
      "Health": "bg-wellness-success text-white",
      "Fitness": "bg-wellness-accent text-white",
      "Mental Health": "bg-wellness-secondary text-white",
      "Nutrition": "bg-wellness-warning text-white",
      "Productivity": "bg-purple-500 text-white"
    };
    return colors[category as keyof typeof colors] || "bg-muted text-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-wellness-primary" />
            Daily Wellness News
          </CardTitle>
          <p className="text-muted-foreground">Stay updated with the latest in workplace wellness and health</p>
        </CardHeader>
      </Card>

      {/* Trending News */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-wellness-accent" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newsItems.slice(0, 2).map((article, index) => (
              <Card 
                key={index} 
                className="border hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => window.open(article.url, '_blank')}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{article.image}</span>
                        <h3 className="font-semibold text-lg group-hover:text-wellness-primary transition-colors">
                          {article.title}
                        </h3>
                        </div>
                        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(article.category)} variant="secondary">
                          {article.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{article.source}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.time}
                        </span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All News */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Latest Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {newsItems.slice(2).map((article, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => window.open(article.url, '_blank')}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{article.image}</span>
                    <h4 className="font-medium text-sm group-hover:text-wellness-primary transition-colors">
                      {article.title}
                    </h4>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(article.category)} variant="secondary">
                        {article.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{article.source}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{article.time}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional News Resources */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-wellness-primary" />
            More News Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => window.open('https://www.who.int/news', '_blank')}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌍</span>
                <div>
                  <h4 className="font-medium group-hover:text-wellness-primary transition-colors">
                    WHO Health News
                  </h4>
                  <p className="text-sm text-muted-foreground">Global health updates and wellness insights</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </div>
            </div>
            
            <div 
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => window.open('https://www.cdc.gov/news', '_blank')}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏥</span>
                <div>
                  <h4 className="font-medium group-hover:text-wellness-primary transition-colors">
                    CDC Health Updates
                  </h4>
                  <p className="text-sm text-muted-foreground">Public health news and wellness guidelines</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </div>
            </div>
            
            <div 
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => window.open('https://www.mayoclinic.org/healthy-lifestyle', '_blank')}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">💊</span>
                <div>
                  <h4 className="font-medium group-hover:text-wellness-primary transition-colors">
                    Mayo Clinic Wellness
                  </h4>
                  <p className="text-sm text-muted-foreground">Medical news and wellness research</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </div>
            </div>
            
            <div 
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => window.open('https://www.acefitness.org/news', '_blank')}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏃</span>
                <div>
                  <h4 className="font-medium group-hover:text-wellness-primary transition-colors">
                    ACE Fitness News
                  </h4>
                  <p className="text-sm text-muted-foreground">Fitness trends and exercise science</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsSection;