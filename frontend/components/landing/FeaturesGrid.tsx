"use client";

import { Shield, Wifi, Clock, Database, Users, TrendingDown } from "lucide-react";

export function FeaturesGrid() {
    return (
        <section className="py-24 relative" id="features">
            <div className="container-padding relative z-10">
                {/* Problem Statement */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="text-nature-400 font-semibold text-sm uppercase tracking-wider mb-4 block">The Challenge</span>
                    <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-6">
                        40% of crop loss happens due to{" "}
                        <span className="text-gray-400">late disease detection</span>
                    </h2>
                    <p className="text-lg text-gray-400">
                        Expert agronomists aren't always available when you need them. Chemical overuse happens due to guesswork. We're here to change that.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                    <BenefitCard
                        icon={<Wifi className="w-6 h-6" />}
                        title="Works Offline"
                        description="No internet? No problem. Get accurate diagnoses even in remote areas with zero connectivity."
                        badge="Offline-First"
                    />
                    <BenefitCard
                        icon={<Clock className="w-6 h-6" />}
                        title="Instant Results"
                        description="Get AI-powered diagnoses in under 3 seconds. Early detection means early treatment."
                        badge="Fast"
                    />
                    <BenefitCard
                        icon={<Shield className="w-6 h-6" />}
                        title="98.7% Accurate"
                        description="Trained on 50,000+ expert-verified images. Trust the science, save your crops."
                        badge="Reliable"
                    />
                    <BenefitCard
                        icon={<TrendingDown className="w-6 h-6" />}
                        title="Reduce Chemical Use"
                        description="Get precise treatment recommendations. Stop guessing, start saving money and the environment."
                        badge="Eco-Friendly"
                    />
                    <BenefitCard
                        icon={<Database className="w-6 h-6" />}
                        title="Your Data, Your Control"
                        description="All scan data belongs to you. Export anytime, delete anytime. Complete data sovereignty."
                        badge="Privacy"
                    />
                    <BenefitCard
                        icon={<Users className="w-6 h-6" />}
                        title="Built for Farmers"
                        description="Simple interface, multiple languages, designed for real field conditions, not labs."
                        badge="User-Friendly"
                    />
                </div>
            </div>
        </section>
    );
}

function BenefitCard({ icon, title, description, badge }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    badge: string;
}) {
    return (
        <div className="group bg-[#1a1a18]/60 backdrop-blur-sm border border-white/5 p-8 rounded-2xl hover:bg-[#1a1a18] transition-all hover:border-nature-500/20 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-nature-500/10 flex items-center justify-center text-nature-400 group-hover:bg-nature-500/20 transition-colors">
                    {icon}
                </div>
                <span className="text-xs font-bold text-nature-400/60 uppercase tracking-wider">{badge}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">
                {title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
