"use client";

import { Camera, Cpu, CheckCircle, Smartphone } from "lucide-react";

export function AboutSection() {
    return (
        <section className="relative py-20 px-4 text-white" id="how-it-works">
            <div className="container mx-auto max-w-5xl relative z-10">
                {/* How It Works */}
                <div className="mb-20">
                    <div className="text-center mb-16">
                        <span className="text-nature-400 font-semibold text-sm uppercase tracking-wider mb-4 block">Simple Process</span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                            How It Works
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            From snap to solution in three easy steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <StepCard
                            num="01"
                            icon={<Camera className="w-8 h-8" />}
                            title="Take a Photo"
                            desc="Snap a clear picture of the affected leaf using your phone camera. No special equipment needed."
                        />
                        <StepCard
                            num="02"
                            icon={<Cpu className="w-8 h-8" />}
                            title="AI Analysis"
                            desc="Our AI instantly analyzes the image. Works offline, processes in under 3 seconds with 98.7% accuracy."
                        />
                        <StepCard
                            num="03"
                            icon={<CheckCircle className="w-8 h-8" />}
                            title="Get Treatment Plan"
                            desc="Receive clear diagnosis and treatment recommendations in your language. Save and share results."
                        />
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    <div className="glass-card p-8 rounded-3xl border border-nature-500/20 bg-nature-900/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-nature-500/20 flex items-center justify-center">
                                <Smartphone className="w-6 h-6 text-nature-400" />
                            </div>
                            <div>
                                <div className="text-3xl font-display font-bold text-white">10,000+</div>
                                <div className="text-sm text-gray-400">Farmers Helped</div>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Trusted by thousands of farmers across India for early disease detection and treatment guidance.
                        </p>
                    </div>

                    <div className="glass-card p-8 rounded-3xl border border-blue-500/20 bg-blue-900/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-3xl font-display font-bold text-white">50,000+</div>
                                <div className="text-sm text-gray-400">Verified Images</div>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Trained on the PlantVillage Dataset with expert-validated images for maximum accuracy.
                        </p>
                    </div>
                </div>

                {/* Tech Stack - Simplified */}
                <div className="text-center mb-12">
                    <h3 className="text-2xl font-bold text-white mb-8">Powered By Proven Technology</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <TechBadge text="TensorFlow AI" />
                        <TechBadge text="Firebase Cloud" />
                        <TechBadge text="Offline PWA" />
                        <TechBadge text="Gemini AI" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function StepCard({ num, icon, title, desc }: { num: string; icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="text-center group">
            <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-2xl bg-nature-500/10 flex items-center justify-center text-nature-400 group-hover:bg-nature-500/20 transition-all group-hover:scale-110">
                    {icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-nature-600 text-white flex items-center justify-center text-sm font-bold">
                    {num}
                </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
        </div>
    );
}

function TechBadge({ text }: { text: string }) {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-nature-500/30 transition-all">
            <span className="text-sm font-semibold text-gray-300">{text}</span>
        </div>
    );
}
