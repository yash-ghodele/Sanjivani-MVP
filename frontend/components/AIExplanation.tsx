"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AIExplanationProps {
    disease: string;
    confidence: number;
    crop: string;
}

export function AIExplanation({ disease, confidence, crop }: AIExplanationProps) {
    const { user } = useAuth();
    const [explanation, setExplanation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExplain = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = user ? await user.getIdToken() : null;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v2/chat/explain`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                    disease,
                    confidence,
                    crop
                })
            });

            if (!response.ok) throw new Error("Failed to get explanation");

            const data = await response.json();
            setExplanation(data.explanation);
        } catch (err) {
            console.error(err);
            setError("The AI Tutor is currently unavailable. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    if (explanation) {
        return (
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h3 className="font-bold text-indigo-100">AI Tutor Explanation</h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm">
                    {explanation}
                </p>
                <div className="mt-4 flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-400 hover:text-indigo-300 text-xs"
                        onClick={() => setExplanation(null)}
                    >
                        Close
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4">
            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <Button
                onClick={handleExplain}
                disabled={isLoading}
                className="w-full bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 dashed-border shadow-none"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Consulting AI Tutor...
                    </>
                ) : (
                    <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Explain "Why this diagnosis?"
                    </>
                )}
            </Button>
            <p className="text-center text-xs text-gray-500 mt-2">
                Powered by Gemini 1.5 Flash • Does not provide medical advice
            </p>
        </div>
    );
}
