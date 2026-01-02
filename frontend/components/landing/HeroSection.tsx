"use client";

import { ArrowRight, Play, Smartphone } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-10">
            {/* Background Layer - Deep Forest Theme */}
            <div className="absolute inset-0 z-0">
                {/* Dark Base */}
                <div className="absolute inset-0 bg-[#0f110f]" />

                {/* Real Foliage Background */}
                <div
                    className="absolute inset-0 opacity-40 mix-blend-screen"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "blur(2px) contrast(1.1)"
                    }}
                />

                {/* Gradient Overlays for Depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f110f] via-[#0f110f]/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f110f] to-transparent" />
            </div>

            <div className="container-padding relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-8 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-nature-500/20 bg-nature-500/10 backdrop-blur-sm">
                        <Smartphone className="w-4 h-4 text-nature-400" />
                        <span className="text-xs font-bold text-nature-400 tracking-wider uppercase font-display">Works Offline • Available 24/7</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium text-white leading-[0.9] tracking-tight">
                        Your Crops <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-500 to-nature-300">Deserve a Doctor</span>
                    </h1>

                    <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                        AI-powered crop disease detection in seconds. <span className="text-nature-400 font-semibold">No internet needed.</span> Get instant diagnoses and treatment plans in your language.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/scan">
                            <button className="h-14 px-8 rounded-full bg-nature-600 text-white font-semibold text-lg hover:bg-nature-500 hover:scale-105 transition-all flex items-center gap-2 group shadow-[0_0_20px_rgba(130,174,25,0.3)]">
                                Diagnose Your Crop Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <a href="#how-it-works">
                            <button className="h-14 px-8 rounded-full border border-white/20 hover:bg-white/5 text-white font-medium text-lg backdrop-blur-md transition-all flex items-center gap-2">
                                <Play className="w-4 h-4 fill-current" /> See How It Works
                            </button>
                        </a>
                    </div>

                    <div className="pt-8 grid grid-cols-3 gap-6 border-t border-white/10 mt-8">
                        <div>
                            <div className="text-3xl font-display font-bold text-nature-400">10K+</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider">Farmers</div>
                        </div>
                        <div>
                            <div className="text-3xl font-display font-bold text-nature-400">98.7%</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider">Accuracy</div>
                        </div>
                        <div>
                            <div className="text-3xl font-display font-bold text-nature-400">&lt;3s</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider">Results</div>
                        </div>
                    </div>
                </div>

                {/* Right Visual - "Green Space" Glass Card Style */}
                <div className="hidden lg:flex justify-end items-center relative z-20">
                    {/* Floating Glass Card */}
                    <div className="w-80 p-4 rounded-3xl bg-[#1c1c1c]/40 backdrop-blur-2xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-right-12 duration-1000">
                        {/* Plant Image in Card */}
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-black/20">
                            <img
                                src="https://images.pexels.com/photos/6314416/pexels-photo-6314416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt="Tomato Leaf Analysis"
                                className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500/20 backdrop-blur-md flex items-center justify-center border border-red-500/30">
                                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            </div>

                            {/* Scanning Line Animation */}
                            <div className="absolute inset-x-0 top-0 h-[2px] bg-nature-500/50 shadow-[0_0_10px_2px_rgba(130,174,25,0.5)] animate-[scan_3s_ease-in-out_infinite]" />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-display text-white leading-tight">
                                    Early Blight Detected
                                </h3>
                                <p className="text-nature-400 font-mono text-sm mt-1">Confidence: 98.4%</p>
                            </div>
                            <button className="w-full py-3 rounded-xl bg-nature-600/20 text-nature-400 font-medium hover:bg-nature-600/30 transition-colors flex items-center justify-center gap-2 text-sm border border-nature-500/20">
                                View Treatment <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
