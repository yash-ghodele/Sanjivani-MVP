import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { CloudSun, ArrowUpRight, Leaf, Droplets, Wind } from 'lucide-react'
import Header from '../components/layout/Header'
import GlassCard from '../components/ui/GlassCard'

export default function Dashboard() {
    const navigate = useNavigate()
    const [recentScans, setRecentScans] = useState([])

    useEffect(() => {
        // Fetch recent scans
        const fetchScans = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
                const res = await fetch(`${apiUrl}/history`)
                if (res.ok) {
                    const data = await res.json()
                    setRecentScans(data.slice(0, 3))
                }
            } catch (error) {
                console.error("Failed to load dashboard scans", error)
            }
        }
        fetchScans()
    }, [])

    return (
        <div className="bg-gray-50/50 min-h-screen">
            <Header />

            <main className="container mx-auto px-4 pb-24 space-y-6 mt-4">
                {/* Welcome Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Namaste, Farmer 🙏</h1>
                        <p className="text-gray-500 font-medium">Sat, 21 Dec • Sunny</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 shadow-sm">
                        <CloudSun className="w-6 h-6" />
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <GlassCard className="bg-emerald-50 border-emerald-100 !p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                <Leaf className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold bg-white px-2 py-1 rounded text-emerald-700">+12%</span>
                        </div>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Health Score</p>
                        <h3 className="text-2xl font-bold text-gray-900">92%</h3>
                    </GlassCard>

                    <GlassCard className="bg-blue-50 border-blue-100 !p-4 relative overflow-hidden">
                        <div className="flex items-start justify-between mb-3 z-10 relative">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <CloudSun className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold bg-white px-2 py-1 rounded text-blue-700">28°C</span>
                        </div>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider z-10 relative">Weather</p>
                        <h3 className="text-2xl font-bold text-gray-900 z-10 relative">Sunny</h3>
                        {/* Decorative background element */}
                        <div className="absolute -right-4 -bottom-4 text-blue-100 opacity-50">
                            <CloudSun className="w-24 h-24" />
                        </div>
                    </GlassCard>
                </div>

                {/* Smart Alerts */}
                <div>
                    <h2 className="text-lg font-bold mb-3 text-gray-800">Smart Alerts</h2>
                    <GlassCard className="relative overflow-hidden border-orange-200">
                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                        <div className="flex items-start gap-4">
                            <div className="bg-orange-100 p-3 rounded-xl">
                                <Wind className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">High Humidity Alert</h3>
                                <p className="text-sm text-gray-500 mt-1">Favorable conditions for fungal growth. Check your crops today.</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Recent Scans */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-bold text-gray-800">Recent Scans</h2>
                        <button
                            onClick={() => navigate('/history')}
                            className="text-primary-600 text-sm font-semibold flex items-center gap-1"
                        >
                            View All <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {recentScans.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No recent scans</p>
                        ) : (
                            recentScans.map((scan: any, i) => (
                                <GlassCard key={i} hoverEffect className="!p-4 flex items-center justify-between" onClick={() => navigate('/history')}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-xl">
                                            🌿
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{scan.disease}</h4>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${scan.severity === 'Severe' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                {scan.disease === 'Healthy' ? 'Healthy' : scan.severity}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {scan.timestamp ? new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                    </span>
                                </GlassCard>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
