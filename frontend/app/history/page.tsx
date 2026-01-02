'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Leaf, TrendingUp, Download, Trash2, Search } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

interface ScanRecord {
    id: string;
    imageUrl: string;
    crop: string;
    disease: string;
    severity: string;
    confidence: number;
    timestamp: number;
    location?: string;
    metadata: {
        inference_time_ms: number;
        model_version: string;
    };
}

export default function HistoryPage() {
    const [scans, setScans] = useState<ScanRecord[]>([]);
    const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSeverity, setFilterSeverity] = useState<string>('all');

    useEffect(() => {
        // Load scan history from localStorage
        loadScanHistory();
    }, []);

    const loadScanHistory = () => {
        try {
            const history = localStorage.getItem('scan_history');
            if (history) {
                const parsed = JSON.parse(history);
                // Normalize confidence values (fix legacy data that might be stored as percentages)
                const normalized = parsed.map((scan: ScanRecord) => ({
                    ...scan,
                    confidence: scan.confidence > 1 ? scan.confidence / 100 : scan.confidence
                }));
                setScans(normalized.sort((a: ScanRecord, b: ScanRecord) => b.timestamp - a.timestamp));
                // Save normalized data back
                localStorage.setItem('scan_history', JSON.stringify(normalized));
            }
        } catch (error) {
            console.error('Failed to load scan history:', error);
        }
    };

    const deleteScan = (id: string) => {
        const updated = scans.filter(scan => scan.id !== id);
        setScans(updated);
        localStorage.setItem('scan_history', JSON.stringify(updated));
        if (selectedScan?.id === id) {
            setSelectedScan(null);
        }
    };

    const exportData = () => {
        const dataStr = JSON.stringify(scans, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sanjivani_scan_history_${Date.now()}.json`;
        link.click();
    };

    const filteredScans = scans.filter(scan => {
        const matchesSearch = scan.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scan.crop.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSeverity = filterSeverity === 'all' || scan.severity.toLowerCase() === filterSeverity.toLowerCase();
        return matchesSearch && matchesSeverity;
    });

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical':
            case 'high':
                return 'text-red-400 bg-red-500/10 border-red-500/30';
            case 'moderate':
                return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
            default:
                return 'text-nature-400 bg-nature-500/10 border-nature-500/30';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <h1 className="text-lg font-bold">Scan History</h1>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white"
                    onClick={exportData}
                    disabled={scans.length === 0}
                >
                    <Download className="w-5 h-5" />
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="glass-card p-4 rounded-2xl border border-nature-800 text-center">
                    <div className="text-2xl font-bold text-white">{scans.length}</div>
                    <div className="text-xs text-gray-400 mt-1">Total Scans</div>
                </div>
                <div className="glass-card p-4 rounded-2xl border border-nature-800 text-center">
                    <div className="text-2xl font-bold text-nature-400">
                        {scans.filter(s => s.severity.toLowerCase() === 'critical' || s.severity.toLowerCase() === 'high').length}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Critical</div>
                </div>
                <div className="glass-card p-4 rounded-2xl border border-nature-800 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                        {scans.length > 0 ? Math.round(scans.reduce((acc, s) => acc + s.confidence, 0) / scans.length * 100) : 0}%
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Avg Confidence</div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by crop or disease..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-nature-500/50"
                    />
                </div>
                <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nature-500/50"
                >
                    <option value="all">All</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="moderate">Moderate</option>
                    <option value="low">Low</option>
                    <option value="none">Healthy</option>
                </select>
            </div>

            {/* Scan List */}
            {filteredScans.length === 0 ? (
                <div className="text-center py-20">
                    <Leaf className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400 mb-2">
                        {scans.length === 0 ? 'No scans yet' : 'No scans match your filters'}
                    </p>
                    <Link href="/scan">
                        <Button className="mt-4 bg-nature-600 hover:bg-nature-500">
                            Start Your First Scan
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredScans.map((scan) => (
                        <div
                            key={scan.id}
                            className="glass-card p-4 rounded-2xl border border-white/5 hover:border-nature-500/30 transition-all cursor-pointer"
                            onClick={() => setSelectedScan(scan)}
                        >
                            <div className="flex gap-4">
                                {/* Thumbnail */}
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-nature-950/50 flex-shrink-0">
                                    {scan.imageUrl ? (
                                        <img
                                            src={scan.imageUrl}
                                            alt="Scan"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Leaf className="w-8 h-8 text-nature-500/30" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div>
                                            <h3 className="font-bold text-white truncate">{scan.disease}</h3>
                                            <p className="text-sm text-gray-400">{scan.crop}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getSeverityColor(scan.severity)}`}>
                                            {scan.severity}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(scan.timestamp).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {Math.round(scan.confidence * 100)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteScan(scan.id);
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedScan && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedScan(null)}
                >
                    <div
                        className="bg-dark-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-nature-500/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image */}
                        <div className="relative h-64 bg-black">
                            {selectedScan.imageUrl ? (
                                <img
                                    src={selectedScan.imageUrl}
                                    alt="Scan detail"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Leaf className="w-20 h-20 text-nature-500/30" />
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="p-6 space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-nature-500/20 text-nature-300 border border-nature-500/30 uppercase">
                                        {selectedScan.crop}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold border uppercase ${getSeverityColor(selectedScan.severity)}`}>
                                        {selectedScan.severity}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white">{selectedScan.disease}</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="text-sm text-gray-400 mb-1">Confidence</div>
                                    <div className="text-2xl font-bold text-nature-400">
                                        {Math.round(selectedScan.confidence * 100)}%
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="text-sm text-gray-400 mb-1">Inference Time</div>
                                    <div className="text-2xl font-bold text-blue-400">
                                        {selectedScan.metadata?.inference_time_ms || 0}ms
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Scan Date</span>
                                    <span className="text-white">{new Date(selectedScan.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Model Version</span>
                                    <span className="text-white">{selectedScan.metadata?.model_version || 'v2.0.0'}</span>
                                </div>
                                {selectedScan.location && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Location</span>
                                        <span className="text-white">{selectedScan.location}</span>
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={() => setSelectedScan(null)}
                                className="w-full bg-nature-600 hover:bg-nature-500 h-12 font-bold"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
