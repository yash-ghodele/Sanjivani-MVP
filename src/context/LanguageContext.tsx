import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'hi' | 'mr'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const translations = {
    en: {
        'welcome': 'Namaste, Farmer 🙏',
        'scan_crop': 'Scan Crop',
        'history': 'History',
        'dashboard': 'Dashboard',
        'login': 'Login',
        'signup': 'Sign Up',
        'get_started': 'Get Started',
    },
    hi: {
        'welcome': 'नमस्ते, किसान 🙏',
        'scan_crop': 'फसल स्कैन करें',
        'history': 'इतिहास',
        'dashboard': 'डैशबोर्ड',
        'login': 'लॉग इन करें',
        'signup': 'साइन अप करें',
        'get_started': 'शुरू करें',
    },
    mr: {
        'welcome': 'नमस्कार, शेतकरी 🙏',
        'scan_crop': 'पिक स्कॅन करा',
        'history': 'इतिहास',
        'dashboard': 'डॅशबोर्ड',
        'login': 'लॉगिन करा',
        'signup': 'साइन अप करा',
        'get_started': 'सुरु करा',
    }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en')

    const t = (key: string) => {
        return translations[language][key as keyof typeof translations['en']] || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
    return context
}
