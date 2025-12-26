'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, X, RefreshCw, CheckCircle, AlertTriangle, ArrowRight, Loader2, Clock, Info } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { PredictionResponse } from '@/services/api';

export default function ScanPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<PredictionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Initialize Camera
    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError(null);
        } catch (err) {
            console.error("Camera Error:", err);
            setError("Unable to access camera. Please allow permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw video frame to canvas
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setImage(dataUrl);
                stopCamera(); // Stop stream after capture
            }
        }
    };

    const resetScan = () => {
        setImage(null);
        setResult(null);
        startCamera();
    };

    const analyzeImage = async () => {
        setAnalyzing(true);
        // MOCK DATA: Simulating backend response strictly following V2 contract
        // In production, this would be: const data = await analyzeCropImage(file);
        setTimeout(() => {
            setResult({
                crop: "Tomato",
                disease: "Early Blight",
                confidence: 0.94,
                severity: "Moderate",
                explanation: "Dark concentric rings detected on lower leaves indicate Early Blight fungal infection.",
                recommended_actions: {
                    immediate: [
                        "Isolate infected plants to prevent spread.",
                        "Remove and destroy affected leaves."
                    ],
                    short_term: [
                        "Apply copper-based fungicide every 7 days.",
                        "Reduce overhead watering to keep foliage dry."
                    ],
                    preventive: [
                        "Rotate crops next season.",
                        "Direct water to soil base only."
                    ]
                },
                metadata: {
                    model_version: "v2.0.0-mobilenet",
                    inference_time_ms: 45,
                    visual_features: ["concentric_rings", "yellow_halo"]
                }
            });
            setAnalyzing(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="text-white">
                        <X className="w-6 h-6" />
                    </Button>
                </Link>
                <h1 className="text-lg font-bold">New Scan</h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Main Content */}
            <div className={`max-w-md mx-auto relative rounded-3xl overflow-hidden bg-nature-950/50 border border-nature-800 flex flex-col shadow-2xl shadow-nature-900/20 transition-all duration-500 ${result ? 'h-auto' : 'h-[60vh]'}`}>

                {/* Camera View / Image Preview */}
                <div className={`relative bg-black flex items-center justify-center overflow-hidden transition-all duration-500 ${result ? 'h-48' : 'flex-1'}`}>
                    {image ? (
                        <div className="relative w-full h-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={image} alt="Captured" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            {!error && (
                                <div className="absolute inset-0 border-2 border-nature-500/30 m-8 rounded-xl pointer-events-none">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-nature-500 rounded-tl-xl" />
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-nature-500 rounded-tr-xl" />
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-nature-500 rounded-bl-xl" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-nature-500 rounded-br-xl" />
                                    <div className="w-full h-1 bg-nature-400 absolute top-1/2 -translate-y-1/2 animate-scan opacity-70" />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Controls / Result Area */}
                <div className="p-6 bg-nature-900/90 backdrop-blur-md border-t border-nature-700/50">
                    {!image ? (
                        <div className="flex justify-center py-4">
                            <button
                                onClick={captureImage}
                                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform active:scale-95 group"
                            >
                                <div className="w-16 h-16 rounded-full bg-white group-active:bg-nature-200 transition-colors" />
                            </button>
                        </div>
                    ) : !result ? (
                        <div className="flex gap-4 py-4">
                            <Button
                                variant="outline"
                                className="flex-1 h-12 border-nature-600 text-nature-100 hover:bg-nature-800"
                                onClick={resetScan}
                                disabled={analyzing}
                            >
                                <RefreshCw className="mr-2 w-4 h-4" /> Retake
                            </Button>
                            <Button
                                className="flex-1 h-12 bg-nature-600 hover:bg-nature-500 text-white font-bold"
                                onClick={analyzeImage}
                                disabled={analyzing}
                            >
                                {analyzing ? (
                                    <>
                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Analyze <ArrowRight className="ml-2 w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Diagnosis Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-nature-500/20 text-nature-300 border border-nature-500/30 uppercase tracking-wide">
                                            {result.crop}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold border uppercase tracking-wide
                                            ${result.severity === 'Critical' || result.severity === 'High' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                                                result.severity === 'Moderate' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                                    'bg-nature-500/20 text-nature-300 border-nature-500/30'}`}>
                                            {result.severity}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">{result.disease}</h2>
                                    <p className="text-sm text-gray-400 mt-1">{result.explanation}</p>
                                </div>
                                <div className="text-center bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                                    <div className="text-2xl font-bold text-nature-400">{(result.confidence * 100).toFixed(0)}%</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Confidence</div>
                                </div>
                            </div>

                            {/* Action Cards */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-sm text-gray-300 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-nature-500" /> Recommended Actions
                                </h3>

                                {result.recommended_actions.immediate.length > 0 && (
                                    <div className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-r-lg">
                                        <p className="text-xs text-red-400 font-bold mb-1 uppercase">Immediate Action</p>
                                        <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
                                            {result.recommended_actions.immediate.map((action, i) => (
                                                <li key={i}>{action}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {result.recommended_actions.short_term.length > 0 && (
                                    <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-3 rounded-r-lg">
                                        <p className="text-xs text-yellow-400 font-bold mb-1 uppercase">Short Term Treatment</p>
                                        <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
                                            {result.recommended_actions.short_term.map((action, i) => (
                                                <li key={i}>{action}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Metadata Footer */}
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {result.metadata.inference_time_ms}ms
                                </span>
                                <span className="flex items-center gap-1">
                                    <Info className="w-3 h-3" /> {result.metadata.model_version}
                                </span>
                            </div>

                            <Button onClick={resetScan} className="w-full bg-nature-600 h-12 font-bold hover:bg-nature-500">
                                Scan Another Crop
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
