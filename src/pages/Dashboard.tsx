import { CloudSun, ScanLine, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { SprayingWidget } from "../components/dashboard/SprayingWidget";
import { CropCalendar } from "../components/dashboard/CropCalendar";
import { OfflineStatus } from "../components/dashboard/OfflineStatus";

export default function Dashboard() {
    return (
        <div className="space-y-6 pb-20">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-farmer-primary tracking-tight">Namaste, Farmer</h1>
                    <div className="flex items-center gap-2 text-farmer-muted font-medium mt-1">
                        <CloudSun className="w-5 h-5 text-farmer-accent" />
                        <span>28°C • Sunny • Jalgaon</span>
                    </div>
                </div>
                <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" />
                </div>
            </div>

            {/* Offline Status */}
            <OfflineStatus />

            {/* Spraying Index (High Priority) */}
            <section>
                <SprayingWidget windSpeed={12} humidity={45} isRaining={false} />
            </section>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
                <Link to="/scan" className="col-span-2">
                    <Button variant="big-action" className="w-full h-24 text-xl flex flex-col gap-1 items-center justify-center shadow-floating">
                        <ScanLine className="w-8 h-8 mb-1" />
                        Scan Crop
                    </Button>
                </Link>

                <div className="p-4 bg-white rounded-2xl shadow-card flex flex-col items-center justify-center gap-2 border border-gray-100 hover:border-farmer-primary/50 transition-colors cursor-pointer text-center">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                        <Sprout className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm text-gray-700">My Crops</span>
                </div>

                <div className="p-4 bg-white rounded-2xl shadow-card flex flex-col items-center justify-center gap-2 border border-gray-100 hover:border-farmer-primary/50 transition-colors cursor-pointer text-center">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                        <CloudSun className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm text-gray-700">Weather</span>
                </div>
            </div>

            {/* Crop Calendar */}
            <section>
                <CropCalendar />
            </section>
        </div>
    );
}
