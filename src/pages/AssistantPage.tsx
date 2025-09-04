import HealthAssistant from "@/components/HealthAssistant";

const AssistantPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-wellness-primary mb-2">Health Assistant</h1>
          <p className="text-muted-foreground">
            Get AI-powered health guidance, wellness tips, and personalized recommendations.
          </p>
        </div>
        
        <HealthAssistant />
      </div>
    </div>
  );
};

export default AssistantPage;
