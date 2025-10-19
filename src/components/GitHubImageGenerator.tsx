import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Download, RefreshCw, Upload, Image as ImageIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";

type LayoutTemplate = "modern" | "minimal" | "bold" | "gaming";
type PatternType = "circles" | "grid" | "dots" | "waves" | "none";
type FontFamily = "poppins" | "inter" | "sourcecodepro" | "roboto" | "montserrat";

const GitHubImageGenerator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Text content
  const [repoName, setRepoName] = useState("awesome-project");
  const [description, setDescription] = useState("A powerful tool for developers");
  const [username, setUsername] = useState("username");
  const [tagline, setTagline] = useState("⭐ Open Source • MIT License");
  
  // Colors & styling
  const [bgColor, setBgColor] = useState("#0a0a0a");
  const [accentColor, setAccentColor] = useState("#ff6b35");
  const [textColor, setTextColor] = useState("#fafafa");
  const [useGradient, setUseGradient] = useState(true);
  
  // Typography
  const [titleFont, setTitleFont] = useState<FontFamily>("poppins");
  const [bodyFont, setBodyFont] = useState<FontFamily>("inter");
  const [titleSize, setTitleSize] = useState(72);
  const [descriptionSize, setDescriptionSize] = useState(32);
  
  // Layout & design
  const [layout, setLayout] = useState<LayoutTemplate>("modern");
  const [pattern, setPattern] = useState<PatternType>("circles");
  const [patternOpacity, setPatternOpacity] = useState(15);
  
  // Image
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);

  useEffect(() => {
    generateImage();
  }, [repoName, description, username, tagline, bgColor, accentColor, textColor, 
      useGradient, titleFont, bodyFont, titleSize, descriptionSize, layout, 
      pattern, patternOpacity, bgImage, logoImage]);

  const getFontFamily = (font: FontFamily) => {
    const fonts = {
      poppins: "Poppins, sans-serif",
      inter: "Inter, sans-serif",
      sourcecodepro: "Source Code Pro, monospace",
      roboto: "Roboto, sans-serif",
      montserrat: "Montserrat, sans-serif"
    };
    return fonts[font];
  };

  const generateImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 640;

    // Draw background
    if (bgImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        continueDrawing();
      };
      img.src = bgImage;
    } else {
      // Background gradient or solid
      if (useGradient) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, bgColor);
        gradient.addColorStop(1, adjustColor(bgColor, -20));
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = bgColor;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      continueDrawing();
    }

    function continueDrawing() {
      if (!ctx || !canvas) return;

      // Draw pattern
      drawPattern(ctx, canvas.width, canvas.height);

      // Draw layout based on template
      switch (layout) {
        case "modern":
          drawModernLayout(ctx);
          break;
        case "minimal":
          drawMinimalLayout(ctx);
          break;
        case "bold":
          drawBoldLayout(ctx);
          break;
        case "gaming":
          drawGamingLayout(ctx);
          break;
      }
    }
  };

  const drawPattern = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.globalAlpha = patternOpacity / 100;
    ctx.strokeStyle = accentColor;
    ctx.fillStyle = accentColor;

    switch (pattern) {
      case "circles":
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * width,
            Math.random() * height,
            50 + Math.random() * 150,
            0,
            Math.PI * 2
          );
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        break;
      case "grid":
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 50) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 50) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        break;
      case "dots":
        for (let x = 0; x < width; x += 40) {
          for (let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
      case "waves":
        ctx.lineWidth = 3;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          for (let x = 0; x < width; x += 10) {
            const y = Math.sin((x + i * 100) * 0.01) * 50 + height / 2 + i * 40;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        break;
    }
    ctx.globalAlpha = 1;
  };

  const drawModernLayout = (ctx: CanvasRenderingContext2D) => {
    const centerX = 640;
    const centerY = 320;

    // Logo
    if (logoImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, centerX - 50, centerY - 180, 100, 100);
      };
      img.src = logoImage;
    }

    // Title
    ctx.fillStyle = textColor;
    ctx.font = `bold ${titleSize}px ${getFontFamily(titleFont)}`;
    ctx.textAlign = "center";
    ctx.fillText(repoName, centerX, centerY);

    // Description
    ctx.fillStyle = adjustColor(textColor, -60);
    ctx.font = `${descriptionSize}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description, centerX, centerY + 60);

    // Username
    ctx.fillStyle = accentColor;
    ctx.font = `28px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, centerX, centerY + 110);

    // Tagline
    if (tagline) {
      ctx.fillStyle = adjustColor(textColor, -80);
      ctx.font = `20px ${getFontFamily(bodyFont)}`;
      ctx.fillText(tagline, centerX, centerY + 150);
    }

    // Accent line
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX - 150, centerY + 170);
    ctx.lineTo(centerX + 150, centerY + 170);
    ctx.stroke();
  };

  const drawMinimalLayout = (ctx: CanvasRenderingContext2D) => {
    const leftMargin = 100;
    const topMargin = 200;

    ctx.textAlign = "left";
    
    // Title
    ctx.fillStyle = textColor;
    ctx.font = `bold ${titleSize}px ${getFontFamily(titleFont)}`;
    ctx.fillText(repoName, leftMargin, topMargin);

    // Description
    ctx.fillStyle = adjustColor(textColor, -60);
    ctx.font = `${descriptionSize}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description, leftMargin, topMargin + 70);

    // Username
    ctx.fillStyle = accentColor;
    ctx.font = `24px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, leftMargin, topMargin + 130);

    // Vertical accent line
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(leftMargin - 30, topMargin - 50);
    ctx.lineTo(leftMargin - 30, topMargin + 150);
    ctx.stroke();
  };

  const drawBoldLayout = (ctx: CanvasRenderingContext2D) => {
    const centerX = 640;
    const topY = 150;

    ctx.textAlign = "center";

    // Large title with gradient effect
    const gradient = ctx.createLinearGradient(0, topY - 100, 0, topY + 100);
    gradient.addColorStop(0, textColor);
    gradient.addColorStop(1, accentColor);
    
    ctx.fillStyle = gradient;
    ctx.font = `900 ${titleSize + 20}px ${getFontFamily(titleFont)}`;
    ctx.fillText(repoName.toUpperCase(), centerX, topY);

    // Background rectangle
    ctx.fillStyle = accentColor + "30";
    ctx.fillRect(0, topY + 50, 1280, 150);

    // Description
    ctx.fillStyle = textColor;
    ctx.font = `bold ${descriptionSize + 8}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description, centerX, topY + 130);

    // Username box
    ctx.fillStyle = accentColor;
    ctx.fillRect(centerX - 150, topY + 180, 300, 60);
    ctx.fillStyle = bgColor;
    ctx.font = `bold 32px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, centerX, topY + 220);
  };

  const drawGamingLayout = (ctx: CanvasRenderingContext2D) => {
    const centerX = 640;
    const centerY = 320;

    // Diagonal stripes background
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = accentColor;
    for (let i = -10; i < 20; i++) {
      ctx.fillRect(i * 100 - 500, 0, 50, 640);
    }
    ctx.globalAlpha = 1;

    // Hexagon frame (approximated)
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(centerX - 300, centerY - 150);
    ctx.lineTo(centerX + 300, centerY - 150);
    ctx.lineTo(centerX + 400, centerY);
    ctx.lineTo(centerX + 300, centerY + 150);
    ctx.lineTo(centerX - 300, centerY + 150);
    ctx.lineTo(centerX - 400, centerY);
    ctx.closePath();
    ctx.stroke();

    // Title with glow
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 20;
    ctx.fillStyle = textColor;
    ctx.font = `900 ${titleSize}px ${getFontFamily(titleFont)}`;
    ctx.textAlign = "center";
    ctx.fillText(repoName.toUpperCase(), centerX, centerY - 20);
    ctx.shadowBlur = 0;

    // Description
    ctx.fillStyle = accentColor;
    ctx.font = `bold ${descriptionSize}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description.toUpperCase(), centerX, centerY + 40);

    // Username badge
    ctx.fillStyle = accentColor;
    ctx.fillRect(centerX - 120, centerY + 70, 240, 50);
    ctx.fillStyle = bgColor;
    ctx.font = `bold 28px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, centerX, centerY + 105);
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

  const handleImageUpload = (type: "background" | "logo") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (type === "background") {
        setBgImage(result);
      } else {
        setLogoImage(result);
      }
      toast.success(`${type === "background" ? "Background" : "Logo"} image uploaded!`);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = (type: "background" | "logo") => {
    if (type === "background") setBgImage(null);
    else setLogoImage(null);
    toast.success("Image cleared");
  };

  const randomizeColors = () => {
    const colors = ["#0a0a0a", "#1a0f0f", "#0f1a0f", "#0f0f1a", "#1a1a0a"];
    const accents = ["#ff6b35", "#4ecdc4", "#ffe66d", "#ff6b9d", "#95e1d3"];
    setBgColor(colors[Math.floor(Math.random() * colors.length)]);
    setAccentColor(accents[Math.floor(Math.random() * accents.length)]);
    toast.success("Colors randomized!");
  };

  const applyTemplate = (template: LayoutTemplate) => {
    setLayout(template);
    const templates = {
      modern: { pattern: "circles" as PatternType, titleFont: "poppins" as FontFamily, bodyFont: "inter" as FontFamily },
      minimal: { pattern: "none" as PatternType, titleFont: "inter" as FontFamily, bodyFont: "sourcecodepro" as FontFamily },
      bold: { pattern: "grid" as PatternType, titleFont: "montserrat" as FontFamily, bodyFont: "roboto" as FontFamily },
      gaming: { pattern: "dots" as PatternType, titleFont: "poppins" as FontFamily, bodyFont: "sourcecodepro" as FontFamily }
    };
    const config = templates[template];
    setPattern(config.pattern);
    setTitleFont(config.titleFont);
    setBodyFont(config.bodyFont);
    toast.success(`${template.charAt(0).toUpperCase() + template.slice(1)} template applied!`);
  };

  return (
    <section id="tools" className="min-h-screen py-24 px-6">
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
          <Card className="p-8 bg-card border-border hover-lift">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repo-name">Repository Name</Label>
                  <Input
                    id="repo-name"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="awesome-project"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A powerful tool for developers"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline (Optional)</Label>
                  <Input
                    id="tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="⭐ Open Source • MIT License"
                  />
                </div>
              </TabsContent>

              {/* Style Tab */}
              <TabsContent value="style" className="space-y-4">
                <div className="space-y-2">
                  <Label>Title Font</Label>
                  <Select value={titleFont} onValueChange={(v) => setTitleFont(v as FontFamily)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="sourcecodepro">Source Code Pro</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Body Font</Label>
                  <Select value={bodyFont} onValueChange={(v) => setBodyFont(v as FontFamily)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="sourcecodepro">Source Code Pro</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Title Size: {titleSize}px</Label>
                  <Slider value={[titleSize]} onValueChange={(v) => setTitleSize(v[0])} min={40} max={120} step={2} />
                </div>

                <div className="space-y-2">
                  <Label>Description Size: {descriptionSize}px</Label>
                  <Slider value={[descriptionSize]} onValueChange={(v) => setDescriptionSize(v[0])} min={20} max={60} step={2} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Background</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full h-10 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Accent</Label>
                    <Input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full h-10 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Text</Label>
                    <Input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-10 cursor-pointer"
                    />
                  </div>
                </div>

                <Button onClick={randomizeColors} variant="outline" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Randomize Colors
                </Button>
              </TabsContent>

              {/* Layout Tab */}
              <TabsContent value="layout" className="space-y-4">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["modern", "minimal", "bold", "gaming"] as LayoutTemplate[]).map((t) => (
                      <Button
                        key={t}
                        onClick={() => applyTemplate(t)}
                        variant={layout === t ? "default" : "outline"}
                        className="capitalize"
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pattern</Label>
                  <Select value={pattern} onValueChange={(v) => setPattern(v as PatternType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="circles">Circles</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="dots">Dots</SelectItem>
                      <SelectItem value="waves">Waves</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Pattern Opacity: {patternOpacity}%</Label>
                  <Slider value={[patternOpacity]} onValueChange={(v) => setPatternOpacity(v[0])} min={0} max={50} step={5} />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="gradient"
                    checked={useGradient}
                    onChange={(e) => setUseGradient(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="gradient" className="cursor-pointer">Use Background Gradient</Label>
                </div>
              </TabsContent>

              {/* Images Tab */}
              <TabsContent value="images" className="space-y-4">
                <div className="space-y-2">
                  <Label>Background Image</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload("background")}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Background
                    </Button>
                    {bgImage && (
                      <Button onClick={() => clearImage("background")} variant="destructive" size="icon">
                        ✕
                      </Button>
                    )}
                  </div>
                  {bgImage && (
                    <div className="mt-2 relative w-full h-20 rounded overflow-hidden border border-border">
                      <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Logo Image</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload("logo")}
                    className="hidden"
                    id="logo-upload"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => document.getElementById("logo-upload")?.click()}
                      variant="outline"
                      className="flex-1"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    {logoImage && (
                      <Button onClick={() => clearImage("logo")} variant="destructive" size="icon">
                        ✕
                      </Button>
                    )}
                  </div>
                  {logoImage && (
                    <div className="mt-2 relative w-20 h-20 rounded overflow-hidden border border-border mx-auto">
                      <img src={logoImage} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted mb-2">Quick tip: Upload a transparent PNG logo for best results</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4 pt-6 mt-6 border-t border-border">
              <Button onClick={downloadImage} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={randomizeColors} variant="outline">
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
