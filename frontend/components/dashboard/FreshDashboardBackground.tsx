"use client";

export function FreshDashboardBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Subtle Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0b0a] via-[#0f110f] to-[#0a0b0a]" />

            {/* Organic Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2382ae19' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Radial Gradient Spotlights */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-nature-600/3 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/3 rounded-full blur-3xl" />

            {/* Vignette Effect */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,11,10,0.4) 100%)'
                }}
            />
        </div>
    );
}
