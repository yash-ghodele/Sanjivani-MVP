import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { AboutSection } from "@/components/landing/AboutSection";
import { CTASection } from "@/components/landing/CTASection";
import { FallingLeavesBackground } from "@/components/ui/FallingLeavesBackground";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-nature-500/30 relative">
      {/* Global Falling Leaves Background */}
      <div className="fixed inset-0 z-0">
        <FallingLeavesBackground />
      </div>

      {/* Content with higher z-index */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesGrid />
        <AboutSection />
        <CTASection />
      </div>
    </div>
  );
}
