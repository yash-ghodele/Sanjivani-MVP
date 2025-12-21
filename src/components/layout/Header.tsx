import { Leaf } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Header({ title, showBack = false }: { title?: string, showBack?: boolean }) {
    const navigate = useNavigate()

    return (
        <header className="sticky top-0 z-40 px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3" onClick={() => navigate('/dashboard')}>
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 text-white script-font cursor-pointer">
                        <Leaf className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-gray-900 leading-none tracking-tight">
                            Sanjivani
                        </span>
                        <span className="text-xs text-primary-600 font-medium tracking-wide uppercase">
                            AI Crop Doctor
                        </span>
                    </div>
                </div>

                {/* Profile/Settings could go here */}
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-primary-700 font-bold text-sm">
                    AG
                </div>
            </div>
        </header>
    )
}
