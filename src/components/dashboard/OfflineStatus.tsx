import { WifiOff, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import { scanQueue } from "../../lib/scanQueue"

export function OfflineStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [queueCount, setQueueCount] = useState(0)

    useEffect(() => {
        // Update online status
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Update queue count
        const updateQueueCount = async () => {
            try {
                const count = await scanQueue.getQueueCount()
                setQueueCount(count)
            } catch (error) {
                console.error('Failed to get queue count:', error)
            }
        }

        updateQueueCount()

        // Listen for sync events
        const handleSyncStatus = () => updateQueueCount()
        window.addEventListener('scan-synced', handleSyncStatus)

        // Poll queue count every 30 seconds
        const interval = setInterval(updateQueueCount, 30000)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
            window.removeEventListener('scan-synced', handleSyncStatus)
            clearInterval(interval)
        }
    }, [])

    if (isOnline && queueCount === 0) {
        return null // Don't show anything when online with no queue
    }

    return (
        <div className={`rounded-xl p-4 ${isOnline ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
            <div className="flex items-center gap-3">
                {isOnline ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                    <WifiOff className="w-5 h-5 text-orange-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                    <p className={`font-bold text-sm ${isOnline ? 'text-green-800' : 'text-orange-800'}`}>
                        {isOnline ? 'Connected' : 'Offline Mode'}
                    </p>
                    {queueCount > 0 && (
                        <p className="text-xs text-gray-600 mt-0.5">
                            {queueCount} scan{queueCount > 1 ? 's' : ''} queued
                            {isOnline && ' • Syncing...'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
