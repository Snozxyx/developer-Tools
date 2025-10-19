import GitHubImageGenerator from "@/components/GitHubImageGenerator";
import ToolHeader from "@/components/ToolHeader";

const GitHubImageGeneratorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <ToolHeader />
      <GitHubImageGenerator />
    </div>
  );
};

export default GitHubImageGeneratorPage;
