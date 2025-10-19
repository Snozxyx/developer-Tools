import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

interface ToolHeaderProps {
  backLink?: string;
  title?: string;
}

const ToolHeader = ({ backLink = "/", title = "Snozxyx Tools" }: ToolHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to={backLink}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="h-6 w-px bg-border" />
          <Link to="/" className="text-xl font-serif font-bold text-foreground hover:text-accent transition-colors">
            {title}
          </Link>
        </div>
        
        <Button asChild variant="outline" size="sm">
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            All Tools
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default ToolHeader;
