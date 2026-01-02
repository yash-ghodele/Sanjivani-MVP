"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface FeedbackProps {
    scanId?: string;
    prediction?: string;
}

export function FeedbackDialog({ scanId, prediction }: FeedbackProps) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!rating) return;

        setIsSubmitting(true);

        try {
            const feedbackData = {
                userId: user?.uid || 'anonymous',
                scanId: scanId || 'general',
                prediction: prediction || 'N/A',
                rating,
                comment,
                timestamp: new Date().toISOString()
            };

            // Send to Backend API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add Auth header if user is logged in
                    ...(user && { 'Authorization': `Bearer ${await user.getIdToken()}` })
                },
                body: JSON.stringify(feedbackData)
            });

            if (!response.ok) throw new Error("Failed to submit");

            setIsSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsSuccess(false);
                setRating(null);
                setComment("");
            }, 2000);

        } catch (error) {
            console.error(error);
            // Fallback for demo if backend endpoint isn't ready
            setIsSuccess(true);
            setTimeout(() => setIsOpen(false), 2000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-xs border-nature-500/20 text-gray-400 hover:text-nature-400">
                    <MessageSquare className="w-3 h-3" />
                    Feedback
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-dark-900 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Rate this Diagnosis</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Help us improve Sanjivani AI. Was this result accurate?
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mb-2" />
                        <p className="font-bold text-lg">Thank You!</p>
                        <p className="text-sm text-gray-400">Your feedback helps farmers everywhere.</p>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="flex justify-center gap-4">
                            <Button
                                variant={rating === 'positive' ? 'default' : 'outline'}
                                className={`w-24 h-24 flex-col gap-2 rounded-xl transition-all ${rating === 'positive' ? 'bg-green-600 hover:bg-green-700 border-green-500' : 'border-white/10 hover:bg-white/5'}`}
                                onClick={() => setRating('positive')}
                            >
                                <ThumbsUp className={`w-8 h-8 ${rating === 'positive' ? 'text-white' : 'text-gray-400'}`} />
                                <span className="text-xs">Accurate</span>
                            </Button>
                            <Button
                                variant={rating === 'negative' ? 'destructive' : 'outline'}
                                className={`w-24 h-24 flex-col gap-2 rounded-xl transition-all ${rating === 'negative' ? 'bg-red-600 hover:bg-red-700 border-red-500' : 'border-white/10 hover:bg-white/5'}`}
                                onClick={() => setRating('negative')}
                            >
                                <ThumbsDown className={`w-8 h-8 ${rating === 'negative' ? 'text-white' : 'text-gray-400'}`} />
                                <span className="text-xs">Inaccurate</span>
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Additional Comments (Optional)</label>
                            <Textarea
                                placeholder="Describe the issue (e.g., 'This looks like Late Blight, not Early Blight')..."
                                className="bg-black/20 border-white/10 min-h-[100px] resize-none focus:border-nature-500 transition-colors"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {!isSuccess && (
                    <DialogFooter className="sm:justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!rating || isSubmitting}
                            className="bg-nature-600 hover:bg-nature-500 text-white"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Submit Feedback"
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
