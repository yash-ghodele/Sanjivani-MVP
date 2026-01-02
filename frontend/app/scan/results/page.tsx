'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Share2, Download, CheckCircle, AlertTriangle,
    Info, Clock, TrendingUp, Leaf, Calendar, ExternalLink
} from "lucide-react";
import Link from 'next/link';
import { PredictionResponse } from '@/services/api';
import { getGeminiAnalysis, GeminiAnalysisResponse } from '@/services/ai';
import { Loader2 } from 'lucide-react';

function ResultsContent() {
    const searchParams = useSearchParams();
    const [result, setResult] = useState<PredictionResponse | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<GeminiAnalysisResponse | null>(null);
    const [loadingAi, setLoadingAi] = useState(false);
    const [confidenceThreshold, setConfidenceThreshold] = useState(15);

    useEffect(() => {
        // Load result from localStorage or URL params
        const storedResult = localStorage.getItem('latest_scan_result');
        const storedImage = localStorage.getItem('latest_scan_image');

        if (storedResult) {
            const parsedResult = JSON.parse(storedResult);
            setResult(parsedResult);

            // Trigger Gemini Analysis
            fetchAiAnalysis(parsedResult);
        }
        if (storedImage) {
            setImageUrl(storedImage);
        }
    }, [searchParams]);

    const fetchAiAnalysis = async (prediction: PredictionResponse) => {
        try {
            setLoadingAi(true);
            const analysis = await getGeminiAnalysis(
                prediction.crop,
                prediction.disease,
                prediction.confidence
            );
            setAiAnalysis(analysis);
        } catch (error) {
            console.error("Failed to fetch AI analysis", error);
        } finally {
            setLoadingAi(false);
        }
    };

    if (!result) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <Leaf className="w-16 h-16 text-nature-500 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400">No scan results found</p>
                    <Link href="/scan">
                        <Button className="mt-4 bg-nature-600 hover:bg-nature-500">
                            Start New Scan
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical':
            case 'high':
                return 'bg-red-500/20 text-red-300 border-red-500/50';
            case 'moderate':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
            default:
                return 'bg-nature-500/20 text-nature-300 border-nature-500/50';
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Sanjivani Diagnosis: ${result.disease}`,
                    text: `Detected ${result.disease} in ${result.crop} with ${Math.round(result.confidence * 100)}% confidence.`,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/scan">
                        <Button variant="ghost" size="icon" className="text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <h1 className="text-lg font-bold">Diagnosis Results</h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white"
                        onClick={handleShare}
                    >
                        <Share2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Hero Image Section */}
            <div className="relative h-[40vh] bg-gradient-to-b from-nature-950/50 to-black">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Scanned crop"
                        className="w-full h-full object-cover opacity-80"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-nature-950/30">
                        <Leaf className="w-24 h-24 text-nature-500/30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Floating Info Card */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="glass-card p-6 rounded-3xl border border-white/10">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-nature-500/20 text-nature-300 border border-nature-500/30 uppercase">
                                            {result.crop}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${getSeverityColor(result.severity)}`}>
                                            {result.severity}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{result.disease}</h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4" />
                                            {Math.round(result.confidence * 100)}% Confidence
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {result.metadata?.inference_time_ms || 0}ms
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {/* AI Explanation */}
                <div className="glass-card p-6 rounded-3xl border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-400" />
                            <h3 className="text-xl font-bold">AI Analysis {loadingAi && <span className="text-sm font-normal text-gray-400">(Generating...)</span>}</h3>
                        </div>
                        {loadingAi && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
                    </div>

                    {aiAnalysis ? (
                        <div className="space-y-4 animate-in fade-in duration-500">
                            <p className="text-gray-300 leading-relaxed">{aiAnalysis.explanation}</p>

                            {aiAnalysis.symptoms && aiAnalysis.symptoms.length > 0 && (
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                    <h4 className="text-sm font-bold text-gray-200 mb-2">Key Symptoms to Look For:</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                                        {aiAnalysis.symptoms.map((symptom, i) => (
                                            <li key={i}>{symptom}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {aiAnalysis.economic_impact && (
                                <div className="flex gap-3 items-start bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                                    <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-300 mb-1">Economic Impact</h4>
                                        <p className="text-sm text-gray-300">{aiAnalysis.economic_impact}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-300 leading-relaxed">{result.explanation}</p>
                    )}
                </div>

                {/* Treatment Plan */}
                <div className="glass-card p-6 rounded-3xl border border-white/10">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-nature-500" />
                        Treatment Plan
                    </h3>

                    <div className="space-y-4">
                        {/* Immediate Actions */}
                        {result.recommended_actions?.immediate && result.recommended_actions.immediate.length > 0 && (
                            <div className="p-4 rounded-2xl bg-red-500/10 border-l-4 border-red-500">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                    <p className="text-sm font-bold text-red-300 uppercase">Immediate Action Required</p>
                                </div>
                                <ul className="space-y-2">
                                    {result.recommended_actions.immediate.map((action, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-200">
                                            <span className="text-red-400 mt-1">•</span>
                                            <span>{action}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Short-term Treatment */}
                        {result.recommended_actions?.short_term && result.recommended_actions.short_term.length > 0 && (
                            <div className="p-4 rounded-2xl bg-yellow-500/10 border-l-4 border-yellow-500">
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar className="w-5 h-5 text-yellow-400" />
                                    <p className="text-sm font-bold text-yellow-300 uppercase">Short-term Treatment</p>
                                </div>
                                <ul className="space-y-2">
                                    {result.recommended_actions.short_term.map((action, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-200">
                                            <span className="text-yellow-400 mt-1">•</span>
                                            <span>{action}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Preventive Measures */}
                        {result.recommended_actions?.preventive && result.recommended_actions.preventive.length > 0 && (
                            <div className="p-4 rounded-2xl bg-nature-500/10 border-l-4 border-nature-500">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle className="w-5 h-5 text-nature-400" />
                                    <p className="text-sm font-bold text-nature-300 uppercase">Preventive Measures</p>
                                </div>
                                <ul className="space-y-2">
                                    {result.recommended_actions.preventive.map((action, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-200">
                                            <span className="text-nature-400 mt-1">•</span>
                                            <span>{action}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Alternative Diagnoses (Phase 3) */}
                {result.alternatives && result.alternatives.length > 0 && (
                    <div className="glass-card p-6 rounded-3xl border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-gray-400" />
                                <h3 className="text-lg font-bold text-gray-200">Other Possibilities</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-400">Min Confidence: {confidenceThreshold}%</span>
                            </div>
                        </div>

                        {/* Custom Slider */}
                        <div className="mb-6 px-2">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={confidenceThreshold}
                                onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-nature-500 hover:accent-nature-400 transition-all"
                            />
                            <div className="flex justify-between text-[10px] text-gray-600 mt-1 font-mono">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {result.alternatives
                                .filter(alt => (alt.confidence * 100) >= confidenceThreshold)
                                .map((alt, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 animate-in fade-in slide-in-from-left-2 transition-all">
                                        <span className="text-gray-300 font-medium">{alt.disease}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-nature-500/50 rounded-full"
                                                    style={{ width: `${Math.round(alt.confidence * 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-gray-500 w-8 text-right">{Math.round(alt.confidence * 100)}%</span>
                                        </div>
                                    </div>
                                ))}

                            {result.alternatives.filter(alt => (alt.confidence * 100) >= confidenceThreshold).length === 0 && (
                                <div className="text-center py-4 text-gray-500 text-sm italic">
                                    No other diagnoses meet the {confidenceThreshold}% confidence threshold.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <Link href="/scan" className="w-full">
                        <Button className="w-full bg-nature-600 hover:bg-nature-500 h-14 text-lg font-bold">
                            New Scan
                        </Button>
                    </Link>
                    <Link href="/history" className="w-full">
                        <Button variant="outline" className="w-full border-white/20 hover:bg-white/5 h-14 text-lg font-bold">
                            View History
                        </Button>
                    </Link>
                </div>

                {/* Expert Consultation CTA */}
                <div className="glass-card p-6 rounded-3xl border border-nature-500/30 bg-gradient-to-r from-nature-900/40 to-transparent">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-nature-500/20 flex items-center justify-center flex-shrink-0">
                            <ExternalLink className="w-6 h-6 text-nature-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-white mb-1">Need Expert Help?</h4>
                            <p className="text-sm text-gray-400 mb-3">
                                Connect with agricultural experts for personalized advice
                            </p>
                            <Button variant="outline" className="border-nature-500/50 text-nature-300 hover:bg-nature-500/10">
                                Contact Expert
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-nature-500" />
            </div>
        }>
            <ResultsContent />
        </Suspense>
    );
}
