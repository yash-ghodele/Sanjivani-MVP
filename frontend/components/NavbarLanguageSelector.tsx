'use client';

import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

const languages = [
    { code: 'en', name: 'English', short: 'EN' },
    { code: 'hi', name: 'हिन्दी', short: 'हिं' },
    { code: 'mr', name: 'मराठी', short: 'मर' },
];

export function NavbarLanguageSelector() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
        setIsOpen(false);
    };

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
                <Languages className="w-4 h-4" />
                <span className="text-sm font-medium">{currentLang.short}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-dark-800/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${i18n.language === lang.code
                                    ? 'bg-nature-600/20 text-nature-400'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
