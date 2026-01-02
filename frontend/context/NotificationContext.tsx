'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
    id: string;
    type: NotificationType;
    message: string;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (type: NotificationType, message: string) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (type: NotificationType, message: string) => {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { id, type, message }]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {notifications.map(n => (
                    <div
                        key={n.id}
                        className={`p-4 rounded-xl shadow-lg border backdrop-blur-md animate-in slide-in-from-right-full transition-all duration-300
              ${n.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-white' :
                                n.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-white' :
                                    'bg-nature-900/80 border-nature-600 text-white'}`}
                    >
                        {n.message}
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
