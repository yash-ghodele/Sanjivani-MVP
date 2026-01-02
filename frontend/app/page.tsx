import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-nature-500/30">
      <HeroSection />
      <FeaturesGrid />
      <CTASection />
    </div>
  );
}
