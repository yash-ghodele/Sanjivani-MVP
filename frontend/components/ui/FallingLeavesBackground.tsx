"use client";

import { Leaf } from "lucide-react";
import { useEffect, useState } from "react";

export function FallingLeavesBackground() {
    const [leaves, setLeaves] = useState<any[]>([]);

    useEffect(() => {
        // Generate random leaves with higher density for large areas
        const count = 50;
        const newLeaves = Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDuration: `${15 + Math.random() * 15}s`, // Slower, more graceful
            animationDelay: `-${Math.random() * 30}s`, // Negative delay for immediate scattering
            size: 20 + Math.random() * 20, // 20px to 40px
            opacity: 0.1 + Math.random() * 0.3,
            rotation: Math.random() * 360,
        }));
        setLeaves(newLeaves);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {leaves.map((leaf) => (
                <div
                    key={leaf.id}
                    className="absolute animate-fall"
                    style={{
                        left: leaf.left,
                        animationDuration: leaf.animationDuration,
                        animationDelay: leaf.animationDelay,
                    }}
                >
                    <Leaf
                        className="text-[#82ae19]"
                        style={{
                            width: leaf.size,
                            height: leaf.size,
                            opacity: leaf.opacity,
                            transform: `rotate(${leaf.rotation}deg)`,
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
