import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import GitHubImageGenerator from "@/components/GitHubImageGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <GitHubImageGenerator />
    </div>
  );
};

export default Index;
