import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background"></div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-2 h-2 bg-primary rounded-full opacity-30 animate-pulse" style={{ top: "20%", left: "10%" }}></div>
        <div className="absolute w-1 h-1 bg-accent rounded-full opacity-40 animate-pulse" style={{ top: "40%", right: "15%", animationDelay: "0.5s" }}></div>
        <div className="absolute w-3 h-3 bg-primary rounded-full opacity-20 animate-pulse" style={{ bottom: "30%", left: "20%", animationDelay: "1s" }}></div>
        <div className="absolute w-1 h-1 bg-accent rounded-full opacity-30 animate-pulse" style={{ top: "60%", right: "25%", animationDelay: "1.5s" }}></div>
        <div className="absolute w-2 h-2 bg-primary rounded-full opacity-25 animate-pulse" style={{ bottom: "20%", right: "10%", animationDelay: "2s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 mb-8">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-accent font-medium">Developer Tools Platform</span>
        </div>

        <h1 className="font-serif font-black text-6xl md:text-8xl lg:text-9xl mb-6 leading-tight">
          <span className="text-primary">Build</span>
          <span className="text-gradient-accent"> Faster</span>
          <br />
          <span className="text-foreground">Ship</span>{" "}
          <span className="text-primary">Smarter</span>
        </h1>

        <p className="text-lg md:text-xl text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
          Professional tools for developers who demand excellence. Create stunning GitHub repository images, 
          optimize your workflow, and showcase your projects like never before.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-8 py-6 text-lg group"
            asChild
          >
            <a href="#tools">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="glassmorphic border-primary/30 text-foreground hover:bg-primary/10 hover:border-accent font-medium px-8 py-6 text-lg"
            asChild
          >
            <a href="#about">Learn More</a>
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { label: "Tools", value: "12+" },
            { label: "Users", value: "10K+" },
            { label: "Images Generated", value: "50K+" },
            { label: "Satisfaction", value: "99%" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-secondary font-mono">{stat.label}</div>
              <div className="h-1 w-16 mx-auto mt-2 bg-gradient-to-r from-accent to-primary rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
