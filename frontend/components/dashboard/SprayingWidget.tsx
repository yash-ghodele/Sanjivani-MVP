import { Wind, Droplets, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SprayingWidgetProps {
    windSpeed: number; // km/h
    humidity: number; // %
    isRaining: boolean;
    isLoading?: boolean;
}

export function SprayingWidget({ windSpeed, humidity, isRaining, isLoading }: SprayingWidgetProps) {
    if (isLoading) {
        return (
            <div className="glass-card p-6 rounded-3xl h-full flex items-center justify-center min-h-[200px]">
                <Loader2 className="w-8 h-8 text-nature-500 animate-spin" />
            </div>
        );
    }

    const isUnsafe = isRaining || windSpeed > 15 || humidity < 30;

    return (
        <div className={cn(
            "glass-card p-6 rounded-3xl relative overflow-hidden transition-all h-full",
            isUnsafe ? "border-red-500/30 bg-red-500/5" : "border-nature-500/30 bg-nature-500/5"
        )}>
            <div className="flex justify-between items-start z-10 relative h-full flex-col">
                <div className="w-full">
                    <h3 className={cn(
                        "font-medium flex items-center gap-2 mb-1",
                        isUnsafe ? "text-red-300" : "text-nature-300"
                    )}>
                        Spraying Advisory
                    </h3>

                    <div className="mt-4">
                        <div className="flex items-center gap-3">
                            {isUnsafe ? (
                                <ThumbsDown className="h-6 w-6 text-red-400" />
                            ) : (
                                <ThumbsUp className="h-6 w-6 text-nature-400" />
                            )}
                            <span className={cn(
                                "text-3xl font-display font-bold",
                                isUnsafe ? "text-red-400" : "text-nature-400"
                            )}>
                                {isUnsafe ? "NOT SAFE" : "OPTIMAL"}
                            </span>
                        </div>
                        <p className="text-sm text-white/70 mt-2 max-w-[200px] leading-relaxed">
                            {isUnsafe
                                ? isRaining ? "Rain detected. Spray will wash off." : "High winds/low humidity."
                                : "Perfect conditions for absorption."}
                        </p>
                    </div>
                </div>

                <div className="space-y-2 text-right w-full mt-4">
                    <div className="flex items-center justify-end gap-2 text-sm font-medium text-gray-300">
                        <Wind className="h-4 w-4 text-nature-400" />
                        {windSpeed} km/h
                    </div>
                    <div className="flex items-center justify-end gap-2 text-sm font-medium text-gray-300">
                        <Droplets className="h-4 w-4 text-nature-400" />
                        {humidity}%
                    </div>
                </div>
            </div>
        </div>
    );
}
