'use client';

import Link from 'next/link';
import { Leaf, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Will create UI button next

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "bg-dark-900/80 backdrop-blur-md border-b border-white/5 py-3" : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-full bg-nature-500/20 flex items-center justify-center border border-nature-500/30 group-hover:bg-nature-500/30 transition-colors">
                        <Leaf className="w-6 h-6 text-nature-400" />
                    </div>
                    <span className="text-2xl font-display font-bold text-white tracking-tight">Sanjivani</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/dashboard">Dashboard</NavLink>
                    <NavLink href="/scan">Scan Crop</NavLink>
                    <a href="https://yash-ghodele.pages.dev/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-nature-400 font-medium transition-colors text-sm">About</a>
                </div>

                {/* Action Button */}
                <div className="hidden md:block">
                    <Link href="/scan">
                        <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-nature-600 to-nature-500 text-white font-bold text-sm shadow-lg shadow-nature-500/20 hover:shadow-nature-500/40 hover:scale-105 transition-all">
                            Start Diagnosis
                        </button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-dark-800 border-b border-white/10 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
                    <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
                    <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                    <MobileNavLink href="/scan" onClick={() => setMobileMenuOpen(false)}>Scan Crop</MobileNavLink>
                    <Link href="/scan" onClick={() => setMobileMenuOpen(false)}>
                        <button className="w-full py-3 rounded-xl bg-nature-600 font-bold text-white">Start Diagnosis</button>
                    </Link>
                </div>
            )}
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-white/70 hover:text-nature-400 font-medium transition-colors text-sm"
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-white/80 hover:text-white font-medium py-2 border-b border-white/5"
        >
            {children}
        </Link>
    );
}
