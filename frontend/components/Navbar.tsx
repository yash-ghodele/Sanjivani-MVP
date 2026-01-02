'use client';

import Link from 'next/link';
import { Leaf, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AuthButton } from '@/components/AuthButton';
import { NavbarLanguageSelector } from '@/components/NavbarLanguageSelector';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, hasMounted } = useAuth();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScanClick = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault();
            alert('Please sign in to use the scan feature');
            // Could also redirect to /dashboard which will show auth flow
            window.location.href = '/dashboard';
        }
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                isScrolled ? "bg-[#1a1a18]/80 backdrop-blur-md border-white/5 py-4 shadow-lg" : "bg-transparent py-6"
            )}
        >
            <div className="container-padding flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-full bg-[#82ae19]/10 flex items-center justify-center border border-[#82ae19]/20 group-hover:bg-[#82ae19]/20 transition-colors">
                        <Leaf className="w-6 h-6 text-[#82ae19]" />
                    </div>
                    <span className="text-2xl font-display font-medium text-white tracking-tight">Sanjivani</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <NavLink href="/" active={pathname === '/'}>Home</NavLink>
                    <NavLink href="/dashboard" active={pathname === '/dashboard'}>Dashboard</NavLink>
                    <NavLink href="/calendar" active={pathname === '/calendar'}>Calendar</NavLink>
                    <NavLink href="/faq" active={pathname === '/faq'}>FAQ</NavLink>
                </div>

                {/* Action Button & Auth */}
                <div className="hidden md:flex items-center gap-4">
                    <NavbarLanguageSelector />
                    <Link href="/scan" onClick={handleScanClick}>
                        <button className="px-6 py-2.5 rounded-full bg-nature-600 text-white font-semibold text-sm hover:bg-nature-500 transition-all shadow-[0_0_20px_rgba(130,174,25,0.3)]">
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
                    <div className="flex justify-center pb-4 border-b border-white/5">
                        <NavbarLanguageSelector />
                    </div>
                    <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)} active={pathname === '/'}>Home</MobileNavLink>
                    <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)} active={pathname === '/dashboard'}>Dashboard</MobileNavLink>
                    <MobileNavLink href="/calendar" onClick={() => setMobileMenuOpen(false)} active={pathname === '/calendar'}>Calendar</MobileNavLink>
                    <MobileNavLink href="/faq" onClick={() => setMobileMenuOpen(false)} active={pathname === '/faq'}>FAQ</MobileNavLink>
                    <Link href="/scan" onClick={(e) => { handleScanClick(e); setMobileMenuOpen(false); }}>
                        <button className="w-full btn-primary py-3">Start Diagnosis</button>
                    </Link>
                </div>
            )}
        </nav>
    );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "font-medium transition-all text-sm tracking-wide relative",
                active
                    ? "text-nature-400"
                    : "text-gray-400 hover:text-nature-500"
            )}
        >
            {children}
            {active && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-nature-400 rounded-full" />
            )}
        </Link>
    );
}

function MobileNavLink({ href, onClick, children, active }: { href: string; onClick: () => void; children: React.ReactNode; active: boolean }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "font-medium py-3 border-b border-white/5 transition-colors",
                active
                    ? "text-nature-400"
                    : "text-gray-300 hover:text-white"
            )}
        >
            {children}
        </Link>
    );
}
