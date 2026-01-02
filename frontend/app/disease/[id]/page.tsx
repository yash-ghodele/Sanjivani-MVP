'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Share2, AlertTriangle, Sprout, Info, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// We'll fetch from the same meta endpoint for now, or a specific detail one.
// Since we don't have a specific detail endpoint yet, we'll use the meta one and filter client side
// OR we can update the backend to support /api/v2/meta/diseases/{id}. 
// For efficiency, let's reuse the full list for now as it's small, or just mock it if needed?
// No, the plan said "Fetch disease list...". 
// Better: Add a lightweight endpoint for details if the list grows, but for < 20 items, client filtering is fine.
// Wait, the meta endpoint filtered sypmtoms. Let's add a proper detail endpoint.

interface DiseaseDetail {
    id: string;
    name: string;
    scientific_name: string;
    severity: string;
    crops_affected: string[];
    symptoms: string[];
    recommended_actions: {
        immediate: string[];
        short_term: string[];
        preventive: string[];
    };
    explanation: string;
    economic_impact: string;
}

export default function DiseaseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [disease, setDisease] = useState<DiseaseDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDisease = async () => {
            if (!params.id) return;
            try {
                // Fetch full list and find. Ideally this should be a specific API call.
                // Let's implement a specific API call in the backend next.
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v2/meta/diseases/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setDisease(data);
                } else {
                    console.error("Not found");
                }
            } catch (error) {
                console.error("Failed to fetch disease details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDisease();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-pulse text-nature-400">Loading disease intel...</div>
            </div>
        );
    }

    if (!disease) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Disease Not Found</h1>
                <Link href="/">
                    <Button variant="outline">Return Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Header / Hero */}
            <div className="relative h-[25vh] bg-nature-950/50 border-b border-nature-900 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-10">
                    <button onClick={() => router.back()} className="absolute top-8 left-4 text-gray-400 hover:text-white flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>

                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold font-display tracking-tight text-white">{disease.name}</h1>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                                    disease.severity === 'Critical' ? "bg-red-500/20 text-red-400 border-red-500/30" :
                                        disease.severity === 'High' ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                                            "bg-nature-500/20 text-nature-400 border-nature-500/30"
                                )}>
                                    {disease.severity}
                                </span>
                            </div>
                            <p className="text-xl text-gray-400 italic font-serif">{disease.scientific_name}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Share2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Quick Info */}
                <div className="space-y-6">
                    <div className="bg-nature-900/40 border border-nature-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Sprout className="w-5 h-5 text-nature-400" /> Affected Crops
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {disease.crops_affected.map(c => (
                                <span key={c} className="px-3 py-1.5 bg-nature-950 border border-nature-700 rounded-lg text-sm text-nature-200">
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-nature-900/40 border border-nature-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-400" /> Economic Impact
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {disease.economic_impact}
                        </p>
                    </div>
                </div>

                {/* Main Column: Details */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Explanation */}
                    <div className="prose prose-invert max-w-none">
                        <p className="text-lg text-gray-300 leading-relaxed">
                            {disease.explanation}
                        </p>
                    </div>

                    {/* Symptoms */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Identification</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {disease.symptoms.map((sym, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-nature-500/30 transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-nature-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-nature-400 text-xs font-bold">{i + 1}</span>
                                    </div>
                                    <p className="text-gray-300">{sym}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6">Management Strategy</h3>
                        <div className="space-y-6">
                            {/* Immediate */}
                            <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-6">
                                <h4 className="flex items-center gap-2 text-red-400 font-bold mb-4">
                                    <AlertTriangle className="w-5 h-5" /> Immediate Action
                                </h4>
                                <ul className="space-y-3">
                                    {disease.recommended_actions.immediate.map((action, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                            {action}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Preventive */}
                            <div className="bg-green-950/30 border border-green-900/50 rounded-2xl p-6">
                                <h4 className="flex items-center gap-2 text-green-400 font-bold mb-4">
                                    <Calendar className="w-5 h-5" /> Long-term Prevention
                                </h4>
                                <ul className="space-y-3">
                                    {disease.recommended_actions.preventive.map((action, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                                            {action}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
