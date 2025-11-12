import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Code, Palette, Sparkles, ArrowRight, Zap } from "lucide-react";

const Index = () => {
  const tools = [
    {
      id: "github-image-generator",
      title: "GitHub Image Generator",
      description: "Create stunning social preview images for your GitHub repositories with advanced customization options",
      icon: Image,
      gradient: "from-orange-500 to-red-500",
      features: ["4 Layout Templates", "Custom Fonts", "Image Uploads", "Pattern Effects"],
      link: "/tools/github-image-generator",
      status: "active"
    },
    {
      id: "fivem-banner-creator",
      title: "FiveM Banner Creator",
      description: "Create stunning animated and static banners for your FiveM server with custom themes and effects",
      icon: Sparkles,
      gradient: "from-green-500 to-emerald-500",
      features: ["Animated GIF", "Theme Presets", "Custom Effects", "Instant Export"],
      link: "/tools/fivem-banner-creator",
      status: "active"
    },
    {
      id: "code-snippet-beautifier",
      title: "Code Snippet Beautifier",
      description: "Transform your code into beautiful, shareable images with syntax highlighting",
      icon: Code,
      gradient: "from-blue-500 to-cyan-500",
      features: ["Multiple Themes", "Language Support", "Export Options"],
      link: "#",
      status: "coming-soon"
    },
    {
      id: "color-palette-generator",
      title: "Color Palette Generator",
      description: "Generate stunning color palettes from images or create custom color schemes",
      icon: Palette,
      gradient: "from-purple-500 to-pink-500",
      features: ["AI-Powered", "Export to CSS", "Accessibility Check"],
      link: "#",
      status: "coming-soon"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card-elevated opacity-50" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-accent/10 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-mono">Developer Tools Suite</span>
            </div>
            
            <h1 className="font-serif font-bold text-6xl md:text-8xl">
              <span className="text-foreground">Snozxyx</span>{" "}
              <span className="text-gradient-accent">Tools</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto leading-relaxed">
              A powerful collection of free tools to supercharge your development workflow. 
              Create, design, and optimize with ease.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-background">
                <Link to="/tools/github-image-generator">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10">
                <a href="#tools">Explore Tools</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Tools Available", value: "4+" },
              { label: "Active Users", value: "1.2K+" },
              { label: "Images Generated", value: "15K+" },
              { label: "Always Free", value: "100%" }
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-serif font-bold text-accent">{stat.value}</div>
                <div className="text-sm text-secondary font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="font-serif font-bold text-5xl md:text-6xl mb-4">
              <span className="text-foreground">Our</span>{" "}
              <span className="text-gradient-accent">Tools</span>
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Professional-grade tools designed for developers, designers, and creators
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              const isActive = tool.status === "active";
              
              return (
                <Card
                  key={tool.id}
                  className="group relative p-8 bg-card border-border hover-lift overflow-hidden transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Status Badge */}
                  {!isActive && (
                    <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-mono">
                      Coming Soon
                    </div>
                  )}

                  <div className="relative space-y-6">
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${tool.gradient} shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-serif font-bold text-foreground">
                        {tool.title}
                      </h3>
                      <p className="text-secondary leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {tool.features.map((feature, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-background border border-border text-xs font-mono text-muted"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    {isActive ? (
                      <Button asChild className="w-full bg-accent hover:bg-accent/90 text-background group-hover:shadow-lg transition-all">
                        <Link to={tool.link}>
                          Launch Tool
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    ) : (
                      <Button disabled className="w-full" variant="outline">
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-serif font-bold text-foreground mb-2">Snozxyx Tools</div>
              <p className="text-sm text-secondary font-mono">Built with ❤️ for developers</p>
            </div>
            
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors">
                GitHub
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors">
                Twitter
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors">
                Discord
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted font-mono">
            © 2025 Snozxyx. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
