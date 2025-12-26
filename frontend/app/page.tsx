import { ArrowRight, CheckCircle2, Leaf, ShieldCheck, Sprout, Wind } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-nature-950/90 mix-blend-multiply" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nature-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-bf5f7f2b90ce?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nature-500/10 border border-nature-400/20 mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Leaf className="w-4 h-4 text-nature-400" />
              <span className="text-sm font-medium text-nature-300 tracking-wide uppercase">AI-Powered Agriculture</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Excellence in <br />
              <span className="text-gradient">Crop Protection</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              Sanjivani uses advanced AI to detect crop diseases instantly. Protect your yields, optimize treatments, and farm with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Link href="/scan">
                <button className="px-8 py-4 rounded-full bg-nature-600 hover:bg-nature-500 text-white font-bold text-lg shadow-lg shadow-nature-500/25 hover:shadow-nature-500/40 transition-all hover:-translate-y-1 flex items-center gap-2">
                  Start Diagnosis
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/about">
                <button className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 text-white font-bold text-lg backdrop-blur-sm transition-all hover:-translate-y-1">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-black/20 backdrop-blur-md">
          <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {Stats.map((stat, i) => (
              <div key={i} className="py-6 px-4">
                <div className="text-3xl font-display font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section (Glass Cards) */}
      <section className="py-24 relative bg-dark-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-nature-400 uppercase tracking-widest mb-2">Our Services</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white">Why farmers choose Sanjivani</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Features.map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl hover:bg-nature-900/60 transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-nature-500/10 flex items-center justify-center mb-6 group-hover:bg-nature-500/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-nature-400 group-hover:text-nature-300" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-nature-400 text-sm font-bold group-hover:text-nature-300 cursor-pointer">
                  <span>Read more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="py-8 bg-dark-950 border-t border-white/5 text-center text-gray-500 text-sm">
        © 2025 Sanjivani Team. Excellence in Digital Agriculture.
      </footer>
    </div>
  );
}

const Stats = [
  { value: "98%", label: "Detection Accuracy" },
  { value: "15+", label: "Crops Supported" },
  { value: "<2s", label: "Analysis Time" },
  { value: "10k+", label: "Healthy Acres" },
];

const Features = [
  {
    title: "Instant Detection",
    desc: "Upload a photo of your crop and get an immediate diagnosis with 98% accuracy using our advanced AI model.",
    icon: ShieldCheck
  },
  {
    title: "Smart Treatment",
    desc: "Receive tailored treatment plans including organic and chemical solutions to protect your harvest effectively.",
    icon: Sprout
  },
  {
    title: "Weather Insights",
    desc: "Real-time weather alerts and spraying advisories based on local conditions to optimize your farming schedule.",
    icon: Wind
  }
];
