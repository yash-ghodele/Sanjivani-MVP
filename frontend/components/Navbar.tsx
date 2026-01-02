'use client';

import Link from 'next/link';
import { Leaf, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AuthButton } from '@/components/AuthButton';
import dynamic from 'next/dynamic';

const GlobalSearchComponent = dynamic(() => import('@/components/GlobalSearch'), {
    ssr: false,
    loading: () => <div className="h-10 w-10 xl:w-60 bg-white/5 rounded-lg animate-pulse" />
});

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
                isScrolled ? "glass-nav py-4" : "bg-transparent py-6"
            )}
        >
            <div className="container-padding flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-full bg-nature-500/10 flex items-center justify-center border border-nature-500/20 group-hover:bg-nature-500/20 transition-colors">
                        <Leaf className="w-6 h-6 text-nature-500" />
                    </div>
                    <span className="text-2xl font-display font-bold text-white tracking-tight">Sanjivani</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <GlobalSearchComponent />
                    <div className="flex items-center gap-6">
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/dashboard">Dashboard</NavLink>
                        <NavLink href="/calendar">Calendar</NavLink>
                        <NavLink href="/history">History</NavLink>
                        <NavLink href="/faq">FAQ</NavLink>
                        <NavLink href="/about">About</NavLink>
                    </div>
                </div>

                {/* Action Button & Auth */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/scan">
                        <button className="btn-primary px-6 py-3 text-sm shadow-lg shadow-nature-500/20">
                            Start Diagnosis
                        </button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <AuthButton />
                    </div>
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
                <div className="md:hidden absolute top-full left-0 right-0 glass-nav border-t border-white/5 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
                    <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
                    <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                    <MobileNavLink href="/calendar" onClick={() => setMobileMenuOpen(false)}>Calendar</MobileNavLink>
                    <MobileNavLink href="/history" onClick={() => setMobileMenuOpen(false)}>History</MobileNavLink>
                    <MobileNavLink href="/faq" onClick={() => setMobileMenuOpen(false)}>FAQ</MobileNavLink>
                    <MobileNavLink href="/about" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
                    <Link href="/scan" onClick={() => setMobileMenuOpen(false)}>
                        <button className="w-full btn-primary py-3">Start Diagnosis</button>
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
            className="text-gray-400 hover:text-nature-500 font-medium transition-colors text-sm tracking-wide"
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
            className="text-gray-300 hover:text-white font-medium py-3 border-b border-white/5"
        >
            {children}
        </Link>
    );
}
