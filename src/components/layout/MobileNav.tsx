import { ArrowLeft, Home, Camera, History, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function MobileNav() {
    const location = useLocation()

    const navItems = [
        { icon: Home, label: 'Home', path: '/dashboard' },
        { icon: Camera, label: 'Scan', path: '/camera', isFab: true },
        { icon: History, label: 'History', path: '/history' },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
            <nav className="glass mx-auto max-w-lg rounded-2xl flex items-center justify-around p-2 pointer-events-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path

                    if (item.isFab) {
                        return (
                            <div key={item.path} className="relative -top-8">
                                <Link to={item.path}>
                                    <motion.div
                                        whileTap={{ scale: 0.9 }}
                                        className="w-16 h-16 bg-primary-500 rounded-full shadow-glow flex items-center justify-center text-white border-4 border-gray-50"
                                    >
                                        <item.icon className="w-8 h-8" />
                                    </motion.div>
                                </Link>
                            </div>
                        )
                    }

                    return (
                        <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 p-2 min-w-[60px]">
                            <item.icon className={clsx("w-6 h-6 transition-colors", isActive ? "text-primary-600" : "text-gray-400")} />
                            <span className={clsx("text-xs font-medium", isActive ? "text-primary-600" : "text-gray-400")}>
                                {item.label}
                            </span>
                            {isActive && (
                                <motion.div layoutId="nav-dot" className="w-1 h-1 bg-primary-600 rounded-full mt-1" />
                            )}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
