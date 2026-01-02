"use client";

import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Loader2, Leaf, Info } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

interface Crop {
    id: string;
    name: string;
    status: 'stable' | 'beta' | 'planned';
    description: string;
}

export function SupportedCrops() {
    const { hasMounted } = useAuth();
    const [crops, setCrops] = useState<Crop[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!hasMounted) return;
        const fetchCrops = async () => {
            try {
                // Use env var or default to localhost
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/v2/meta/crops`);
                if (!res.ok) throw new Error("Failed to fetch crops");
                const data = await res.json();
                setCrops(Array.isArray(data.crops) ? data.crops : []);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCrops();
    }, []);

    if (!hasMounted) return null;

    if (isLoading) {
        return <div className="flex items-center gap-2 text-sm text-gray-400"><Loader2 className="w-4 h-4 animate-spin" /> Loading supported crops...</div>;
    }

    if (error) {
        return <div className="text-sm text-red-400">Unable to load crop registry.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {crops.map((crop) => (
                <div key={crop.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-nature-500/20 flex items-center justify-center">
                                <Leaf className="w-4 h-4 text-nature-400" />
                            </div>
                            <h4 className="font-bold text-white">{crop.name}</h4>
                        </div>
                        <Badge variant={crop.status === 'stable' ? 'default' : 'secondary'} className={`capitalize ${crop.status === 'stable' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                            crop.status === 'beta' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' :
                                'bg-gray-500/20 text-gray-400'
                            }`}>
                            {crop.status}
                        </Badge>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">
                        {crop.description}
                    </p>
                </div>
            ))}

            {/* Call to action for more */}
            <div className="p-4 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center">
                <p className="text-xs text-gray-500 mb-2">More crops coming soon</p>
                <Badge variant="outline" className="text-xs text-gray-500 border-gray-700">Request Crop</Badge>
            </div>
        </div>
    );
}
