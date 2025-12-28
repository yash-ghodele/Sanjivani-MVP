'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Camera, X, RefreshCw, CheckCircle, ArrowRight, Loader2, Clock, Info, Upload, Image as ImageIcon } from "lucide-react";
import Link from 'next/link';
import { PredictionResponse, analyzeCropImage } from '@/services/api';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { AIExplanation } from "@/components/AIExplanation";
import { compressImage } from '@/utils/compression';

export default function ScanPage() {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<PredictionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'select' | 'camera' | 'upload'>('select');
    const [isDragging, setIsDragging] = useState(false);

    // Cleanup camera on unmount
    useEffect(() => {
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

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setImage(dataUrl);
                stopCamera();
            }
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setImage(e.target?.result as string);
            setMode('upload');
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    };

    const resetScan = () => {
        setImage(null);
        setResult(null);
        setMode('select');
        setError(null);
        stopCamera();
    };

    const saveScanToHistory = (result: PredictionResponse, imageUrl: string) => {
        try {
            const scanRecord = {
                id: Date.now().toString(),
                imageUrl,
                crop: result.crop,
                disease: result.disease,
                severity: result.severity,
                confidence: result.confidence,
                timestamp: Date.now(),
                metadata: result.metadata
            };

            const history = localStorage.getItem('scan_history');
            const scans = history ? JSON.parse(history) : [];
            scans.unshift(scanRecord); // Add to beginning

            // Keep only last 50 scans
            if (scans.length > 50) {
                scans.pop();
            }

            localStorage.setItem('scan_history', JSON.stringify(scans));
        } catch (error) {
            console.error('Failed to save scan to history:', error);
        }
    };

    const { isOnline } = useOfflineSync();

    const analyzeImage = async () => {
        if (!image) return;
        setAnalyzing(true);
        setError(null);

        try {
            const res = await fetch(image);
            const blob = await res.blob();

            if (!isOnline) {
                const { addOfflineScan } = await import('@/lib/db');
                await addOfflineScan({
                    id: Date.now().toString(),
                    imageBlob: blob,
                    timestamp: Date.now()
                });

                setError("You are offline. Scan saved to queue and will auto-upload when online.");
                setAnalyzing(false);
                return;
            }

            // ... inside analyzeImage ...

            let fileToUpload: File;
            if (blob instanceof File) {
                fileToUpload = blob;
            } else {
                fileToUpload = new File([blob], "capture.jpg", { type: "image/jpeg" });
            }

            // Compress image
            const compressedFile = await compressImage(fileToUpload);

            const data = await analyzeCropImage(compressedFile);
            setResult(data);
            saveScanToHistory(data, image);

            // Store for results page
            localStorage.setItem('latest_scan_result', JSON.stringify(data));
            localStorage.setItem('latest_scan_image', image);

            // Navigate to results page
            router.push('/scan/results');
        } catch (err) {
            console.error("Analysis Failed:", err);
            setError("Analysis failed. Please try again.");
        } finally {
            setAnalyzing(false);
        }
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

                {/* Selection Screen / Camera View / Image Preview */}
                <div className={`relative bg-black flex items-center justify-center overflow-hidden transition-all duration-500 ${result ? 'h-48' : 'flex-1'}`}>
                    {mode === 'select' && !image ? (
                        // Selection Screen (Upload or Camera) with Drag & Drop
                        <div
                            className={`w-full h-full flex flex-col items-center justify-center gap-6 p-8 transition-all ${isDragging ? 'bg-nature-500/10 border-2 border-nature-400 border-dashed' : ''
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="text-center mb-4">
                                <ImageIcon className={`w-16 h-16 mx-auto mb-3 transition-all ${isDragging ? 'text-nature-300 scale-110' : 'text-nature-400 opacity-80'
                                    }`} />
                                <h2 className="text-xl font-bold text-white mb-2">
                                    {isDragging ? 'Drop image here' : 'Choose Image Source'}
                                </h2>
                                <p className="text-sm text-gray-400">
                                    {isDragging ? 'Release to upload' : 'Upload, drag & drop, or capture a new photo'}
                                </p>
                            </div>

                            {!isDragging && (
                                <>

                                    {/* Primary: Upload Button */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full max-w-xs px-6 py-4 rounded-2xl bg-gradient-to-r from-nature-600 to-nature-500 text-white font-bold text-lg shadow-lg shadow-nature-500/30 hover:shadow-nature-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
                                    >
                                        <Upload className="w-6 h-6 group-hover:translate-y-[-2px] transition-transform" />
                                        Upload from Gallery
                                    </button>

                                    {/* Secondary: Camera Button */}
                                    <button
                                        onClick={() => {
                                            setMode('camera');
                                            startCamera();
                                        }}
                                        className="w-full max-w-xs px-6 py-4 rounded-2xl border-2 border-nature-500/30 bg-nature-900/40 text-white font-bold text-lg hover:bg-nature-800/60 hover:border-nature-500/50 transition-all flex items-center justify-center gap-3 group"
                                    >
                                        <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        Use Camera
                                    </button>

                                    {/* Hidden file input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </>
                            )}
                        </div>
                    ) : image ? (
                        // Image Preview
                        <div className="relative w-full h-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={image} alt="Selected crop" className="w-full h-full object-cover" />
                        </div>
                    ) : mode === 'camera' ? (
                        // Camera View
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
                    ) : null}
                </div>

                {/* Controls / Result Area */}
                <div className="p-6 bg-nature-900/90 backdrop-blur-md border-t border-nature-700/50">
                    {mode === 'select' && !image ? (
                        // Selection mode - no controls needed
                        <div className="py-4 text-center text-sm text-gray-400">
                            Select an option above to begin
                        </div>
                    ) : mode === 'camera' && !image ? (
                        // Camera mode - show capture button
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={captureImage}
                                className="w-20 h-20 mx-auto rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform active:scale-95 group"
                            >
                                <div className="w-16 h-16 rounded-full bg-white group-active:bg-nature-200 transition-colors" />
                            </button>
                            <Button
                                variant="ghost"
                                className="text-nature-300 hover:text-nature-200"
                                onClick={() => {
                                    stopCamera();
                                    setMode('select');
                                }}
                            >
                                ← Back to options
                            </Button>
                        </div>
                    ) : !result ? (
                        // Image captured/uploaded - show analyze buttons
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
                        // Results Display
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
                                    <FeedbackDialog scanId={Date.now().toString()} prediction={result.disease} />
                                </div>
                                <div className="text-center bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                                    <div className="text-2xl font-bold text-nature-400">{(result.confidence * 100).toFixed(0)}%</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Confidence</div>
                                </div>
                            </div>

                            {/* AI Tutor Layer */}
                            <AIExplanation
                                disease={result.disease}
                                confidence={result.confidence}
                                crop={result.crop}
                            />

                            {/* Action Cards */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-sm text-gray-300 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-nature-500" /> Recommended Actions
                                </h3>

                                {result.recommended_actions?.immediate && result.recommended_actions.immediate.length > 0 && (
                                    <div className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-r-lg">
                                        <p className="text-xs text-red-400 font-bold mb-1 uppercase">Immediate Action</p>
                                        <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
                                            {result.recommended_actions.immediate.map((action, i) => (
                                                <li key={i}>{action}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {result.recommended_actions?.short_term && result.recommended_actions.short_term.length > 0 && (
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
                                    <Clock className="w-3 h-3" /> {result.metadata?.inference_time_ms || 0}ms
                                </span>
                                <span className="flex items-center gap-1">
                                    <Info className="w-3 h-3" /> {result.metadata?.model_version || 'v2.0.0'}
                                </span>
                            </div>

                            <Button onClick={resetScan} className="w-full bg-nature-600 h-12 font-bold hover:bg-nature-500">
                                Scan Another Crop
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden canvas for camera capture */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
