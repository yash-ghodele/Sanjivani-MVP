import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface GlassCardProps {
    children: ReactNode
    className?: string
    hoverEffect?: boolean
    onClick?: () => void
}

export default function GlassCard({ children, className, hoverEffect = false, onClick }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hoverEffect ? { y: -5 } : {}}
            onClick={onClick}
            className={clsx(
                "glass rounded-2xl p-6 transition-all duration-300",
                hoverEffect && "cursor-pointer hover:shadow-primary-500/10 hover:border-primary-200",
                className
            )}
        >
            {children}
        </motion.div>
    )
}
