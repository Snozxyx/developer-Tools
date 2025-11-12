import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

export const FiveMBannerCreator = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [config, setConfig] = useState({
    serverName: "Los Santos RP",
    tagline: "Your Adventure Awaits",
    playerCount: "128/128",
    discord: "discord.gg/server",
    theme: "neon",
    bgColor: "#0a0a0a",
    accentColor: "#00ff88",
    secondaryColor: "#ff00ff",
    textColor: "#ffffff",
    pattern: "grid",
    glowIntensity: 50,
    fontSize: 48,
    taglineFontSize: 24,
    borderWidth: 2,
    cornerRadius: 12,
    titleFont: "Orbitron",
    taglineFont: "Inter",
    badgeFont: "Rajdhani",
    gradient: "linear",
    gradientDirection: "45deg",
    bannerSize: "standard",
    textShadow: 2,
    textStroke: 0,
    transition: "fade",
    textTransform: "uppercase",
    letterSpacing: 1,
  });

  const themes = {
    neon: { bg: "#0a0a0a", accent: "#00ff88", secondary: "#00ffff", text: "#ffffff" },
    purple: { bg: "#1a0a2e", accent: "#9d4edd", secondary: "#e0aaff", text: "#ffffff" },
    blue: { bg: "#0a1929", accent: "#00b4d8", secondary: "#0077b6", text: "#ffffff" },
    red: { bg: "#1a0000", accent: "#ff0033", secondary: "#ff6b6b", text: "#ffffff" },
    gold: { bg: "#1a1300", accent: "#ffd700", secondary: "#ffa500", text: "#ffffff" },
    cyberpunk: { bg: "#0d0221", accent: "#f72585", secondary: "#7209b7", text: "#ffffff" },
    ocean: { bg: "#001845", accent: "#0466c8", secondary: "#33bbff", text: "#ffffff" },
    sunset: { bg: "#2d1b00", accent: "#ff6d00", secondary: "#ffaa00", text: "#ffffff" },
    emerald: { bg: "#052e16", accent: "#10b981", secondary: "#34d399", text: "#ffffff" },
    rose: { bg: "#1f0716", accent: "#e11d48", secondary: "#fb7185", text: "#ffffff" },
  };

  const bannerSizes = {
    standard: { width: 1200, height: 300 },
    wide: { width: 1600, height: 400 },
    square: { width: 800, height: 800 },
    discord: { width: 960, height: 540 },
    youtube: { width: 2560, height: 1440 },
    twitch: { width: 1920, height: 480 },
  };

  const applyTheme = (theme: keyof typeof themes) => {
    const colors = themes[theme];
    setConfig((prev) => ({
      ...prev,
      theme,
      bgColor: colors.bg,
      accentColor: colors.accent,
      secondaryColor: colors.secondary,
      textColor: colors.text,
    }));
  };

  const currentSize = bannerSizes[config.bannerSize as keyof typeof bannerSizes];

  const downloadBanner = async () => {
    if (!bannerRef.current) return;

    try {
      if (isAnimated) {
        toast.info("GIF export coming soon! Downloading static version for now.");
      }

      const canvas = await html2canvas(bannerRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `fivem-banner-${Date.now()}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          toast.success("Banner downloaded!");
        }
      });
    } catch (error) {
      toast.error("Failed to download banner");
    }
  };

  const getGradientStyle = () => {
    const gradients = {
      linear: `linear-gradient(${config.gradientDirection}, ${config.bgColor}, ${config.accentColor}22)`,
      radial: `radial-gradient(circle at center, ${config.bgColor}, ${config.accentColor}22)`,
      diagonal: `linear-gradient(135deg, ${config.bgColor} 0%, ${config.accentColor}22 50%, ${config.secondaryColor}22 100%)`,
      striped: `repeating-linear-gradient(${config.gradientDirection}, ${config.bgColor}, ${config.bgColor} 10px, ${config.accentColor}11 10px, ${config.accentColor}11 20px)`,
      mesh: `linear-gradient(${config.gradientDirection}, ${config.bgColor}, ${config.accentColor}33), radial-gradient(circle, ${config.secondaryColor}22, transparent)`,
      none: config.bgColor,
    };
    return gradients[config.gradient as keyof typeof gradients];
  };

  const PatternOverlay = () => {
    const patterns = {
      grid: (
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(${config.accentColor} 1px, transparent 1px), linear-gradient(90deg, ${config.accentColor} 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }} />
        </div>
      ),
      dots: (
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle, ${config.accentColor} 2px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }} />
        </div>
      ),
      diagonal: (
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${config.accentColor}, ${config.accentColor} 2px, transparent 2px, transparent 40px)`,
          }} />
        </div>
      ),
      hexagon: (
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle, ${config.accentColor} 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }} />
        </div>
      ),
      waves: (
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <pattern id="wave" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke={config.accentColor} strokeWidth="2"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#wave)" />
          </svg>
        </div>
      ),
      circuit: (
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(${config.accentColor} 1px, transparent 1px),
              linear-gradient(90deg, ${config.accentColor} 1px, transparent 1px),
              radial-gradient(circle, ${config.accentColor} 3px, transparent 3px)
            `,
            backgroundSize: "60px 60px, 60px 60px, 60px 60px",
            backgroundPosition: "0 0, 0 0, 30px 30px",
          }} />
        </div>
      ),
      none: null,
    };

    return patterns[config.pattern as keyof typeof patterns];
  };

  return (
    <div className="space-y-8">
      {/* Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Preview</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={isAnimated} onCheckedChange={setIsAnimated} />
              <Label>Animated (GIF)</Label>
            </div>
            <Button onClick={downloadBanner}>
              <Download className="w-4 h-4 mr-2" />
              Download {isAnimated ? "GIF" : "PNG"}
            </Button>
          </div>
        </div>

        <div className="flex justify-center overflow-x-auto">
          <div
            ref={bannerRef}
            className="relative overflow-hidden transition-all duration-300"
            style={{
              width: `${currentSize.width}px`,
              height: `${currentSize.height}px`,
              background: getGradientStyle(),
              borderRadius: `${config.cornerRadius}px`,
              border: `${config.borderWidth}px solid ${config.accentColor}`,
            }}
          >
            <PatternOverlay />

            {/* Animated effects */}
            {isAnimated && (
              <>
                {config.transition === "fade" && (
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `linear-gradient(45deg, ${config.accentColor}, transparent, ${config.secondaryColor})`,
                      backgroundSize: "200% 200%",
                      animation: "gradient 3s ease infinite",
                    }}
                  />
                )}
                {config.transition === "pulse" && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle, ${config.accentColor}44 0%, transparent 70%)`,
                      animation: "pulse 2s ease-in-out infinite",
                    }}
                  />
                )}
                {config.transition === "slide" && (
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${config.accentColor}, transparent)`,
                      animation: "slide 3s linear infinite",
                    }}
                  />
                )}
                {config.transition === "rotate" && (
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `conic-gradient(from 0deg, ${config.accentColor}, ${config.secondaryColor}, ${config.accentColor})`,
                      animation: "rotate 4s linear infinite",
                    }}
                  />
                )}
              </>
            )}

            {/* Glow effects */}
            <div
              className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
              style={{
                backgroundColor: config.accentColor,
                transform: "translate(-50%, -50%)",
                animation: isAnimated ? "float 3s ease-in-out infinite" : "none",
              }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
              style={{
                backgroundColor: config.secondaryColor,
                transform: "translate(50%, 50%)",
                animation: isAnimated ? "float 3s ease-in-out infinite reverse" : "none",
              }}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center gap-4 px-12">
              <h1
                className="font-bold text-center"
                style={{
                  fontSize: `${config.fontSize}px`,
                  color: config.textColor,
                  fontFamily: config.titleFont,
                  textTransform: config.textTransform as any,
                  letterSpacing: `${config.letterSpacing}px`,
                  textShadow: `
                    0 0 ${config.glowIntensity}px ${config.accentColor},
                    ${config.textShadow}px ${config.textShadow}px ${config.textShadow * 2}px rgba(0,0,0,0.5)
                  `,
                  WebkitTextStroke: config.textStroke > 0 ? `${config.textStroke}px ${config.accentColor}` : "none",
                  animation: isAnimated ? "textGlow 2s ease-in-out infinite" : "none",
                }}
              >
                {config.serverName}
              </h1>

              <p
                className="text-center opacity-90"
                style={{
                  fontSize: `${config.taglineFontSize}px`,
                  color: config.textColor,
                  fontFamily: config.taglineFont,
                  textShadow: `${config.textShadow}px ${config.textShadow}px ${config.textShadow * 2}px rgba(0,0,0,0.5)`,
                }}
              >
                {config.tagline}
              </p>

              <div className="flex items-center gap-8 mt-4">
                <div
                  className="px-6 py-2 rounded-full font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: `${config.accentColor}22`,
                    border: `2px solid ${config.accentColor}`,
                    color: config.accentColor,
                    fontFamily: config.badgeFont,
                    boxShadow: `0 0 20px ${config.accentColor}44`,
                  }}
                >
                  {config.playerCount} Players
                </div>

                <div
                  className="px-6 py-2 rounded-full font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: `${config.secondaryColor}22`,
                    border: `2px solid ${config.secondaryColor}`,
                    color: config.secondaryColor,
                    fontFamily: config.badgeFont,
                    boxShadow: `0 0 20px ${config.secondaryColor}44`,
                  }}
                >
                  {config.discord}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <Card className="p-6">
        <Tabs defaultValue="content">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Server Name</Label>
                <Input
                  value={config.serverName}
                  onChange={(e) => setConfig({ ...config, serverName: e.target.value })}
                  placeholder="Los Santos RP"
                />
              </div>

              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input
                  value={config.tagline}
                  onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                  placeholder="Your Adventure Awaits"
                />
              </div>

              <div className="space-y-2">
                <Label>Player Count</Label>
                <Input
                  value={config.playerCount}
                  onChange={(e) => setConfig({ ...config, playerCount: e.target.value })}
                  placeholder="128/128"
                />
              </div>

              <div className="space-y-2">
                <Label>Discord</Label>
                <Input
                  value={config.discord}
                  onChange={(e) => setConfig({ ...config, discord: e.target.value })}
                  placeholder="discord.gg/server"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Banner Size</Label>
              <Select value={config.bannerSize} onValueChange={(v) => setConfig({ ...config, bannerSize: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="standard">Standard (1200x300)</SelectItem>
                  <SelectItem value="wide">Wide (1600x400)</SelectItem>
                  <SelectItem value="square">Square (800x800)</SelectItem>
                  <SelectItem value="discord">Discord (960x540)</SelectItem>
                  <SelectItem value="youtube">YouTube (2560x1440)</SelectItem>
                  <SelectItem value="twitch">Twitch (1920x480)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Theme Preset</Label>
              <Select value={config.theme} onValueChange={(v) => applyTheme(v as keyof typeof themes)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="neon">Neon Green</SelectItem>
                  <SelectItem value="purple">Purple Haze</SelectItem>
                  <SelectItem value="blue">Ocean Blue</SelectItem>
                  <SelectItem value="red">Red Alert</SelectItem>
                  <SelectItem value="gold">Golden Hour</SelectItem>
                  <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                  <SelectItem value="ocean">Deep Ocean</SelectItem>
                  <SelectItem value="sunset">Sunset Glow</SelectItem>
                  <SelectItem value="emerald">Emerald Dream</SelectItem>
                  <SelectItem value="rose">Rose Garden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gradient Style</Label>
              <Select value={config.gradient} onValueChange={(v) => setConfig({ ...config, gradient: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                  <SelectItem value="diagonal">Diagonal</SelectItem>
                  <SelectItem value="striped">Striped</SelectItem>
                  <SelectItem value="mesh">Mesh</SelectItem>
                  <SelectItem value="none">Solid Color</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gradient Direction: {config.gradientDirection}</Label>
              <Select value={config.gradientDirection} onValueChange={(v) => setConfig({ ...config, gradientDirection: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="0deg">Top</SelectItem>
                  <SelectItem value="45deg">Top Right</SelectItem>
                  <SelectItem value="90deg">Right</SelectItem>
                  <SelectItem value="135deg">Bottom Right</SelectItem>
                  <SelectItem value="180deg">Bottom</SelectItem>
                  <SelectItem value="225deg">Bottom Left</SelectItem>
                  <SelectItem value="270deg">Left</SelectItem>
                  <SelectItem value="315deg">Top Left</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Background</Label>
                <Input
                  type="color"
                  value={config.bgColor}
                  onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Primary Accent</Label>
                <Input
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Secondary Accent</Label>
                <Input
                  type="color"
                  value={config.secondaryColor}
                  onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Text Color</Label>
                <Input
                  type="color"
                  value={config.textColor}
                  onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Pattern Overlay</Label>
              <Select value={config.pattern} onValueChange={(v) => setConfig({ ...config, pattern: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="diagonal">Diagonal Lines</SelectItem>
                  <SelectItem value="hexagon">Hexagon</SelectItem>
                  <SelectItem value="waves">Waves</SelectItem>
                  <SelectItem value="circuit">Circuit</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Animation Transition</Label>
              <Select value={config.transition} onValueChange={(v) => setConfig({ ...config, transition: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="pulse">Pulse</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="rotate">Rotate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Title Font</Label>
              <Select value={config.titleFont} onValueChange={(v) => setConfig({ ...config, titleFont: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="Orbitron">Orbitron (Futuristic)</SelectItem>
                  <SelectItem value="Rajdhani">Rajdhani (Modern)</SelectItem>
                  <SelectItem value="Bebas Neue">Bebas Neue (Bold)</SelectItem>
                  <SelectItem value="Russo One">Russo One (Strong)</SelectItem>
                  <SelectItem value="Oxanium">Oxanium (Tech)</SelectItem>
                  <SelectItem value="Black Ops One">Black Ops One (Military)</SelectItem>
                  <SelectItem value="Teko">Teko (Sleek)</SelectItem>
                  <SelectItem value="Aldrich">Aldrich (Elegant)</SelectItem>
                  <SelectItem value="Inter">Inter (Clean)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tagline Font</Label>
              <Select value={config.taglineFont} onValueChange={(v) => setConfig({ ...config, taglineFont: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Rajdhani">Rajdhani</SelectItem>
                  <SelectItem value="Exo 2">Exo 2</SelectItem>
                  <SelectItem value="Saira">Saira</SelectItem>
                  <SelectItem value="Chakra Petch">Chakra Petch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Badge Font</Label>
              <Select value={config.badgeFont} onValueChange={(v) => setConfig({ ...config, badgeFont: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="Rajdhani">Rajdhani</SelectItem>
                  <SelectItem value="Orbitron">Orbitron</SelectItem>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto Mono">Roboto Mono</SelectItem>
                  <SelectItem value="Space Mono">Space Mono</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title Font Size: {config.fontSize}px</Label>
              <Slider
                value={[config.fontSize]}
                onValueChange={([v]) => setConfig({ ...config, fontSize: v })}
                min={24}
                max={120}
                step={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Tagline Font Size: {config.taglineFontSize}px</Label>
              <Slider
                value={[config.taglineFontSize]}
                onValueChange={([v]) => setConfig({ ...config, taglineFontSize: v })}
                min={12}
                max={48}
                step={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Text Transform</Label>
              <Select value={config.textTransform} onValueChange={(v) => setConfig({ ...config, textTransform: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="uppercase">UPPERCASE</SelectItem>
                  <SelectItem value="lowercase">lowercase</SelectItem>
                  <SelectItem value="capitalize">Capitalize</SelectItem>
                  <SelectItem value="none">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Letter Spacing: {config.letterSpacing}px</Label>
              <Slider
                value={[config.letterSpacing]}
                onValueChange={([v]) => setConfig({ ...config, letterSpacing: v })}
                min={-2}
                max={10}
                step={0.5}
              />
            </div>

            <div className="space-y-2">
              <Label>Text Stroke: {config.textStroke}px</Label>
              <Slider
                value={[config.textStroke]}
                onValueChange={([v]) => setConfig({ ...config, textStroke: v })}
                min={0}
                max={4}
                step={0.5}
              />
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Glow Intensity: {config.glowIntensity}px</Label>
              <Slider
                value={[config.glowIntensity]}
                onValueChange={([v]) => setConfig({ ...config, glowIntensity: v })}
                min={0}
                max={150}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Text Shadow: {config.textShadow}px</Label>
              <Slider
                value={[config.textShadow]}
                onValueChange={([v]) => setConfig({ ...config, textShadow: v })}
                min={0}
                max={10}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Border Width: {config.borderWidth}px</Label>
              <Slider
                value={[config.borderWidth]}
                onValueChange={([v]) => setConfig({ ...config, borderWidth: v })}
                min={0}
                max={20}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Corner Radius: {config.cornerRadius}px</Label>
              <Slider
                value={[config.cornerRadius]}
                onValueChange={([v]) => setConfig({ ...config, cornerRadius: v })}
                min={0}
                max={100}
                step={2}
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-20px); }
        }
        @keyframes textGlow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
      `}</style>
    </div>
  );
};
