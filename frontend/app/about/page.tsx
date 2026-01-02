"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Cpu, Globe, Heart, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-24 px-4 pb-20 overflow-hidden bg-[#0f110f] text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nature-600/20 blur-[100px] rounded-full mix-blend-screen animate-float-slow" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen animate-float-delayed" />
                </div>
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            </div>

            <div className="container mx-auto max-w-5xl relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-16 space-y-4">
                    <Badge variant="outline" className="border-nature-500/50 text-nature-400 px-4 py-1">
                        Version 2.0 • Platform Status: Stable
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        About <span className="text-nature-500">Sanjivani</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        An advanced AI-powered diagnostic platform designed to protect crops, empower farmers, and ensure global food security through technology.
                    </p>
                </div>

                {/* Mission & Vision Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    <div className="glass-card p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                        <div className="w-12 h-12 rounded-2xl bg-nature-500/20 flex items-center justify-center mb-6">
                            <Heart className="w-6 h-6 text-nature-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                        <p className="text-gray-400 leading-relaxed">
                            To bridge the gap between advanced agricultural science and the everyday farmer. By democratizing access to disease detection, we aim to reduce crop loss, minimize chemical usage, and improve yield quality for millions.
                        </p>
                    </div>
                    <div className="glass-card p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
                            <Globe className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Global Vision</h2>
                        <p className="text-gray-400 leading-relaxed">
                            A world where every farmer, regardless of connectivity or resources, has an expert agronomist in their pocket. Sanjivani 2.0 is built for resilience, working explicitly in offline-first rural environments.
                        </p>
                    </div>
                </div>

                {/* How it Works Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">How It Works</h2>
                    <div className="space-y-12">
                        <StepItem
                            num="01"
                            title="Image Capture"
                            desc="The user captures a high-resolution photo of a symptomatic leaf using the specialized mobile-first scan interface."
                        />
                        <StepItem
                            num="02"
                            title="Neural Inference"
                            desc="The image is processed by a quantized MobileNetV2 architecture on the edge or server-side, achieving 98.7% accuracy across focused classes."
                        />
                        <StepItem
                            num="03"
                            title="Contextual Enrichment"
                            desc="Gemini 1.5 Flash analyzes the diagnosis to provide a human-readable explanation of why the model reached that conclusion."
                        />
                    </div>
                </div>

                {/* Dataset & Research Section */}
                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 mb-20">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-4">The Science Behind</h2>
                            <p className="text-gray-400 leading-relaxed mb-6 italic">
                                &quot;In every pinch of soil, there is an entire universe. In every leaf, a digital map of health.&quot;
                            </p>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                Sanjivani 2.0 is trained on the renowned <span className="text-nature-400 font-bold">PlantVillage Dataset</span>, encompassing over 50,000 expertly curated images. Our current iteration focuses on high-impact staple crops: <span className="text-white">Tomato</span> and <span className="text-white">Potato</span>, with ongoing research into Rice and Wheat.
                            </p>
                            <Badge variant="secondary" className="bg-nature-500/10 text-nature-400 border border-nature-500/20">Validated by AI Experts</Badge>
                        </div>
                        <div className="w-full md:w-80 aspect-square relative rounded-2xl overflow-hidden border border-white/10 group">
                            <Image
                                src="/about-botany.png"
                                alt="AI Botany Fusion"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-nature-950/80 to-transparent" />
                        </div>
                    </div>
                </div>

                {/* Tech Stack Horizontal Scroll */}
                <div className="mb-20">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Powered By Modern Intelligence</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <TechCard
                            icon={<Cpu className="w-5 h-5" />}
                            title="TensorFlow AI"
                            desc="Real-time Deep Learning inference for 99% accurate detection."
                        />
                        <TechCard
                            icon={<ShieldCheck className="w-5 h-5" />}
                            title="Firebase Secure"
                            desc="Enterprise-grade authentication and firestore data sync."
                        />
                        <TechCard
                            icon={<Leaf className="w-5 h-5" />}
                            title="Gemini Tutor"
                            desc="Generative AI layer explaining the 'Why' behind diagnoses."
                        />
                        <TechCard
                            icon={<Globe className="w-5 h-5" />}
                            title="Offline First"
                            desc="PWA + IndexedDB architecture for zero-connectivity zones."
                        />
                    </div>
                </div>

                {/* Developer Section */}
                <div className="glass-card p-8 md:p-12 rounded-3xl border border-nature-500/20 bg-gradient-to-r from-nature-900/40 to-dark-900/40 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className="flex-1 space-y-4">
                            <h2 className="text-3xl font-bold text-white">Built by Yash Ghodele</h2>
                            <p className="text-gray-300 leading-relaxed max-w-lg">
                                Developed as a capstone verified project, Sanjivani 2.0 represents the convergence of Full-Stack Engineering, Machine Learning, and Human-Computer Interaction design.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                                <a href="https://yash-ghodele.pages.dev/" target="_blank" rel="noopener noreferrer">
                                    <Button className="bg-white text-dark-900 hover:bg-gray-200 font-bold rounded-full px-6">
                                        View Portfolio
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </a>
                                <Link href="/contact">
                                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-6">
                                        Project Repository
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        {/* Abstract Visual or Avatar placeholder */}
                        <div className="w-40 h-40 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-nature-500 to-blue-600 opacity-20 blur-3xl absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>
        </main>
    );
}

function TechCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-nature-500/30 transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3 text-nature-400">
                {icon}
                <span className="font-bold text-white text-sm">{title}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
        </div>
    );
}

function StepItem({ num, title, desc }: { num: string, title: string, desc: string }) {
    return (
        <div className="flex items-start gap-6 relative group">
            <div className="text-5xl font-display font-black text-white/5 group-hover:text-nature-500/10 transition-colors absolute -left-4 -top-2">
                {num}
            </div>
            <div className="w-1 h-12 bg-gradient-to-b from-nature-500 to-transparent rounded-full mt-2" />
            <div className="relative">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm max-w-xl">{desc}</p>
            </div>
        </div>
    );
}
