import HealthMetrics from "@/components/HealthMetrics";
import GoogleFitWidget from "@/components/GoogleFitWidget";
import GoogleFitDebug from "@/components/GoogleFitDebug";

const HealthPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-wellness-primary mb-2">Health Metrics</h1>
          <p className="text-muted-foreground">
            Monitor your health data, track fitness metrics, and connect with Google Fit.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <HealthMetrics />
          <GoogleFitWidget />
        </div>
        
        {/* Debug Panel - Remove this after fixing the issue */}
        <div className="mt-8">
          <GoogleFitDebug />
        </div>
      </div>
    </div>
  );
};

export default HealthPage;
