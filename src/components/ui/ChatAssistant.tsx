import { useState } from 'react'
import { MessageSquare, X, Send, Bot } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export default function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()

    // Hide on auth pages or landing
    if (location.pathname === '/' || location.pathname === '/auth') return null

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-24 right-4 w-[90vw] max-w-sm h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100"
                    >
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Agri-Expert Bot</h3>
                                    <p className="text-xs text-primary-100 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs flex-shrink-0">
                                    AI
                                </div>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 max-w-[80%]">
                                    Hello! I'm your agriculture assistant. Ask me about crop diseases, weather, or market prices. 🌱
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ask a question..."
                                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                <button className="bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-full shadow-lg shadow-primary-500/40 text-white flex items-center justify-center z-40"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>
        </>
    )
}
