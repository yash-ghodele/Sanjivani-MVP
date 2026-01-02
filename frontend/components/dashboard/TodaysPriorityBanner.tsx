'use client';

import { AlertCircle, Calendar, TrendingUp } from 'lucide-react';

interface Task {
    priority: 'critical' | 'high' | 'medium' | 'low';
    text: string;
    icon?: React.ReactNode;
}

interface TodaysPriorityBannerProps {
    tasks: Task[];
}

export function TodaysPriorityBanner({ tasks }: TodaysPriorityBannerProps) {
    if (tasks.length === 0) {
        return (
            <div className="bg-gradient-to-r from-nature-900/30 to-nature-800/20 border-l-4 border-nature-500 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-nature-500/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-nature-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">All Clear!</h2>
                        <p className="text-gray-400">No urgent tasks for today. Your farm is looking healthy.</p>
                    </div>
                </div>
            </div>
        );
    }

    const topTask = tasks[0];
    const bgColor = {
        critical: 'from-red-900/30 to-red-800/20 border-red-500',
        high: 'from-yellow-900/30 to-yellow-800/20 border-yellow-500',
        medium: 'from-blue-900/30 to-blue-800/20 border-blue-500',
        low: 'from-nature-900/30 to-nature-800/20 border-nature-500'
    };

    const iconColor = {
        critical: 'bg-red-500/20 text-red-400',
        high: 'bg-yellow-500/20 text-yellow-400',
        medium: 'bg-blue-500/20 text-blue-400',
        low: 'bg-nature-500/20 text-nature-400'
    };

    return (
        <div className={`bg-gradient-to-r ${bgColor[topTask.priority]} border-l-4 rounded-2xl p-6 mb-6`}>
            <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl ${iconColor[topTask.priority]} flex items-center justify-center flex-shrink-0`}>
                    {topTask.icon || <AlertCircle className="w-7 h-7" />}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs uppercase tracking-wider font-bold text-gray-400">
                            {topTask.priority} Priority
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">Today</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{topTask.text}</h2>
                    {tasks.length > 1 && (
                        <p className="text-sm text-gray-400">
                            +{tasks.length - 1} more task{tasks.length > 2 ? 's' : ''} pending
                        </p>
                    )}
                </div>
            </div>

            {/* Additional Tasks */}
            {tasks.length > 1 && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                    {tasks.slice(1, 3).map((task, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-white/30" />
                            <span className="text-gray-300">{task.text}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
