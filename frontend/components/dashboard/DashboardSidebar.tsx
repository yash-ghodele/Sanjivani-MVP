'use client';

import { useEffect, useState } from 'react';
import { MapPin, Calendar, Clock, ScanLine, CalendarDays, Download, HelpCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';

interface LocationData {
    city: string;
    state: string;
    country: string;
    lat: number;
    lon: number;
}

interface DashboardSidebarProps {
    userName: string;
    totalScans: number;
    alerts: number;
    onExport?: () => void;
}

export function DashboardSidebar({ userName, totalScans, alerts, onExport }: DashboardSidebarProps) {
    const { t } = useTranslation();
    const [dateTime, setDateTime] = useState({
        day: '',
        date: '',
        time: ''
    });
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(true);

    // Update date/time every second
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setDateTime({
                day: now.toLocaleDateString('en-IN', { weekday: 'long' }),
                date: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            });
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch geolocation
    useEffect(() => {
        const fetchLocation = async () => {
            // Check if geolocation is available
            if (!navigator.geolocation) {
                console.log('Geolocation not supported by browser');
                setLocation({
                    city: 'Location Unavailable',
                    state: '',
                    country: 'India',
                    lat: 0,
                    lon: 0
                });
                setLoadingLocation(false);
                return;
            }

            try {
                // Request user's location with high accuracy
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        resolve,
                        reject,
                        {
                            timeout: 10000,
                            enableHighAccuracy: true,
                            maximumAge: 0 // Don't use cached location
                        }
                    );
                });

                const { latitude, longitude } = position.coords;

                // Reverse geocode to get city/state
                const response = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                );

                if (response.ok) {
                    const data = await response.json();
                    setLocation({
                        city: data.city || data.locality || 'Unknown City',
                        state: data.principalSubdivision || '',
                        country: data.countryName || 'India',
                        lat: latitude,
                        lon: longitude
                    });
                }
            } catch (error: any) {
                // Handle specific geolocation errors
                if (error.code === 1) {
                    console.log('Location access denied by user. Please enable location to see your area.');
                } else if (error.code === 2) {
                    console.log('Location unavailable - position could not be determined.');
                } else if (error.code === 3) {
                    console.log('Location request timed out.');
                } else {
                    console.log('Could not fetch location.');
                }

                // Fallback to default location
                setLocation({
                    city: 'Enable Location',
                    state: 'for accurate data',
                    country: 'India',
                    lat: 0,
                    lon: 0
                });
            } finally {
                setLoadingLocation(false);
            }
        };

        fetchLocation();
    }, []);

    return (
        <aside className="w-80 bg-[#0a0b0a] border-r border-white/10 flex flex-col h-screen sticky top-0">
            {/* User & Location */}
            <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-display font-bold text-white mb-1">
                    {userName}
                </h2>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    {loadingLocation ? (
                        <span className="animate-pulse">{t('detectingLocation')}</span>
                    ) : location?.city === 'Enable Location' ? (
                        <button
                            onClick={() => window.location.reload()}
                            className="text-yellow-400 hover:text-yellow-300 underline"
                            title="Click to request location permission"
                        >
                            {t('enableLocation')}
                        </button>
                    ) : (
                        <span>{location?.city}{location?.state && `, ${location.state}`}</span>
                    )}
                </div>
            </div>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Primary Action - Scan */}
            <div className="p-6 border-b border-white/10">
                <Link href="/scan">
                    <button className="w-full h-14 rounded-xl bg-nature-600 hover:bg-nature-500 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-nature-600/20">
                        <ScanLine className="w-5 h-5" />
                        {t('scanYourCrop')}
                    </button>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="p-6 border-b border-white/10 space-y-2">
                <NavLink href="/" icon={Home}>
                    {t('home')}
                </NavLink>
                <NavLink href="/calendar" icon={CalendarDays}>
                    {t('cropCalendar')}
                </NavLink>
                {onExport && (
                    <button
                        onClick={onExport}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left"
                    >
                        <Download className="w-5 h-5" />
                        {t('exportData')}
                    </button>
                )}
                <NavLink href="/faq" icon={HelpCircle}>
                    {t('helpFaq')}
                </NavLink>
            </nav>

            {/* Date & Time */}
            <div className="p-6 border-b border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-nature-400" />
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{dateTime.day}</div>
                        <div className="text-sm text-white font-medium">{dateTime.date}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <div className="text-2xl font-display font-bold text-white tabular-nums">
                        {dateTime.time}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-1 p-6">
                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3">{t('quickStats')}</h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{t('totalScans')}</span>
                        <span className="text-lg font-bold text-white">{totalScans}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{t('activeAlerts')}</span>
                        <span className={`text-lg font-bold ${alerts > 0 ? 'text-red-400' : 'text-nature-400'}`}>
                            {alerts}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
                <p className="text-xs text-gray-600">
                    Sanjivani 2.0
                </p>
            </div>
        </aside>
    );
}

function NavLink({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) {
    return (
        <Link href={href}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <Icon className="w-5 h-5" />
                {children}
            </div>
        </Link>
    );
}
