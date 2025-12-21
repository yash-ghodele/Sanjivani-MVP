import { useNavigate } from 'react-router-dom'
import { Leaf, ChevronRight, Camera, ShieldCheck, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Landing() {
    const navigate = useNavigate()

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-900 via-primary-900 to-black text-white">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-500 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-8 flex flex-col items-center justify-center min-h-screen text-center">
                {/* Brand */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-2 mb-8"
                >
                    <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
                        <Leaf className="w-8 h-8 text-primary-400" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Sanjivani</span>
                </motion.div>

                {/* Hero Text */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-100 to-primary-300"
                >
                    Your Crop's <br />
                    <span className="text-primary-400">Personal Doctor</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-gray-300 mb-12 max-w-lg mx-auto leading-relaxed"
                >
                    Instant disease detection and expert treatment plans powered by advanced AI. Protect your harvest today.
                </motion.p>

                {/* CTA Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard')}
                    className="group relative bg-primary-500 hover:bg-primary-400 text-white text-lg font-semibold py-4 px-12 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center gap-3 overflow-hidden"
                >
                    <span className="relative z-10">Get Started</span>
                    <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                {/* Floating Feature cards */}
                <div className="grid grid-cols-3 gap-4 mt-20 w-full max-w-2xl">
                    {[
                        { icon: Camera, label: "AI Scan", color: "text-blue-400" },
                        { icon: ShieldCheck, label: "98% Accuracy", color: "text-emerald-400" },
                        { icon: Activity, label: "Real-time", color: "text-amber-400" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + (i * 0.1) }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl flex flex-col items-center gap-2"
                        >
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                            <span className="text-sm font-medium text-gray-300">{item.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
