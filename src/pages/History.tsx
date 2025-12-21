import { useState, useEffect } from 'react'
import { Calendar, ChevronRight } from 'lucide-react'
import Header from '../components/layout/Header'
import GlassCard from '../components/ui/GlassCard'

interface Scan {
    id?: string;
    disease: string;
    confidence: number;
    severity: string;
    timestamp?: string;
}

export default function History() {
    const [scans, setScans] = useState<Scan[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
            const res = await fetch(`${apiUrl}/history`)
            if (res.ok) {
                const data = await res.json()
                setScans(data)
            }
        } catch (error) {
            console.error("Failed to fetch history", error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (severity: string) => {
        switch (severity?.toLowerCase()) {
            case 'none': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
            case 'severe': return 'bg-red-100 text-red-700 border-red-200'
            case 'moderate': return 'bg-amber-100 text-amber-700 border-amber-200'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="bg-gray-50/50 min-h-screen pb-24">
            <Header title="Scan History" showBack />

            <main className="container mx-auto px-4 mt-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Past Inspections</h2>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : scans.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        <p>No scans found yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {scans.map((scan, idx) => (
                            <GlassCard key={scan.id || idx} className="!p-4 flex gap-4 hover:bg-white/90" hoverEffect>
                                {/* Image Thumbnail (Placeholder or preserved logic needed later) */}
                                <div className="w-20 h-20 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl">
                                    🌿
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-900 text-lg">{scan.disease}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-md border font-semibold ${getStatusColor(scan.severity)}`}>
                                            {scan.confidence}%
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                        <Calendar className="w-3 h-3" />
                                        {scan.timestamp ? new Date(scan.timestamp).toLocaleDateString() : 'Just now'}
                                    </div>

                                    <div className="flex items-center text-primary-600 text-sm font-medium">
                                        View Report <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
