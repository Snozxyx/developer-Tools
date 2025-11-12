import { FiveMBannerCreator } from "@/components/FiveMBannerCreator";
import ToolHeader from "@/components/ToolHeader";

const FiveMBannerCreatorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <ToolHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">FiveM Banner Creator</h1>
          <p className="text-muted-foreground text-lg">
            Create stunning animated and static banners for your FiveM server
          </p>
        </div>
        
        <FiveMBannerCreator />
      </main>
    </div>
  );
};

export default FiveMBannerCreatorPage;
