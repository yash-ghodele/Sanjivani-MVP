'use client';

import { Languages, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages: { code: string; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

export function LanguageSelector() {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    return (
        <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-3">
                <Languages className="w-4 h-4 text-gray-500" />
                <h3 className="text-xs uppercase tracking-wider text-gray-500">{t('language')}</h3>
            </div>
            <div className="space-y-1">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${i18n.language === lang.code
                                ? 'bg-nature-600/20 text-nature-400 border border-nature-600/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className="font-medium">{lang.nativeName}</span>
                        {i18n.language === lang.code && <Check className="w-4 h-4" />}
                    </button>
                ))}
            </div>
        </div>
    );
}
