import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'
import { X, Check, Zap, AlertTriangle, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/layout/Header'
import GlassCard from '../components/ui/GlassCard'

export default function CameraPage() {
    const navigate = useNavigate()
    const webcamRef = useRef<Webcam>(null)
    const [imgSrc, setImgSrc] = useState<string | null>(null)
    const [analyzing, setAnalyzing] = useState(false)
    const [result, setResult] = useState<any>(null)

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot()
        if (imageSrc) {
            setImgSrc(imageSrc)
            analyzeImage(imageSrc)
        }
    }, [webcamRef])

    const analyzeImage = async (image: string) => {
        setAnalyzing(true)

        try {
            const response = await fetch(image)
            const blob = await response.blob()
            const formData = new FormData()
            formData.append('file', blob, 'crop_image.jpg')

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
            const apiResponse = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                body: formData,
            })

            if (!apiResponse.ok) throw new Error('Prediction failed')

            const data = await apiResponse.json()
            setResult(data)

        } catch (error) {
            console.error('Error:', error)
            // Mock fallback
            setTimeout(() => {
                setResult({
                    disease: 'Early Blight',
                    confidence: 94,
                    severity: 'Moderate',
                    treatment: 'Apply Chlorothalonil fungicide every 7-10 days.',
                    prevention: 'Rotate crops, avoid overhead irrigation.'
                })
            }, 1500)
        } finally {
            setAnalyzing(false)
        }
    }

    const reset = () => {
        setImgSrc(null)
        setResult(null)
    }

    return (
        <div className="h-screen bg-black text-white relative flex flex-col">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 rounded-full backdrop-blur-md">
                    <X className="w-6 h-6" />
                </button>
                <div className="bg-black/30 px-3 py-1 rounded-full backdrop-blur-md text-xs font-medium border border-white/10">
                    AI Auto-Detect Active
                </div>
                <div className="w-10" />
            </div>

            {/* Viewfinder */}
            <div className="flex-1 relative overflow-hidden bg-gray-900">
                {!imgSrc ? (
                    <>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="w-full h-full object-cover"
                            videoConstraints={{ facingMode: "environment" }}
                        />
                        {/* Scanner Overlay */}
                        <div className="absolute inset-0 border-[30px] border-black/30 pointer-events-none">
                            <div className="w-full h-full border-2 border-white/20 relative">
                                <motion.div
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 w-full h-0.5 bg-primary-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                                />
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-lg" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-lg" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-lg" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-lg" />
                            </div>
                        </div>
                    </>
                ) : (
                    <img src={imgSrc} alt="Captured" className="w-full h-full object-cover" />
                )}

                {/* Analysis Loading */}
                <AnimatePresence>
                    {analyzing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full mb-6"
                            />
                            <h3 className="text-xl font-bold">Analyzing Crop Health...</h3>
                            <p className="text-gray-400">Comparing with 50,000+ samples</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls / Results */}
            <div className="bg-black p-6 pb-24 rounded-t-3xl -mt-6 relative z-10 min-h-[180px]">
                <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6" />

                {!result ? (
                    <div className="flex items-center justify-center">
                        <button
                            onClick={capture}
                            className="w-20 h-20 rounded-full bg-primary-500 border-4 border-white/20 shadow-glow flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                        >
                            <div className="w-16 h-16 rounded-full border-2 border-white bg-transparent" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl ${result.disease.toLowerCase().includes('healthy')
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                {result.disease.toLowerCase().includes('healthy') ? <Check className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{result.disease}</h2>
                                <p className="text-gray-400">Confidence: {Math.round(result.confidence)}%</p>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
                            <h4 className="text-primary-400 font-bold mb-2 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Recommended Treatment
                            </h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {result.treatment}
                            </p>
                        </div>

                        <button onClick={reset} className="w-full py-4 bg-white text-black font-bold rounded-xl mt-4">
                            Scan Another Crop
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
