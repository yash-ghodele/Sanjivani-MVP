'use client';

import {
    HelpCircle,
    Wifi,
    ShieldCheck,
    Cpu,
    Smartphone,
    Leaf,
    ChevronDown,
    ArrowLeft
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

interface FAQItemProps {
    question: string;
    answer: string;
    icon: React.ElementType;
}

function FAQItem({ question, answer, icon: Icon }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="group border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-nature-500/30 hover:bg-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-start justify-between p-6 text-left"
            >
                <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0",
                        isOpen
                            ? "bg-nature-500/20 text-nature-400 border border-nature-500/30"
                            : "bg-white/5 text-gray-400 border border-white/10 group-hover:bg-white/10"
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 pr-4">
                        <h3 className="font-bold text-lg text-white/90 mb-1">{question}</h3>
                        <p className={cn(
                            "text-sm text-gray-500 transition-opacity",
                            isOpen ? "opacity-0 h-0" : "opacity-100"
                        )}>
                            Click to expand
                        </p>
                    </div>
                </div>
                <ChevronDown className={cn(
                    "w-5 h-5 text-gray-400 transition-all duration-300 flex-shrink-0",
                    isOpen ? "rotate-180 text-nature-400" : "group-hover:text-nature-500"
                )} />
            </button>
            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="px-6 pb-6 pl-[88px] text-gray-400 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
}

export default function FAQPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#0a0b0a] text-white pb-20 pt-16">
                {/* Background Pattern */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0b0a] via-[#0f110f] to-[#0a0b0a]" />
                    <div className="absolute inset-0 opacity-30">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="faq-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                    <circle cx="50" cy="50" r="1" fill="#82ae19" opacity="0.3" />
                                    <circle cx="25" cy="25" r="1" fill="#3b82f6" opacity="0.2" />
                                    <circle cx="75" cy="75" r="1" fill="#82ae19" opacity="0.2" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#faq-pattern)" />
                        </svg>
                    </div>
                    {/* Gradient Orbs */}
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-nature-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Hero Section */}
                    <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-nature-500/10 rounded-2xl mb-6 border border-nature-500/20">
                            <HelpCircle className="w-10 h-10 text-nature-400" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold font-display mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Everything you need to know about Sanjivani AI, disease detection, and crop protection
                        </p>
                    </div>

                    {/* FAQ List */}
                    <div className="container mx-auto px-4 max-w-4xl space-y-4 mb-20">
                        <FAQItem
                            icon={Cpu}
                            question="How accurate is the AI detection?"
                            answer="Sanjivani uses a custom-trained Convolutional Neural Network (CNN) with MobileNetV2 architecture, achieving over 95% accuracy on our validation dataset. However, environmental factors like lighting and image quality can affect results. We always recommend consulting a local expert for critical decisions."
                        />

                        <FAQItem
                            icon={Wifi}
                            question="Does it work offline?"
                            answer="Yes! Sanjivani includes 'PWA Offline Mode'. If you lose internet connection, you can still take photos. The app will queue them securely on your device and automatically process them once you're back online."
                        />

                        <FAQItem
                            icon={ShieldCheck}
                            question="Is my data private?"
                            answer="Absolutely. We process images securely via our encrypted API. We do not sell your farm data. Images are anonymously aggregated only to retrain and improve the AI model for the community."
                        />

                        <FAQItem
                            icon={Smartphone}
                            question="Which crops are supported?"
                            answer="Currently, Sanjivani supports Tomato, Potato, Corn (Maize), Cotton, and Wheat. We are actively collecting data to expand to Soybean and Sugarcane in the next update."
                        />

                        <FAQItem
                            icon={Leaf}
                            question="What if the plant is healthy?"
                            answer="The AI is trained to recognize 'Healthy' states for all supported crops. If no disease is detected, it will confirm the plant is healthy and provide general care tips to maintain its vigor."
                        />
                    </div>

                    {/* Contact CTA */}
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="relative bg-gradient-to-br from-nature-950/50 to-nature-900/30 border border-nature-500/20 rounded-3xl p-12 overflow-hidden backdrop-blur-sm">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-nature-500/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

                            <div className="relative z-10 text-center">
                                <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
                                <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
                                    Our team of agricultural experts and developers is here to help you get the most out of Sanjivani
                                </p>
                                <Link href="/contact">
                                    <Button className="bg-nature-600 hover:bg-nature-500 text-white font-bold h-12 px-8 rounded-full shadow-lg shadow-nature-600/20 transition-all">
                                        Contact Support
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
