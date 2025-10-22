import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Download, RefreshCw, Upload, Image as ImageIcon, Sparkles, Copy, Save, FolderOpen, Move, Palette, Layers } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

type LayoutTemplate = "modern" | "minimal" | "bold" | "gaming" | "gradient" | "glassmorphism" | "neon" | "retro" | "tech" | "corporate" | "cyberpunk" | "elegant";
type PatternType = "circles" | "grid" | "dots" | "waves" | "hexagons" | "triangles" | "stars" | "mesh" | "noise" | "none";
type FontFamily = "poppins" | "inter" | "sourcecodepro" | "roboto" | "montserrat" | "playfair" | "orbitron" | "lato" | "opensans" | "raleway" | "nunito" | "ubuntu" | "merriweather" | "josefinsans" | "inconsolata" | "firamono" | "outfit" | "spacegrotesk" | "manrope" | "worksans" | "dmsans" | "plusjakarta" | "bevietnampro" | "redhatdisplay" | "jetbrainsmono" | "ibmplexmono" | "spacemono" | "arcadeclass" | "pressstart2p" | "vt323";
type IconType = "none" | "star" | "fork" | "eye" | "zap" | "shield";
type TextAlign = "left" | "center" | "right";
type FontWeight = "300" | "400" | "500" | "600" | "700" | "800" | "900";
type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";
type GradientType = "linear" | "radial" | "conic";

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
  bgBlur: number;
  glowEffect: boolean;
  textStroke: boolean;
  textAlign: TextAlign;
  overlayOpacity: number;
  titleWeight?: FontWeight;
  bodyWeight?: FontWeight;
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: TextTransform;
  gradientType?: GradientType;
  gradientAngle?: number;
  secondaryAccentColor?: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
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
  
  // New advanced features
  const [bgBlur, setBgBlur] = useState(0);
  const [glowEffect, setGlowEffect] = useState(false);
  const [textStroke, setTextStroke] = useState(false);
  const [textAlign, setTextAlign] = useState<TextAlign>("center");
  const [overlayOpacity, setOverlayOpacity] = useState(60);
  const [secondaryText, setSecondaryText] = useState("Built with ❤️");
  const [badges, setBadges] = useState<string[]>(["TypeScript", "React", "Node.js"]);
  const [faviconUrl, setFaviconUrl] = useState("https://github.githubassets.com/favicons/favicon.svg");
  
  // Additional advanced styling features
  const [titleWeight, setTitleWeight] = useState<FontWeight>("700");
  const [bodyWeight, setBodyWeight] = useState<FontWeight>("400");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.2);
  const [textTransform, setTextTransform] = useState<TextTransform>("none");
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [gradientAngle, setGradientAngle] = useState(135);
  const [secondaryAccentColor, setSecondaryAccentColor] = useState("#4ecdc4");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  
  // Undo/Redo history
  const [history, setHistory] = useState<DesignConfig[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isRestoringHistory, setIsRestoringHistory] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z (or Cmd+Z on Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Redo: Ctrl+Shift+Z or Ctrl+Y (or Cmd equivalents on Mac)
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || 
          ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        redo();
      }
      // Save: Ctrl+S (or Cmd+S on Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDesign();
      }
      // Download: Ctrl+D (or Cmd+D on Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        downloadImage();
      }
      // Copy: Ctrl+C (or Cmd+C on Mac) - only when not in an input
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        copyImageToClipboard();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyIndex, history]);

  useEffect(() => {
    generateImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoName, description, username, tagline, bgColor, accentColor, textColor,
      useGradient, titleFont, bodyFont, titleSize, descriptionSize, layout,
      pattern, patternOpacity, bgImage, logoImage, stats, showStats, icon, shadowIntensity, 
      borderRadius, bgBlur, glowEffect, textStroke, textAlign, overlayOpacity, secondaryText, badges, faviconUrl,
      titleWeight, bodyWeight, letterSpacing, lineHeight, textTransform, gradientType, gradientAngle, 
      secondaryAccentColor, brightness, contrast, saturation]);

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
      orbitron: "Orbitron, sans-serif",
      lato: "Lato, sans-serif",
      opensans: "Open Sans, sans-serif",
      raleway: "Raleway, sans-serif",
      nunito: "Nunito, sans-serif",
      ubuntu: "Ubuntu, sans-serif",
      merriweather: "Merriweather, serif",
      josefinsans: "Josefin Sans, sans-serif",
      inconsolata: "Inconsolata, monospace",
      firamono: "Fira Mono, monospace",
      outfit: "Outfit, sans-serif",
      spacegrotesk: "Space Grotesk, sans-serif",
      manrope: "Manrope, sans-serif",
      worksans: "Work Sans, sans-serif",
      dmsans: "DM Sans, sans-serif",
      plusjakarta: "Plus Jakarta Sans, sans-serif",
      bevietnampro: "Be Vietnam Pro, sans-serif",
      redhatdisplay: "Red Hat Display, sans-serif",
      jetbrainsmono: "JetBrains Mono, monospace",
      ibmplexmono: "IBM Plex Mono, monospace",
      spacemono: "Space Mono, monospace",
      arcadeclass: "Arcade Classic, monospace",
      pressstart2p: "Press Start 2P, monospace",
      vt323: "VT323, monospace"
    };
    return fonts[font];
  };

  const applyTextTransform = (text: string) => {
    switch (textTransform) {
      case "uppercase": return text.toUpperCase();
      case "lowercase": return text.toLowerCase();
      case "capitalize": return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      default: return text;
    }
  };

  const adjustColor = (color: string, amount: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
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

  const drawStatsFallback = (ctx: CanvasRenderingContext2D, x: number, y: number, statItems: Array<{icon: string; value: string; label: string}>) => {
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

  const drawStats = async (ctx: CanvasRenderingContext2D, x: number, y: number) => {
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

    // Load and draw favicon if URL is provided
    if (faviconUrl) {
      try {
        const faviconImg = new Image();
        faviconImg.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          faviconImg.onload = () => resolve();
          faviconImg.onerror = () => reject();
          faviconImg.src = faviconUrl;
        });
        
        statItems.forEach((item, i) => {
          const itemX = startX + (i * spacing);

          ctx.fillStyle = accentColor + "30";
          ctx.fillRect(itemX - 60, y - 20, 120, 70);

          // Draw favicon instead of emoji
          ctx.drawImage(faviconImg, itemX - 15, y - 15, 30, 30);
          
          ctx.fillStyle = textColor;
          ctx.font = `700 28px ${getFontFamily(bodyFont)}`;
          ctx.fillText(item.value, itemX, y + 35);
          ctx.font = `600 24px ${getFontFamily(bodyFont)}`;
        });
      } catch (error) {
        // Fallback to emoji if favicon fails to load
        drawStatsFallback(ctx, x, y, statItems);
      }
    } else {
      drawStatsFallback(ctx, x, y, statItems);
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

  // Save current state to history whenever key properties change
  useEffect(() => {
    if (isRestoringHistory) {
      setIsRestoringHistory(false);
      return;
    }

    const currentState: DesignConfig = {
      repoName, description, username, tagline, bgColor, accentColor, textColor,
      useGradient, titleFont, bodyFont, titleSize, descriptionSize, layout,
      pattern, patternOpacity, stats, icon, shadowIntensity, borderRadius,
      bgBlur, glowEffect, textStroke, textAlign, overlayOpacity,
      titleWeight, bodyWeight, letterSpacing, lineHeight, textTransform,
      gradientType, gradientAngle, secondaryAccentColor, brightness, contrast, saturation
    };

    // Only add to history if something actually changed
    if (historyIndex === -1 || JSON.stringify(currentState) !== JSON.stringify(history[historyIndex])) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(currentState);
      // Keep only last 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
      } else {
        setHistoryIndex(historyIndex + 1);
      }
      setHistory(newHistory);
    }
  }, [repoName, description, username, tagline, bgColor, accentColor, textColor,
      useGradient, titleFont, bodyFont, titleSize, descriptionSize, layout,
      pattern, patternOpacity, stats, icon, shadowIntensity, borderRadius,
      bgBlur, glowEffect, textStroke, textAlign, overlayOpacity,
      titleWeight, bodyWeight, letterSpacing, lineHeight, textTransform,
      gradientType, gradientAngle, secondaryAccentColor, brightness, contrast, saturation]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      restoreState(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      restoreState(history[newIndex]);
    }
  };

  const restoreState = (state: DesignConfig) => {
    setIsRestoringHistory(true);
    setRepoName(state.repoName);
    setDescription(state.description);
    setUsername(state.username);
    setTagline(state.tagline);
    setBgColor(state.bgColor);
    setAccentColor(state.accentColor);
    setTextColor(state.textColor);
    setUseGradient(state.useGradient);
    setTitleFont(state.titleFont);
    setBodyFont(state.bodyFont);
    setTitleSize(state.titleSize);
    setDescriptionSize(state.descriptionSize);
    setLayout(state.layout);
    setPattern(state.pattern);
    setPatternOpacity(state.patternOpacity);
    if (state.stats) setStats(state.stats);
    setIcon(state.icon);
    setShadowIntensity(state.shadowIntensity);
    setBorderRadius(state.borderRadius);
    setBgBlur(state.bgBlur);
    setGlowEffect(state.glowEffect);
    setTextStroke(state.textStroke);
    setTextAlign(state.textAlign);
    setOverlayOpacity(state.overlayOpacity);
    if (state.titleWeight) setTitleWeight(state.titleWeight);
    if (state.bodyWeight) setBodyWeight(state.bodyWeight);
    if (state.letterSpacing !== undefined) setLetterSpacing(state.letterSpacing);
    if (state.lineHeight) setLineHeight(state.lineHeight);
    if (state.textTransform) setTextTransform(state.textTransform);
    if (state.gradientType) setGradientType(state.gradientType);
    if (state.gradientAngle !== undefined) setGradientAngle(state.gradientAngle);
    if (state.secondaryAccentColor) setSecondaryAccentColor(state.secondaryAccentColor);
    if (state.brightness !== undefined) setBrightness(state.brightness);
    if (state.contrast !== undefined) setContrast(state.contrast);
    if (state.saturation !== undefined) setSaturation(state.saturation);
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
        // Apply filters to background image if enabled
        const filters = [];
        if (bgBlur > 0) filters.push(`blur(${bgBlur}px)`);
        if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
        if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
        if (saturation !== 100) filters.push(`saturate(${saturation}%)`);
        
        ctx.filter = filters.length > 0 ? filters.join(' ') : 'none';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.filter = "none";
        
        // Apply overlay
        ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity / 100})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        continueDrawing();
      };
      img.src = bgImage;
    } else {
      if (useGradient) {
        let gradient;
        if (gradientType === "linear") {
          const angle = (gradientAngle * Math.PI) / 180;
          const x1 = canvas.width / 2 - Math.cos(angle) * canvas.width / 2;
          const y1 = canvas.height / 2 - Math.sin(angle) * canvas.height / 2;
          const x2 = canvas.width / 2 + Math.cos(angle) * canvas.width / 2;
          const y2 = canvas.height / 2 + Math.sin(angle) * canvas.height / 2;
          gradient = ctx.createLinearGradient(x1, y1, x2, y2);
          gradient.addColorStop(0, bgColor);
          gradient.addColorStop(0.5, secondaryAccentColor + "40");
          gradient.addColorStop(1, adjustColor(bgColor, -20));
        } else if (gradientType === "radial") {
          gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
          gradient.addColorStop(0, bgColor);
          gradient.addColorStop(0.7, secondaryAccentColor + "30");
          gradient.addColorStop(1, adjustColor(bgColor, -30));
        } else {
          // conic gradient fallback to linear
          gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, bgColor);
          gradient.addColorStop(0.33, accentColor + "40");
          gradient.addColorStop(0.66, secondaryAccentColor + "40");
          gradient.addColorStop(1, adjustColor(bgColor, -20));
        }
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
        case "neon":
          drawNeonLayout(ctx);
          break;
        case "retro":
          drawRetroLayout(ctx);
          break;
        case "tech":
          drawTechLayout(ctx);
          break;
        case "corporate":
          drawCorporateLayout(ctx);
          break;
        case "cyberpunk":
          drawCyberpunkLayout(ctx);
          break;
        case "elegant":
          drawElegantLayout(ctx);
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
      case "hexagons": {
        const hexSize = 40;
        for (let y = 0; y < height; y += hexSize * 1.5) {
          for (let x = 0; x < width; x += hexSize * Math.sqrt(3)) {
            const offsetX = (y / (hexSize * 1.5)) % 2 === 0 ? 0 : (hexSize * Math.sqrt(3)) / 2;
            drawHexagon(ctx, x + offsetX, y, hexSize);
          }
        }
        break;
      }
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
      case "stars":
        for (let i = 0; i < 15; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = 20 + Math.random() * 30;
          drawStar(ctx, x, y, 5, size, size / 2);
        }
        break;
      case "mesh":
        ctx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random() * width, Math.random() * height);
          ctx.lineTo(Math.random() * width, Math.random() * height);
          ctx.stroke();
        }
        break;
      case "noise":
        for (let i = 0; i < 1000; i++) {
          ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
        }
        break;
    }
    ctx.globalAlpha = 1;
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
    ctx.font = `${titleWeight} ${titleSize}px ${getFontFamily(titleFont)}`;
    ctx.textAlign = "center";
    if (letterSpacing !== 0) {
      ctx.letterSpacing = `${letterSpacing}px`;
    }
    const transformedTitle = applyTextTransform(repoName);
    ctx.fillText(transformedTitle, centerX, centerY);
    ctx.letterSpacing = "0px";

    ctx.fillStyle = adjustColor(textColor, -60);
    ctx.font = `${bodyWeight} ${descriptionSize}px ${getFontFamily(bodyFont)}`;
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

  const drawNeonLayout = (ctx: CanvasRenderingContext2D) => {
    const centerX = 640;
    const centerY = 320;

    // Neon glow effect
    if (glowEffect) {
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 40;
    }

    // Draw neon border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 8;
    roundRect(ctx, 100, 100, 1080, 440, 20);
    ctx.stroke();

    // Draw inner neon border
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 2;
    roundRect(ctx, 120, 120, 1040, 400, 15);
    ctx.stroke();

    ctx.shadowBlur = glowEffect ? 30 : 0;

    // Title with neon effect
    ctx.fillStyle = accentColor;
    ctx.font = `900 ${titleSize}px ${getFontFamily(titleFont)}`;
    ctx.textAlign = textAlign;
    const titleX = textAlign === "center" ? centerX : textAlign === "left" ? 150 : 1130;
    ctx.fillText(repoName.toUpperCase(), titleX, centerY - 50);

    ctx.shadowColor = textColor;
    ctx.shadowBlur = glowEffect ? 20 : 0;
    ctx.fillStyle = textColor;
    ctx.font = `${descriptionSize}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description, titleX, centerY + 20);

    ctx.shadowBlur = 0;
    ctx.fillStyle = accentColor;
    ctx.font = `600 28px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, titleX, centerY + 70);

    if (secondaryText) {
      ctx.fillStyle = adjustColor(textColor, -40);
      ctx.font = `22px ${getFontFamily(bodyFont)}`;
      ctx.fillText(secondaryText, titleX, centerY + 110);
    }

    // Draw badges
    if (badges.length > 0) {
      const badgeY = centerY + 150;
      const badgeSpacing = 120;
      const startX = centerX - ((badges.length - 1) * badgeSpacing) / 2;
      
      badges.forEach((badge, i) => {
        const x = startX + i * badgeSpacing;
        ctx.fillStyle = accentColor + "30";
        ctx.fillRect(x - 50, badgeY, 100, 35);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 50, badgeY, 100, 35);
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.font = `16px ${getFontFamily(bodyFont)}`;
        ctx.fillText(badge, x, badgeY + 23);
      });
    }
  };

  const drawRetroLayout = (ctx: CanvasRenderingContext2D) => {
    const centerX = 640;
    const centerY = 320;

    // Retro stripes background
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = `${accentColor}${(30 - i * 3).toString(16)}`;
      ctx.fillRect(0, i * 64, 1280, 64);
    }

    // Retro text shadow effect
    for (let i = 10; i > 0; i--) {
      ctx.fillStyle = adjustColor(accentColor, -i * 10);
      ctx.font = `900 ${titleSize}px ${getFontFamily(titleFont)}`;
      ctx.textAlign = "center";
      ctx.fillText(repoName.toUpperCase(), centerX + i * 2, centerY - i * 2);
    }

    ctx.fillStyle = textColor;
    ctx.font = `900 ${titleSize}px ${getFontFamily(titleFont)}`;
    ctx.textAlign = "center";
    ctx.fillText(repoName.toUpperCase(), centerX, centerY);

    // Retro description box
    ctx.fillStyle = accentColor;
    ctx.fillRect(centerX - 400, centerY + 40, 800, 100);
    ctx.fillStyle = bgColor;
    ctx.fillRect(centerX - 390, centerY + 50, 780, 80);

    ctx.fillStyle = accentColor;
    ctx.font = `bold ${descriptionSize}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description, centerX, centerY + 100);

    ctx.fillStyle = textColor;
    ctx.font = `700 30px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, centerX, centerY + 170);
  };

  const drawTechLayout = (ctx: CanvasRenderingContext2D) => {
    const leftMargin = 100;
    const topMargin = 150;

    // Tech grid background
    ctx.strokeStyle = accentColor + "20";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1280; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 640);
      ctx.stroke();
    }
    for (let y = 0; y < 640; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1280, y);
      ctx.stroke();
    }

    // Tech accent panels
    ctx.fillStyle = accentColor + "10";
    ctx.fillRect(0, 0, 400, 640);
    ctx.fillStyle = accentColor + "05";
    ctx.fillRect(880, 0, 400, 640);

    // Main content area
    ctx.fillStyle = bgColor + "dd";
    roundRect(ctx, leftMargin, topMargin, 1080, 340, 15);
    ctx.fill();

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    roundRect(ctx, leftMargin, topMargin, 1080, 340, 15);
    ctx.stroke();

    // Corner brackets (tech style)
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    // Top left
    ctx.beginPath();
    ctx.moveTo(leftMargin + 30, topMargin);
    ctx.lineTo(leftMargin, topMargin);
    ctx.lineTo(leftMargin, topMargin + 30);
    ctx.stroke();
    // Top right
    ctx.beginPath();
    ctx.moveTo(1180 - 30, topMargin);
    ctx.lineTo(1180, topMargin);
    ctx.lineTo(1180, topMargin + 30);
    ctx.stroke();
    // Bottom left
    ctx.beginPath();
    ctx.moveTo(leftMargin, topMargin + 340 - 30);
    ctx.lineTo(leftMargin, topMargin + 340);
    ctx.lineTo(leftMargin + 30, topMargin + 340);
    ctx.stroke();
    // Bottom right
    ctx.beginPath();
    ctx.moveTo(1180, topMargin + 340 - 30);
    ctx.lineTo(1180, topMargin + 340);
    ctx.lineTo(1180 - 30, topMargin + 340);
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.fillStyle = accentColor;
    ctx.font = `900 ${titleSize}px ${getFontFamily(titleFont)}`;
    ctx.fillText(repoName, leftMargin + 50, topMargin + 120);

    if (textStroke) {
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.strokeText(repoName, leftMargin + 50, topMargin + 120);
    }

    ctx.fillStyle = textColor;
    ctx.font = `${descriptionSize}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description, leftMargin + 50, topMargin + 180);

    ctx.fillStyle = accentColor;
    ctx.font = `600 26px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, leftMargin + 50, topMargin + 240);

    // Tech indicator line
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(leftMargin + 50, topMargin + 260);
    ctx.lineTo(leftMargin + 300, topMargin + 260);
    ctx.stroke();
  };

  const drawCorporateLayout = (ctx: CanvasRenderingContext2D) => {
    const leftMargin = 120;
    const topMargin = 200;

    // Clean background with subtle accent
    ctx.fillStyle = accentColor + "08";
    ctx.fillRect(0, 0, 640, 640);

    // Main title
    ctx.textAlign = "left";
    ctx.fillStyle = textColor;
    ctx.font = `700 ${titleSize}px ${getFontFamily(titleFont)}`;
    ctx.fillText(repoName, leftMargin, topMargin);

    // Accent line
    ctx.fillStyle = accentColor;
    ctx.fillRect(leftMargin, topMargin + 20, 400, 6);

    // Description
    ctx.fillStyle = adjustColor(textColor, -50);
    ctx.font = `${descriptionSize}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description, leftMargin, topMargin + 90);

    // Username in accent color
    ctx.fillStyle = accentColor;
    ctx.font = `600 28px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, leftMargin, topMargin + 150);

    // Professional badge area
    if (badges.length > 0) {
      let offsetX = leftMargin;
      badges.forEach((badge) => {
        ctx.fillStyle = accentColor + "15";
        const width = ctx.measureText(badge).width;
        ctx.fillRect(offsetX, topMargin + 180, width + 30, 40);
        ctx.fillStyle = textColor;
        ctx.font = `500 18px ${getFontFamily(bodyFont)}`;
        ctx.fillText(badge, offsetX + 15, topMargin + 205);
        offsetX += width + 45;
      });
    }
  };

  const drawCyberpunkLayout = (ctx: CanvasRenderingContext2D) => {
    const centerX = 640;
    const centerY = 320;

    // Cyberpunk scan lines
    for (let y = 0; y < 640; y += 4) {
      ctx.fillStyle = y % 8 === 0 ? "rgba(0, 0, 0, 0.3)" : "transparent";
      ctx.fillRect(0, y, 1280, 2);
    }

    // Glitch bars
    ctx.fillStyle = accentColor + "20";
    ctx.fillRect(0, centerY - 150, 1280, 8);
    ctx.fillRect(0, centerY + 150, 1280, 8);

    // Cyberpunk corner elements
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(150, 50);
    ctx.lineTo(150, 150);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1230, 50);
    ctx.lineTo(1130, 50);
    ctx.lineTo(1130, 150);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50, 590);
    ctx.lineTo(150, 590);
    ctx.lineTo(150, 490);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1230, 590);
    ctx.lineTo(1130, 590);
    ctx.lineTo(1130, 490);
    ctx.stroke();

    // Glitch effect on title
    if (glowEffect) {
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 50;
    }

    // Main title with cyberpunk style
    ctx.fillStyle = accentColor;
    ctx.font = `900 ${titleSize + 10}px ${getFontFamily(titleFont)}`;
    ctx.textAlign = "center";
    ctx.fillText(repoName.toUpperCase(), centerX + 2, centerY - 40);

    ctx.fillStyle = textColor;
    ctx.fillText(repoName.toUpperCase(), centerX, centerY - 42);

    ctx.shadowBlur = 0;

    // Description with glitch offset
    ctx.fillStyle = accentColor + "80";
    ctx.font = `bold ${descriptionSize}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description, centerX + 1, centerY + 30);

    ctx.fillStyle = textColor;
    ctx.fillText(description, centerX, centerY + 28);

    // Username in highlighted box
    ctx.fillStyle = accentColor;
    ctx.fillRect(centerX - 150, centerY + 60, 300, 50);
    ctx.fillStyle = bgColor;
    ctx.font = `bold 30px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, centerX, centerY + 95);

    // Cyberpunk indicators
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(80, 80, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1200, 80, 10, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawElegantLayout = (ctx: CanvasRenderingContext2D) => {
    const centerX = 640;
    const centerY = 320;

    // Elegant gradient overlay
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 600);
    gradient.addColorStop(0, "transparent");
    gradient.addColorStop(0.7, accentColor + "10");
    gradient.addColorStop(1, accentColor + "30");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1280, 640);

    // Elegant decorative elements
    ctx.strokeStyle = accentColor + "40";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY - 180, 60, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY - 180, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Elegant title
    ctx.textAlign = "center";
    ctx.fillStyle = textColor;
    ctx.font = `${titleSize}px ${getFontFamily(titleFont)}`;
    ctx.fillText(repoName, centerX, centerY - 20);

    // Elegant divider
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 100, centerY + 15);
    ctx.lineTo(centerX - 30, centerY + 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX, centerY + 15, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(centerX + 30, centerY + 15);
    ctx.lineTo(centerX + 100, centerY + 15);
    ctx.stroke();

    // Description
    ctx.fillStyle = adjustColor(textColor, -40);
    ctx.font = `italic ${descriptionSize}px ${getFontFamily(bodyFont)}`;
    ctx.fillText(description, centerX, centerY + 70);

    // Username with elegant styling
    ctx.fillStyle = accentColor;
    ctx.font = `600 26px ${getFontFamily(bodyFont)}`;
    ctx.fillText(`@${username}`, centerX, centerY + 120);

    // Decorative corner flourishes
    ctx.strokeStyle = accentColor + "60";
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI / 2) * i;
      const x = centerX + Math.cos(angle) * 400;
      const y = centerY + Math.sin(angle) * 250;
      ctx.beginPath();
      ctx.arc(x, y, 20, angle - Math.PI / 4, angle + Math.PI / 4);
      ctx.stroke();
    }
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

  const applyColorScheme = (scheme: string) => {
    const schemes: Record<string, { bg: string; accent: string; secondary: string; text: string }> = {
      ocean: { bg: "#0a2342", accent: "#2ca58d", secondary: "#84bcda", text: "#f1f1f1" },
      sunset: { bg: "#1a1423", accent: "#f77f00", secondary: "#fcbf49", text: "#eae2b7" },
      forest: { bg: "#0d1b2a", accent: "#2d6a4f", secondary: "#52b788", text: "#d8f3dc" },
      monochrome: { bg: "#1a1a1a", accent: "#ffffff", secondary: "#cccccc", text: "#f5f5f5" },
      cyberpunk: { bg: "#0a0e27", accent: "#ff006e", secondary: "#00f5ff", text: "#ffffff" },
      vintage: { bg: "#2d2424", accent: "#d4a373", secondary: "#8b6f47", text: "#f5e6d3" },
      midnight: { bg: "#0f0e17", accent: "#ff8906", secondary: "#f25f4c", text: "#fffffe" },
      nature: { bg: "#132a13", accent: "#90a955", secondary: "#ecf39e", text: "#f0f7ee" },
      pastel: { bg: "#fef6f0", accent: "#ff6b9d", secondary: "#c9ada7", text: "#22223b" },
      corporate: { bg: "#14213d", accent: "#fca311", secondary: "#e5e5e5", text: "#ffffff" },
      neon: { bg: "#000000", accent: "#00ff41", secondary: "#ff00ff", text: "#ffffff" },
      royal: { bg: "#1a0b2e", accent: "#7b2cbf", secondary: "#c77dff", text: "#e0aaff" }
    };
    
    const selected = schemes[scheme];
    if (selected) {
      setBgColor(selected.bg);
      setAccentColor(selected.accent);
      setSecondaryAccentColor(selected.secondary);
      setTextColor(selected.text);
      toast.success(`${scheme.charAt(0).toUpperCase() + scheme.slice(1)} color scheme applied!`);
    }
  };

  const applyTemplate = (template: LayoutTemplate) => {
    setLayout(template);
    const templates: Record<LayoutTemplate, { pattern: PatternType; titleFont: FontFamily; bodyFont: FontFamily }> = {
      modern: { pattern: "circles" as PatternType, titleFont: "poppins" as FontFamily, bodyFont: "inter" as FontFamily },
      minimal: { pattern: "none" as PatternType, titleFont: "inter" as FontFamily, bodyFont: "sourcecodepro" as FontFamily },
      bold: { pattern: "grid" as PatternType, titleFont: "montserrat" as FontFamily, bodyFont: "roboto" as FontFamily },
      gaming: { pattern: "dots" as PatternType, titleFont: "poppins" as FontFamily, bodyFont: "sourcecodepro" as FontFamily },
      gradient: { pattern: "waves" as PatternType, titleFont: "playfair" as FontFamily, bodyFont: "inter" as FontFamily },
      glassmorphism: { pattern: "hexagons" as PatternType, titleFont: "montserrat" as FontFamily, bodyFont: "poppins" as FontFamily },
      neon: { pattern: "grid" as PatternType, titleFont: "orbitron" as FontFamily, bodyFont: "sourcecodepro" as FontFamily },
      retro: { pattern: "waves" as PatternType, titleFont: "poppins" as FontFamily, bodyFont: "roboto" as FontFamily },
      tech: { pattern: "mesh" as PatternType, titleFont: "sourcecodepro" as FontFamily, bodyFont: "inter" as FontFamily },
      corporate: { pattern: "none" as PatternType, titleFont: "montserrat" as FontFamily, bodyFont: "inter" as FontFamily },
      cyberpunk: { pattern: "noise" as PatternType, titleFont: "orbitron" as FontFamily, bodyFont: "sourcecodepro" as FontFamily },
      elegant: { pattern: "dots" as PatternType, titleFont: "playfair" as FontFamily, bodyFont: "poppins" as FontFamily }
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
        pattern, patternOpacity, stats, icon, shadowIntensity, borderRadius,
        bgBlur, glowEffect, textStroke, textAlign, overlayOpacity,
        titleWeight, bodyWeight, letterSpacing, lineHeight, textTransform,
        gradientType, gradientAngle, secondaryAccentColor, brightness, contrast, saturation
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
    setBgBlur(c.bgBlur || 0);
    setGlowEffect(c.glowEffect || false);
    setTextStroke(c.textStroke || false);
    setTextAlign(c.textAlign || "center");
    setOverlayOpacity(c.overlayOpacity || 60);
    if (c.titleWeight) setTitleWeight(c.titleWeight);
    if (c.bodyWeight) setBodyWeight(c.bodyWeight);
    if (c.letterSpacing !== undefined) setLetterSpacing(c.letterSpacing);
    if (c.lineHeight) setLineHeight(c.lineHeight);
    if (c.textTransform) setTextTransform(c.textTransform);
    if (c.gradientType) setGradientType(c.gradientType);
    if (c.gradientAngle !== undefined) setGradientAngle(c.gradientAngle);
    if (c.secondaryAccentColor) setSecondaryAccentColor(c.secondaryAccentColor);
    if (c.brightness !== undefined) setBrightness(c.brightness);
    if (c.contrast !== undefined) setContrast(c.contrast);
    if (c.saturation !== undefined) setSaturation(c.saturation);
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Button 
                  onClick={undo} 
                  disabled={historyIndex <= 0}
                  variant="outline" 
                  size="sm"
                  title="Undo (Ctrl+Z)"
                >
                  <RefreshCw className="w-4 h-4 mr-1 rotate-180" />
                  Undo
                </Button>
                <Button 
                  onClick={redo} 
                  disabled={historyIndex >= history.length - 1}
                  variant="outline" 
                  size="sm"
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Redo
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">
                {history.length > 0 && `${historyIndex + 1}/${history.length}`}
              </span>
            </div>
            
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
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
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="favicon-url">Repository Favicon URL</Label>
                    <Input
                      id="favicon-url"
                      value={faviconUrl}
                      onChange={(e) => setFaviconUrl(e.target.value)}
                      placeholder="https://github.githubassets.com/favicons/favicon.svg"
                    />
                    <p className="text-xs text-muted-foreground">Icon shown with stats (leave default for GitHub icon)</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <Label htmlFor="secondary-text">Secondary Text (Optional)</Label>
                  <Input
                    id="secondary-text"
                    value={secondaryText}
                    onChange={(e) => setSecondaryText(e.target.value)}
                    placeholder="Built with ❤️"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tech Badges (comma separated)</Label>
                  <Input
                    value={badges.join(", ")}
                    onChange={(e) => setBadges(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                    placeholder="TypeScript, React, Node.js"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {badges.map((badge, i) => (
                      <span key={i} className="px-2 py-1 bg-accent/20 text-xs rounded">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                <div className="space-y-2">
                  <Label>Title Font</Label>
                  <Select value={titleFont} onValueChange={(v) => setTitleFont(v as FontFamily)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="sourcecodepro">Source Code Pro</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                      <SelectItem value="playfair">Playfair Display</SelectItem>
                      <SelectItem value="orbitron">Orbitron</SelectItem>
                      <SelectItem value="lato">Lato</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                      <SelectItem value="raleway">Raleway</SelectItem>
                      <SelectItem value="nunito">Nunito</SelectItem>
                      <SelectItem value="ubuntu">Ubuntu</SelectItem>
                      <SelectItem value="merriweather">Merriweather</SelectItem>
                      <SelectItem value="josefinsans">Josefin Sans</SelectItem>
                      <SelectItem value="inconsolata">Inconsolata</SelectItem>
                      <SelectItem value="firamono">Fira Mono</SelectItem>
                      <SelectItem value="outfit">Outfit</SelectItem>
                      <SelectItem value="spacegrotesk">Space Grotesk</SelectItem>
                      <SelectItem value="manrope">Manrope</SelectItem>
                      <SelectItem value="worksans">Work Sans</SelectItem>
                      <SelectItem value="dmsans">DM Sans</SelectItem>
                      <SelectItem value="plusjakarta">Plus Jakarta Sans</SelectItem>
                      <SelectItem value="bevietnampro">Be Vietnam Pro</SelectItem>
                      <SelectItem value="redhatdisplay">Red Hat Display</SelectItem>
                      <SelectItem value="jetbrainsmono">JetBrains Mono</SelectItem>
                      <SelectItem value="ibmplexmono">IBM Plex Mono</SelectItem>
                      <SelectItem value="spacemono">Space Mono</SelectItem>
                      <SelectItem value="arcadeclass">Arcade Classic</SelectItem>
                      <SelectItem value="pressstart2p">Press Start 2P</SelectItem>
                      <SelectItem value="vt323">VT323</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Body Font</Label>
                  <Select value={bodyFont} onValueChange={(v) => setBodyFont(v as FontFamily)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="sourcecodepro">Source Code Pro</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                      <SelectItem value="playfair">Playfair Display</SelectItem>
                      <SelectItem value="orbitron">Orbitron</SelectItem>
                      <SelectItem value="lato">Lato</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                      <SelectItem value="raleway">Raleway</SelectItem>
                      <SelectItem value="nunito">Nunito</SelectItem>
                      <SelectItem value="ubuntu">Ubuntu</SelectItem>
                      <SelectItem value="merriweather">Merriweather</SelectItem>
                      <SelectItem value="josefinsans">Josefin Sans</SelectItem>
                      <SelectItem value="inconsolata">Inconsolata</SelectItem>
                      <SelectItem value="firamono">Fira Mono</SelectItem>
                      <SelectItem value="outfit">Outfit</SelectItem>
                      <SelectItem value="spacegrotesk">Space Grotesk</SelectItem>
                      <SelectItem value="manrope">Manrope</SelectItem>
                      <SelectItem value="worksans">Work Sans</SelectItem>
                      <SelectItem value="dmsans">DM Sans</SelectItem>
                      <SelectItem value="plusjakarta">Plus Jakarta Sans</SelectItem>
                      <SelectItem value="bevietnampro">Be Vietnam Pro</SelectItem>
                      <SelectItem value="redhatdisplay">Red Hat Display</SelectItem>
                      <SelectItem value="jetbrainsmono">JetBrains Mono</SelectItem>
                      <SelectItem value="ibmplexmono">IBM Plex Mono</SelectItem>
                      <SelectItem value="spacemono">Space Mono</SelectItem>
                      <SelectItem value="arcadeclass">Arcade Classic</SelectItem>
                      <SelectItem value="pressstart2p">Press Start 2P</SelectItem>
                      <SelectItem value="vt323">VT323</SelectItem>
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

                <div className="space-y-2 pt-4 border-t border-border">
                  <Label>Text Alignment</Label>
                  <Select value={textAlign} onValueChange={(v) => setTextAlign(v as TextAlign)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label>Glow Effect</Label>
                    <Switch checked={glowEffect} onCheckedChange={setGlowEffect} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Text Stroke</Label>
                    <Switch checked={textStroke} onCheckedChange={setTextStroke} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={randomizeColors} variant="outline" className="flex-1">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Randomize Colors
                  </Button>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <Label>Color Schemes</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["ocean", "sunset", "forest", "monochrome", "cyberpunk", "vintage", "midnight", "nature", "pastel", "corporate", "neon", "royal"].map((scheme) => (
                      <Button
                        key={scheme}
                        onClick={() => applyColorScheme(scheme)}
                        variant="outline"
                        className="capitalize text-xs"
                      >
                        {scheme}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["modern", "minimal", "bold", "gaming", "gradient", "glassmorphism", "neon", "retro", "tech", "corporate", "cyberpunk", "elegant"] as LayoutTemplate[]).map((t) => (
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
                      <SelectItem value="stars">Stars</SelectItem>
                      <SelectItem value="mesh">Mesh</SelectItem>
                      <SelectItem value="noise">Noise</SelectItem>
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

                <div className="space-y-2 pt-4 border-t border-border">
                  <Label>Background Blur: {bgBlur}px</Label>
                  <Slider value={[bgBlur]} onValueChange={(v) => setBgBlur(v[0])} min={0} max={30} step={2} />
                  <p className="text-xs text-muted-foreground">Blur the background image for a softer look</p>
                </div>

                <div className="space-y-2">
                  <Label>Overlay Opacity: {overlayOpacity}%</Label>
                  <Slider value={[overlayOpacity]} onValueChange={(v) => setOverlayOpacity(v[0])} min={0} max={100} step={10} />
                  <p className="text-xs text-muted-foreground">Add a dark overlay over the background</p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Quick tip: Upload a transparent PNG logo for best results</p>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Typography Controls
                  </h3>
                  
                  <div className="space-y-2">
                    <Label>Title Font Weight</Label>
                    <Select value={titleWeight} onValueChange={(v) => setTitleWeight(v as FontWeight)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">Light (300)</SelectItem>
                        <SelectItem value="400">Regular (400)</SelectItem>
                        <SelectItem value="500">Medium (500)</SelectItem>
                        <SelectItem value="600">Semi-Bold (600)</SelectItem>
                        <SelectItem value="700">Bold (700)</SelectItem>
                        <SelectItem value="800">Extra-Bold (800)</SelectItem>
                        <SelectItem value="900">Black (900)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Body Font Weight</Label>
                    <Select value={bodyWeight} onValueChange={(v) => setBodyWeight(v as FontWeight)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">Light (300)</SelectItem>
                        <SelectItem value="400">Regular (400)</SelectItem>
                        <SelectItem value="500">Medium (500)</SelectItem>
                        <SelectItem value="600">Semi-Bold (600)</SelectItem>
                        <SelectItem value="700">Bold (700)</SelectItem>
                        <SelectItem value="800">Extra-Bold (800)</SelectItem>
                        <SelectItem value="900">Black (900)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Letter Spacing: {letterSpacing}px</Label>
                    <Slider value={[letterSpacing]} onValueChange={(v) => setLetterSpacing(v[0])} min={-5} max={20} step={1} />
                  </div>

                  <div className="space-y-2">
                    <Label>Line Height: {lineHeight.toFixed(1)}</Label>
                    <Slider value={[lineHeight]} onValueChange={(v) => setLineHeight(v[0])} min={0.8} max={2.5} step={0.1} />
                  </div>

                  <div className="space-y-2">
                    <Label>Text Transform</Label>
                    <Select value={textTransform} onValueChange={(v) => setTextTransform(v as TextTransform)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="uppercase">UPPERCASE</SelectItem>
                        <SelectItem value="lowercase">lowercase</SelectItem>
                        <SelectItem value="capitalize">Capitalize</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Gradient Controls
                  </h3>

                  <div className="space-y-2">
                    <Label>Gradient Type</Label>
                    <Select value={gradientType} onValueChange={(v) => setGradientType(v as GradientType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="radial">Radial</SelectItem>
                        <SelectItem value="conic">Conic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {gradientType === "linear" && (
                    <div className="space-y-2">
                      <Label>Gradient Angle: {gradientAngle}°</Label>
                      <Slider value={[gradientAngle]} onValueChange={(v) => setGradientAngle(v[0])} min={0} max={360} step={15} />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Secondary Accent Color</Label>
                    <Input
                      type="color"
                      value={secondaryAccentColor}
                      onChange={(e) => setSecondaryAccentColor(e.target.value)}
                      className="w-full h-10 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Image Filters
                  </h3>

                  <div className="space-y-2">
                    <Label>Brightness: {brightness}%</Label>
                    <Slider value={[brightness]} onValueChange={(v) => setBrightness(v[0])} min={0} max={200} step={10} />
                  </div>

                  <div className="space-y-2">
                    <Label>Contrast: {contrast}%</Label>
                    <Slider value={[contrast]} onValueChange={(v) => setContrast(v[0])} min={0} max={200} step={10} />
                  </div>

                  <div className="space-y-2">
                    <Label>Saturation: {saturation}%</Label>
                    <Slider value={[saturation]} onValueChange={(v) => setSaturation(v[0])} min={0} max={200} step={10} />
                  </div>

                  <Button 
                    onClick={() => {
                      setBrightness(100);
                      setContrast(100);
                      setSaturation(100);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Filters
                  </Button>
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

              <div className="pt-3 border-t border-border">
                <Label className="mb-2 block text-xs text-muted-foreground">Keyboard Shortcuts</Label>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Undo</span>
                    <kbd className="px-2 py-0.5 bg-muted rounded">Ctrl+Z</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Redo</span>
                    <kbd className="px-2 py-0.5 bg-muted rounded">Ctrl+Shift+Z</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Save Design</span>
                    <kbd className="px-2 py-0.5 bg-muted rounded">Ctrl+S</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Download</span>
                    <kbd className="px-2 py-0.5 bg-muted rounded">Ctrl+D</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Copy Image</span>
                    <kbd className="px-2 py-0.5 bg-muted rounded">Ctrl+C</kbd>
                  </div>
                </div>
              </div>
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
