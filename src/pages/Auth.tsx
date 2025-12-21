import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, Phone, ArrowRight, Lock } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'

export default function Login() {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(true)

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-primary-900 to-black flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-md !p-8 border-white/20">
                <div className="flex justify-center mb-6">
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
                        <Leaf className="w-10 h-10 text-primary-400" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-white mb-2">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-center text-gray-400 mb-8">
                    {isLogin ? 'Enter your details to access your farm' : 'Join thousands of smart farmers today'}
                </p>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Ex. Ramesh Kumar"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                placeholder="•••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-emerald-500 to-primary-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-4"
                    >
                        {isLogin ? 'Login Securely' : 'Register Now'} <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-400">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary-400 font-bold ml-2 hover:underline"
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </GlassCard>
        </div>
    )
}
