import { useState, useRef, useEffect } from "react";
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
    textColor: "#ffffff",
    pattern: "grid",
    glowIntensity: 50,
    fontSize: 48,
    taglineFontSize: 24,
    borderWidth: 2,
    cornerRadius: 12,
  });

  const themes = {
    neon: { bg: "#0a0a0a", accent: "#00ff88", text: "#ffffff" },
    purple: { bg: "#1a0a2e", accent: "#9d4edd", text: "#ffffff" },
    blue: { bg: "#0a1929", accent: "#00b4d8", text: "#ffffff" },
    red: { bg: "#1a0000", accent: "#ff0033", text: "#ffffff" },
    gold: { bg: "#1a1300", accent: "#ffd700", text: "#ffffff" },
  };

  const applyTheme = (theme: keyof typeof themes) => {
    const colors = themes[theme];
    setConfig((prev) => ({
      ...prev,
      theme,
      bgColor: colors.bg,
      accentColor: colors.accent,
      textColor: colors.text,
    }));
  };

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

        <div className="flex justify-center">
          <div
            ref={bannerRef}
            className="relative overflow-hidden transition-all duration-300"
            style={{
              width: "1200px",
              height: "300px",
              backgroundColor: config.bgColor,
              borderRadius: `${config.cornerRadius}px`,
              border: `${config.borderWidth}px solid ${config.accentColor}`,
            }}
          >
            <PatternOverlay />

            {/* Animated gradient background */}
            {isAnimated && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `linear-gradient(45deg, ${config.accentColor}, transparent, ${config.accentColor})`,
                  backgroundSize: "200% 200%",
                  animation: "gradient 3s ease infinite",
                }}
              />
            )}

            {/* Glow effects */}
            <div
              className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
              style={{
                backgroundColor: config.accentColor,
                transform: "translate(-50%, -50%)",
              }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
              style={{
                backgroundColor: config.accentColor,
                transform: "translate(50%, 50%)",
              }}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center gap-4 px-12">
              <h1
                className="font-bold text-center tracking-tight"
                style={{
                  fontSize: `${config.fontSize}px`,
                  color: config.textColor,
                  textShadow: `0 0 ${config.glowIntensity}px ${config.accentColor}`,
                }}
              >
                {config.serverName}
              </h1>

              <p
                className="text-center opacity-90"
                style={{
                  fontSize: `${config.taglineFontSize}px`,
                  color: config.textColor,
                }}
              >
                {config.tagline}
              </p>

              <div className="flex items-center gap-8 mt-4">
                <div
                  className="px-6 py-2 rounded-full font-semibold"
                  style={{
                    backgroundColor: `${config.accentColor}22`,
                    border: `2px solid ${config.accentColor}`,
                    color: config.accentColor,
                  }}
                >
                  {config.playerCount} Players
                </div>

                <div
                  className="px-6 py-2 rounded-full font-semibold"
                  style={{
                    backgroundColor: `${config.accentColor}22`,
                    border: `2px solid ${config.accentColor}`,
                    color: config.accentColor,
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
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
              <Label>Theme Preset</Label>
              <Select value={config.theme} onValueChange={(v) => applyTheme(v as keyof typeof themes)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="neon">Neon Green</SelectItem>
                  <SelectItem value="purple">Purple Haze</SelectItem>
                  <SelectItem value="blue">Ocean Blue</SelectItem>
                  <SelectItem value="red">Red Alert</SelectItem>
                  <SelectItem value="gold">Golden Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={config.bgColor}
                  onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <Input
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
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

              <div className="space-y-2">
                <Label>Pattern</Label>
                <Select value={config.pattern} onValueChange={(v) => setConfig({ ...config, pattern: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="diagonal">Diagonal</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title Font Size: {config.fontSize}px</Label>
              <Slider
                value={[config.fontSize]}
                onValueChange={([v]) => setConfig({ ...config, fontSize: v })}
                min={24}
                max={72}
                step={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Tagline Font Size: {config.taglineFontSize}px</Label>
              <Slider
                value={[config.taglineFontSize]}
                onValueChange={([v]) => setConfig({ ...config, taglineFontSize: v })}
                min={12}
                max={36}
                step={2}
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
                max={100}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Border Width: {config.borderWidth}px</Label>
              <Slider
                value={[config.borderWidth]}
                onValueChange={([v]) => setConfig({ ...config, borderWidth: v })}
                min={0}
                max={10}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Corner Radius: {config.cornerRadius}px</Label>
              <Slider
                value={[config.cornerRadius]}
                onValueChange={([v]) => setConfig({ ...config, cornerRadius: v })}
                min={0}
                max={50}
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
      `}</style>
    </div>
  );
};
