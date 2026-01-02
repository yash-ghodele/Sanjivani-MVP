import Link from 'next/link';
import { Leaf, Mail, Github, ExternalLink } from 'lucide-react';

export function Footer() {
    return (
        <footer className="relative bg-[#0a0b0a] border-t border-white/5 pt-16 pb-6">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
                    {/* Brand Section - Takes more space */}
                    <div className="lg:col-span-5 space-y-5">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-nature-500/10 flex items-center justify-center border border-nature-500/20 group-hover:bg-nature-500/20 transition-colors">
                                <Leaf className="w-6 h-6 text-nature-400" />
                            </div>
                            <div>
                                <span className="text-xl font-display font-bold text-white block leading-none">Sanjivani</span>
                                <span className="text-[10px] text-nature-400 font-semibold uppercase tracking-wider">AI Crop Doctor</span>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Empowering farmers with AI-powered crop disease detection. Works offline, detects in seconds, protects harvests. Built for Indian agriculture.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="https://github.com/yash-ghodele"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href="mailto:contact@sanjivani.app"
                                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-nature-500/20 border border-white/10 hover:border-nature-500/30 flex items-center justify-center text-gray-400 hover:text-nature-400 transition-all"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Platform</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/dashboard" className="text-gray-400 hover:text-nature-400 transition-colors inline-block">Dashboard</Link></li>
                            <li><Link href="/scan" className="text-gray-400 hover:text-nature-400 transition-colors inline-block">AI Scanner</Link></li>
                            <li><Link href="/calendar" className="text-gray-400 hover:text-nature-400 transition-colors inline-block">Crop Calendar</Link></li>
                            <li><Link href="/faq" className="text-gray-400 hover:text-nature-400 transition-colors inline-block">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">About</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <a
                                    href="https://yash-ghodele.pages.dev/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-nature-400 transition-colors inline-flex items-center gap-1 group"
                                >
                                    Developer
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </li>
                            <li><a href="#how-it-works" className="text-gray-400 hover:text-nature-400 transition-colors inline-block">How It Works</a></li>
                            <li><a href="#features" className="text-gray-400 hover:text-nature-400 transition-colors inline-block">Features</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="lg:col-span-3">
                        <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Support</h4>
                        <p className="text-xs text-gray-500 mb-3">Questions? Get in touch.</p>
                        <a
                            href="mailto:contact@sanjivani.app"
                            className="text-nature-400 font-semibold text-sm hover:text-nature-300 transition-colors inline-block"
                        >
                            contact@sanjivani.app
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-xs">
                            <p className="text-gray-500">
                                © 2026 <span className="text-white font-semibold">Sanjivani 2.0</span>
                            </p>
                            <span className="text-gray-600">•</span>
                            <span className="text-nature-400 font-semibold">MIT License</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-500">Made in 🇮🇳</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                            <span>•</span>
                            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        </div>
                    </div>

                    {/* Tech Badge */}
                    <div className="mt-6 text-center">
                        <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                            Powered by <span className="text-nature-400">TensorFlow</span> • <span className="text-blue-400">Firebase</span> • <span className="text-purple-400">Gemini AI</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
