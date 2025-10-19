import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const GitHubImageGenerator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [repoName, setRepoName] = useState("awesome-project");
  const [description, setDescription] = useState("A powerful tool for developers");
  const [username, setUsername] = useState("username");
  const [bgColor, setBgColor] = useState("#0a0a0a");
  const [accentColor, setAccentColor] = useState("#ff6b35");

  useEffect(() => {
    generateImage();
  }, [repoName, description, username, bgColor, accentColor]);

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size (GitHub social preview size)
    canvas.width = 1280;
    canvas.height = 640;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, bgColor);
    gradient.addColorStop(1, adjustColor(bgColor, -20));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add geometric patterns
    ctx.strokeStyle = accentColor + "15";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        100 + Math.random() * 200,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }

    // Repository name
    ctx.fillStyle = "#fafafa";
    ctx.font = "bold 72px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(repoName, canvas.width / 2, canvas.height / 2 - 40);

    // Description
    ctx.fillStyle = "#a6a6a6";
    ctx.font = "32px Inter, sans-serif";
    ctx.fillText(description, canvas.width / 2, canvas.height / 2 + 30);

    // Username with accent
    ctx.fillStyle = accentColor;
    ctx.font = "28px Source Code Pro, monospace";
    ctx.fillText(`@${username}`, canvas.width / 2, canvas.height / 2 + 90);

    // Accent line
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 150, canvas.height / 2 + 110);
    ctx.lineTo(canvas.width / 2 + 150, canvas.height / 2 + 110);
    ctx.stroke();
  };

  const adjustColor = (color: string, amount: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${repoName}-github-image.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Image downloaded successfully!");
    });
  };

  const randomizeColors = () => {
    const colors = ["#0a0a0a", "#1a0f0f", "#0f1a0f", "#0f0f1a", "#1a1a0a"];
    const accents = ["#ff6b35", "#4ecdc4", "#ffe66d", "#ff6b9d", "#95e1d3"];
    setBgColor(colors[Math.floor(Math.random() * colors.length)]);
    setAccentColor(accents[Math.floor(Math.random() * accents.length)]);
  };

  return (
    <section id="tools" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="font-serif font-bold text-5xl md:text-6xl mb-4">
            <span className="text-foreground">GitHub Image</span>{" "}
            <span className="text-gradient-accent">Generator</span>
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Create stunning social preview images for your GitHub repositories in seconds
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Controls */}
          <Card className="p-8 bg-card border-border hover-lift space-y-6">
            <div className="space-y-2">
              <Label htmlFor="repo-name" className="text-foreground">
                Repository Name
              </Label>
              <Input
                id="repo-name"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className="bg-background border-border text-foreground focus:border-accent focus:ring-accent"
                placeholder="awesome-project"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background border-border text-foreground focus:border-accent focus:ring-accent"
                placeholder="A powerful tool for developers"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background border-border text-foreground focus:border-accent focus:ring-accent"
                placeholder="username"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bg-color" className="text-foreground">
                  Background
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="bg-color"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-16 h-10 cursor-pointer"
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 bg-background border-border text-foreground font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent-color" className="text-foreground">
                  Accent Color
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="accent-color"
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-16 h-10 cursor-pointer"
                  />
                  <Input
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 bg-background border-border text-foreground font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={downloadImage}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={randomizeColors}
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Randomize
              </Button>
            </div>
          </Card>

          {/* Preview */}
          <div className="space-y-4">
            <Card className="p-6 bg-card border-border overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-lg"
                style={{ maxWidth: "100%" }}
              />
            </Card>
            <p className="text-sm text-muted text-center font-mono">
              Preview • 1280x640px • Perfect for GitHub social previews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubImageGenerator;
