'use client';

import { useEffect } from 'react';
import '../lib/i18n'; // Initialize i18next

export function I18nProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Load saved language preference
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            import('../lib/i18n').then((module) => {
                module.default.changeLanguage(savedLang);
            });
        }
    }, []);

    return <>{children}</>;
}
