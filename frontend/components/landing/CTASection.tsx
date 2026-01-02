"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function CTASection() {
    return (
        <section className="py-24 relative">
            <div className="container-padding relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Heading */}
                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-6xl font-display font-medium text-white leading-[1.1]">
                            Discuss details <br />
                            of your <span className="text-[#82ae19]">project?</span>
                        </h2>
                        <div className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors">
                            <span>Contact us</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>

                        {/* Social / Extra Links Placeholder */}
                        <div className="flex gap-4 pt-8">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#82ae19] transition-colors">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Mock Form Style (Interactive visuals) */}
                    <div className="bg-[#1a1a18] rounded-3xl p-8 border border-white/5 space-y-4 shadow-2xl">
                        {/* Mock Inputs for Aesthetic */}
                        <div className="h-14 bg-white/10 rounded-xl w-full px-6 flex items-center text-gray-500 text-sm">
                            Your Name
                        </div>
                        <div className="h-14 bg-white/10 rounded-xl w-full px-6 flex items-center text-gray-500 text-sm">
                            Phone Number
                        </div>
                        <div className="h-32 bg-white/10 rounded-xl w-full p-6 text-gray-500 text-sm">
                            Comment
                        </div>

                        <Link href="/scan" className="block pt-2">
                            <button className="w-full h-14 rounded-full border border-white/20 text-white font-medium hover:bg-[#82ae19] hover:border-[#82ae19] transition-all flex items-center justify-center gap-2">
                                Start Free Scan Instead
                            </button>
                        </Link>

                        <p className="text-[10px] text-gray-600 text-center px-4">
                            By clicking the button you agree to our processing of personal data.
                        </p>
                    </div>

                </div>
            </div>


        </section>
    );
}
