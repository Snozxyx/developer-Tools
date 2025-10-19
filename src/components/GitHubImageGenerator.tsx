import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Download, RefreshCw, Upload, Image as ImageIcon, Sparkles, Copy, Save, FolderOpen, Zap } from "lucide-react";
import { toast } from "sonner";

type LayoutTemplate = "modern" | "minimal" | "bold" | "gaming" | "gradient" | "glassmorphism";
type PatternType = "circles" | "grid" | "dots" | "waves" | "hexagons" | "triangles" | "none";
type FontFamily = "poppins" | "inter" | "sourcecodepro" | "roboto" | "montserrat" | "playfair" | "orbitron";
type IconType = "none" | "star" | "fork" | "eye" | "zap" | "shield";

interface SavedDesign {
  id: string;
  name: string;
  timestamp: number;
  config: DesignConfig;
}

interface DesignConfig {
  repoName: string;
  description: string;
  username: string;
  tagline: string;
  bgColor: string;
  accentColor: string;
  textColor: string;
  useGradient: boolean;
  titleFont: FontFamily;
  bodyFont: FontFamily;
  titleSize: number;
  descriptionSize: number;
  layout: LayoutTemplate;
  pattern: PatternType;
  patternOpacity: number;
  stats?: { stars: string; forks: string; watchers: string };
  icon: IconType;
  shadowIntensity: number;
  borderRadius: number;
}

const GitHubImageGenerator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [repoName, setRepoName] = useState("awesome-project");
  const [description, setDescription] = useState("A powerful tool for developers");
  const [username, setUsername] = useState("username");
  const [tagline, setTagline] = useState("⭐ Open Source • MIT License");

  const [bgColor, setBgColor] = useState("#0a0a0a");
  const [accentColor, setAccentColor] = useState("#ff6b35");
  const [textColor, setTextColor] = useState("#fafafa");
  const [useGradient, setUseGradient] = useState(true);

  const [titleFont, setTitleFont] = useState<FontFamily>("poppins");
  const [bodyFont, setBodyFont] = useState<FontFamily>("inter");
  const [titleSize, setTitleSize] = useState(72);
  const [descriptionSize, setDescriptionSize] = useState(32);

  const [layout, setLayout] = useState<LayoutTemplate>("modern");
  const [pattern, setPattern] = useState<PatternType>("circles");
  const [patternOpacity, setPatternOpacity] = useState(15);

  const [bgImage, setBgImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);

  const [stats, setStats] = useState({ stars: "1.2k", forks: "234", watchers: "89" });
  const [showStats, setShowStats] = useState(false);
  const [icon, setIcon] = useState<IconType>("star");
  const [shadowIntensity, setShadowIntensity] = useState(20);
  const [borderRadius, setBorderRadius] = useState(0);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [animationSpeed] = useState(1000);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    generateImage();
  }, [repoName, description, username, tagline, bgColor, accentColor, textColor,
      useGradient, titleFont, bodyFont, titleSize, descriptionSize, layout,
      pattern, patternOpacity, bgImage, logoImage, stats, showStats, icon, shadowIntensity, borderRadius]);

  useEffect(() => {
    const saved = localStorage.getItem('savedGitHubDesigns');
    if (saved) {
      setSavedDesigns(JSON.parse(saved));
    }
  }, []);

  const getFontFamily = (font: FontFamily) => {
    const fonts = {
      poppins: "Poppins, sans-serif",
      inter: "Inter, sans-serif",
      sourcecodepro: "Source Code Pro, monospace",
      roboto: "Roboto, sans-serif",
      montserrat: "Montserrat, sans-serif",
      playfair: "Playfair Display, serif",
      orbitron: "Orbitron, sans-serif"
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

      drawPattern(ctx, canvas.width, canvas.height);

      if (shadowIntensity > 0) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = shadowIntensity;
      }

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
        case "gradient":
          drawGradientLayout(ctx);
          break;
        case "glassmorphism":
          drawGlassmorphismLayout(ctx);
          break;
      }

      ctx.shadowBlur = 0;
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
      case "hexagons":
        const hexSize = 40;
        for (let y = 0; y < height; y += hexSize * 1.5) {
          for (let x = 0; x < width; x += hexSize * Math.sqrt(3)) {
            const offsetX = (y / (hexSize * 1.5)) % 2 === 0 ? 0 : (hexSize * Math.sqrt(3)) / 2;
            drawHexagon(ctx, x + offsetX, y, hexSize);
          }
        }
        break;
      case "triangles":
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = 30 + Math.random() * 70;
          ctx.beginPath();
          ctx.moveTo(x, y - size / 2);
          ctx.lineTo(x + size / 2, y + size / 2);
          ctx.lineTo(x - size / 2, y + size / 2);
          ctx.closePath();
          ctx.stroke();
        }
        break;
    }
    ctx.globalAlpha = 1;
  };

  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x + size * Math.cos(angle);
      const hy = y + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();
  };

  const drawIcon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    if (icon === "none") return;

    ctx.save();
    ctx.fillStyle = accentColor;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;

    switch (icon) {
      case "star":
        drawStar(ctx, x, y, 5, size, size / 2);
        break;
      case "fork":
        drawFork(ctx, x, y, size);
        break;
      case "eye":
        drawEye(ctx, x, y, size);
        break;
      case "zap":
        drawZap(ctx, x, y, size);
        break;
      case "shield":
        drawShield(ctx, x, y, size);
        break;
    }
    ctx.restore();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  const drawFork = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.arc(x - size / 3, y - size / 2, size / 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + size / 3, y - size / 2, size / 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y - size / 4);
    ctx.lineTo(x, y + size / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y + size / 2, size / 5, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawEye = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.ellipse(x, y, size, size / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, size / 3, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawZap = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x + size / 3, y - size / 2);
    ctx.lineTo(x - size / 4, y);
    ctx.lineTo(x + size / 6, y);
    ctx.lineTo(x - size / 3, y + size / 2);
    ctx.lineTo(x + size / 4, y + size / 8);
    ctx.lineTo(x - size / 6, y + size / 8);
    ctx.closePath();
    ctx.fill();
  };

  const drawShield = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x + size / 2, y - size / 3);
    ctx.lineTo(x + size / 2, y + size / 4);
    ctx.quadraticCurveTo(x + size / 2, y + size / 2, x, y + size / 1.5);
    ctx.quadraticCurveTo(x - size / 2, y + size / 2, x - size / 2, y + size / 4);
    ctx.lineTo(x - size / 2, y - size / 3);
    ctx.closePath();
    ctx.fill();
  };

  const drawStats = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    if (!showStats) return;

    const statItems = [
      { icon: "⭐", value: stats.stars, label: "Stars" },
      { icon: "🔱", value: stats.forks, label: "Forks" },
      { icon: "👁", value: stats.watchers, label: "Watchers" }
    ];

    ctx.textAlign = "center";
    ctx.font = `600 24px ${getFontFamily(bodyFont)}`;

    const spacing = 150;
    const startX = x - spacing;

    statItems.forEach((item, i) => {
      const itemX = startX + (i * spacing);

      ctx.fillStyle = accentColor + "30";
      ctx.fillRect(itemX - 60, y - 20, 120, 70);

      ctx.fillStyle = textColor;
      ctx.fillText(item.icon, itemX, y + 5);
      ctx.font = `700 28px ${getFontFamily(bodyFont)}`;
      ctx.fillText(item.value, itemX, y + 35);
      ctx.font = `600 24px ${getFontFamily(bodyFont)}`;
    });
  };

  const drawGradientLayout = (ctx: CanvasRenderingContext2D) => {
    const centerX = 640;
    const centerY = 320;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 500);
    gradient.addColorStop(0, accentColor + "40");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1280, 640);

    drawIcon(ctx, centerX, centerY - 150, 60);

    ctx.fillStyle = textColor;
    ctx.font = `900 ${titleSize}px ${getFontFamily(titleFont)}`;
    ctx.textAlign = "center";
    ctx.fillText(repoName, centerX, centerY + 20);

    const descGradient = ctx.createLinearGradient(0, centerY + 40, 0, centerY + 100);
    descGradient.addColorStop(0, textColor);
    descGradient.addColorStop(1, accentColor);
    ctx.fillStyle = descGradient;
    ctx.font = `${descriptionSize}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description, centerX, centerY + 80);

    ctx.fillStyle = accentColor;
    ctx.font = `600 28px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, centerX, centerY + 130);

    drawStats(ctx, centerX, centerY + 200);
  };

  const drawGlassmorphismLayout = (ctx: CanvasRenderingContext2D) => {
    const centerX = 640;
    const centerY = 320;

    ctx.fillStyle = accentColor + "20";
    ctx.filter = "blur(40px)";
    ctx.fillRect(200, 150, 880, 340);
    ctx.filter = "none";

    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    if (borderRadius > 0) {
      roundRect(ctx, 200, 150, 880, 340, borderRadius);
      ctx.fill();
    } else {
      ctx.fillRect(200, 150, 880, 340);
    }

    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    if (borderRadius > 0) {
      roundRect(ctx, 200, 150, 880, 340, borderRadius);
      ctx.stroke();
    } else {
      ctx.strokeRect(200, 150, 880, 340);
    }

    drawIcon(ctx, centerX, centerY - 100, 50);

    ctx.fillStyle = textColor;
    ctx.font = `bold ${titleSize}px ${getFontFamily(titleFont)}`;
    ctx.textAlign = "center";
    ctx.fillText(repoName, centerX, centerY + 10);

    ctx.fillStyle = adjustColor(textColor, -40);
    ctx.font = `${descriptionSize}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description, centerX, centerY + 60);

    ctx.fillStyle = accentColor;
    ctx.font = `600 26px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, centerX, centerY + 110);

    if (tagline) {
      ctx.fillStyle = adjustColor(textColor, -60);
      ctx.font = `20px ${getFontFamily(bodyFont)}`;
      ctx.fillText(tagline, centerX, centerY + 145);
    }
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const drawModernLayout = (ctx: CanvasRenderingContext2D) => {
    const centerX = 640;
    const centerY = 320;

    if (logoImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, centerX - 50, centerY - 180, 100, 100);
      };
      img.src = logoImage;
    }

    ctx.fillStyle = textColor;
    ctx.font = `bold ${titleSize}px ${getFontFamily(titleFont)}`;
    ctx.textAlign = "center";
    ctx.fillText(repoName, centerX, centerY);

    ctx.fillStyle = adjustColor(textColor, -60);
    ctx.font = `${descriptionSize}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description, centerX, centerY + 60);

    ctx.fillStyle = accentColor;
    ctx.font = `28px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, centerX, centerY + 110);

    if (tagline) {
      ctx.fillStyle = adjustColor(textColor, -80);
      ctx.font = `20px ${getFontFamily(bodyFont)}`;
      ctx.fillText(tagline, centerX, centerY + 150);
    }

    drawIcon(ctx, centerX - 200, centerY - 120, 40);
    drawStats(ctx, centerX, centerY + 220);

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

    ctx.fillStyle = textColor;
    ctx.font = `bold ${titleSize}px ${getFontFamily(titleFont)}`;
    ctx.fillText(repoName, leftMargin, topMargin);

    ctx.fillStyle = adjustColor(textColor, -60);
    ctx.font = `${descriptionSize}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description, leftMargin, topMargin + 70);

    ctx.fillStyle = accentColor;
    ctx.font = `24px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, leftMargin, topMargin + 130);

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

    const gradient = ctx.createLinearGradient(0, topY - 100, 0, topY + 100);
    gradient.addColorStop(0, textColor);
    gradient.addColorStop(1, accentColor);

    ctx.fillStyle = gradient;
    ctx.font = `900 ${titleSize + 20}px ${getFontFamily(titleFont)}`;
    ctx.fillText(repoName.toUpperCase(), centerX, topY);

    ctx.fillStyle = accentColor + "30";
    ctx.fillRect(0, topY + 50, 1280, 150);

    ctx.fillStyle = textColor;
    ctx.font = `bold ${descriptionSize + 8}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description, centerX, topY + 130);

    ctx.fillStyle = accentColor;
    ctx.fillRect(centerX - 150, topY + 180, 300, 60);
    ctx.fillStyle = bgColor;
    ctx.font = `bold 32px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, centerX, topY + 220);
  };

  const drawGamingLayout = (ctx: CanvasRenderingContext2D) => {
    const centerX = 640;
    const centerY = 320;

    ctx.globalAlpha = 0.1;
    ctx.fillStyle = accentColor;
    for (let i = -10; i < 20; i++) {
      ctx.fillRect(i * 100 - 500, 0, 50, 640);
    }
    ctx.globalAlpha = 1;

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

    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 20;
    ctx.fillStyle = textColor;
    ctx.font = `900 ${titleSize}px ${getFontFamily(titleFont)}`;
    ctx.textAlign = "center";
    ctx.fillText(repoName.toUpperCase(), centerX, centerY - 20);
    ctx.shadowBlur = 0;

    ctx.fillStyle = accentColor;
    ctx.font = `bold ${descriptionSize}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description.toUpperCase(), centerX, centerY + 40);

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
      gaming: { pattern: "dots" as PatternType, titleFont: "poppins" as FontFamily, bodyFont: "sourcecodepro" as FontFamily },
      gradient: { pattern: "waves" as PatternType, titleFont: "playfair" as FontFamily, bodyFont: "inter" as FontFamily },
      glassmorphism: { pattern: "hexagons" as PatternType, titleFont: "montserrat" as FontFamily, bodyFont: "poppins" as FontFamily }
    };
    const config = templates[template];
    setPattern(config.pattern);
    setTitleFont(config.titleFont);
    setBodyFont(config.bodyFont);
    toast.success(`${template.charAt(0).toUpperCase() + template.slice(1)} template applied!`);
  };

  const saveDesign = () => {
    const design: SavedDesign = {
      id: Date.now().toString(),
      name: `${repoName}-${Date.now()}`,
      timestamp: Date.now(),
      config: {
        repoName, description, username, tagline, bgColor, accentColor, textColor,
        useGradient, titleFont, bodyFont, titleSize, descriptionSize, layout,
        pattern, patternOpacity, stats, icon, shadowIntensity, borderRadius
      }
    };
    const updated = [...savedDesigns, design];
    setSavedDesigns(updated);
    localStorage.setItem('savedGitHubDesigns', JSON.stringify(updated));
    toast.success("Design saved!");
  };

  const loadDesign = (design: SavedDesign) => {
    const c = design.config;
    setRepoName(c.repoName);
    setDescription(c.description);
    setUsername(c.username);
    setTagline(c.tagline);
    setBgColor(c.bgColor);
    setAccentColor(c.accentColor);
    setTextColor(c.textColor);
    setUseGradient(c.useGradient);
    setTitleFont(c.titleFont);
    setBodyFont(c.bodyFont);
    setTitleSize(c.titleSize);
    setDescriptionSize(c.descriptionSize);
    setLayout(c.layout);
    setPattern(c.pattern);
    setPatternOpacity(c.patternOpacity);
    if (c.stats) setStats(c.stats);
    setIcon(c.icon);
    setShadowIntensity(c.shadowIntensity);
    setBorderRadius(c.borderRadius);
    toast.success("Design loaded!");
  };

  const deleteDesign = (id: string) => {
    const updated = savedDesigns.filter(d => d.id !== id);
    setSavedDesigns(updated);
    localStorage.setItem('savedGitHubDesigns', JSON.stringify(updated));
    toast.success("Design deleted!");
  };

  const copyImageToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        toast.success("Image copied to clipboard!");
      } catch {
        toast.error("Failed to copy image");
      }
    });
  };

  const animateRandomColors = () => {
    if (isAnimating) {
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    const colors = ["#ff6b35", "#4ecdc4", "#ffe66d", "#ff6b9d", "#95e1d3", "#a8e6cf", "#ffd3b6"];
    let index = 0;

    const interval = setInterval(() => {
      setAccentColor(colors[index % colors.length]);
      index++;
      if (index > 10) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, animationSpeed);
  };

  const exportConfig = () => {
    const config = {
      repoName, description, username, tagline, bgColor, accentColor, textColor,
      useGradient, titleFont, bodyFont, titleSize, descriptionSize, layout,
      pattern, patternOpacity, stats, icon, shadowIntensity, borderRadius
    };
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${repoName}-config.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Configuration exported!");
  };

  const importConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target?.result as string);
        setRepoName(config.repoName || repoName);
        setDescription(config.description || description);
        setUsername(config.username || username);
        setTagline(config.tagline || tagline);
        setBgColor(config.bgColor || bgColor);
        setAccentColor(config.accentColor || accentColor);
        setTextColor(config.textColor || textColor);
        setUseGradient(config.useGradient ?? useGradient);
        setTitleFont(config.titleFont || titleFont);
        setBodyFont(config.bodyFont || bodyFont);
        setTitleSize(config.titleSize || titleSize);
        setDescriptionSize(config.descriptionSize || descriptionSize);
        setLayout(config.layout || layout);
        setPattern(config.pattern || pattern);
        setPatternOpacity(config.patternOpacity ?? patternOpacity);
        if (config.stats) setStats(config.stats);
        setIcon(config.icon || icon);
        setShadowIntensity(config.shadowIntensity ?? shadowIntensity);
        setBorderRadius(config.borderRadius ?? borderRadius);
        toast.success("Configuration imported!");
      } catch {
        toast.error("Invalid configuration file");
      }
    };
    reader.readAsText(file);
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
            Create stunning social preview images for your GitHub repositories with advanced customization
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Card className="p-8 bg-card border-border hover-lift">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
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

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label>Repository Stats</Label>
                    <input
                      type="checkbox"
                      checked={showStats}
                      onChange={(e) => setShowStats(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  {showStats && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Stars</Label>
                        <Input
                          value={stats.stars}
                          onChange={(e) => setStats({...stats, stars: e.target.value})}
                          placeholder="1.2k"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Forks</Label>
                        <Input
                          value={stats.forks}
                          onChange={(e) => setStats({...stats, forks: e.target.value})}
                          placeholder="234"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Watchers</Label>
                        <Input
                          value={stats.watchers}
                          onChange={(e) => setStats({...stats, watchers: e.target.value})}
                          placeholder="89"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
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
                      <SelectItem value="playfair">Playfair Display</SelectItem>
                      <SelectItem value="orbitron">Orbitron</SelectItem>
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
                      <SelectItem value="playfair">Playfair Display</SelectItem>
                      <SelectItem value="orbitron">Orbitron</SelectItem>
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

                <div className="space-y-2">
                  <Label>Shadow Intensity: {shadowIntensity}</Label>
                  <Slider value={[shadowIntensity]} onValueChange={(v) => setShadowIntensity(v[0])} min={0} max={50} step={5} />
                </div>

                <div className="space-y-2">
                  <Label>Border Radius: {borderRadius}px</Label>
                  <Slider value={[borderRadius]} onValueChange={(v) => setBorderRadius(v[0])} min={0} max={50} step={5} />
                </div>

                <div className="flex gap-2">
                  <Button onClick={randomizeColors} variant="outline" className="flex-1">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Randomize
                  </Button>
                  <Button onClick={animateRandomColors} variant="outline" className="flex-1">
                    <Zap className="w-4 h-4 mr-2" />
                    {isAnimating ? "Stop" : "Animate"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["modern", "minimal", "bold", "gaming", "gradient", "glassmorphism"] as LayoutTemplate[]).map((t) => (
                      <Button
                        key={t}
                        onClick={() => applyTemplate(t)}
                        variant={layout === t ? "default" : "outline"}
                        className="capitalize text-xs"
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
                      <SelectItem value="hexagons">Hexagons</SelectItem>
                      <SelectItem value="triangles">Triangles</SelectItem>
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

                <div className="space-y-2">
                  <Label>Decorative Icon</Label>
                  <Select value={icon} onValueChange={(v) => setIcon(v as IconType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="star">Star</SelectItem>
                      <SelectItem value="fork">Fork</SelectItem>
                      <SelectItem value="eye">Eye</SelectItem>
                      <SelectItem value="zap">Lightning</SelectItem>
                      <SelectItem value="shield">Shield</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
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

            <div className="space-y-3 pt-6 mt-6 border-t border-border">
              <div className="flex gap-2">
                <Button onClick={downloadImage} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={copyImageToClipboard} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveDesign} variant="outline" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Design
                </Button>
                <Button onClick={exportConfig} variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export Config
                </Button>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importConfig}
                  className="hidden"
                  id="config-import"
                />
                <Button
                  onClick={() => document.getElementById('config-import')?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Import Config
                </Button>
              </div>

              {savedDesigns.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <Label className="mb-2 block">Saved Designs ({savedDesigns.length})</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {savedDesigns.map((design) => (
                      <div key={design.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <Button
                          onClick={() => loadDesign(design)}
                          variant="ghost"
                          size="sm"
                          className="flex-1 justify-start text-xs"
                        >
                          {design.config.repoName}
                        </Button>
                        <Button
                          onClick={() => deleteDesign(design.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

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
