interface UnhealthyTrackerProps {
    count: number;
}

export function UnhealthyTracker({ count }: UnhealthyTrackerProps) {
    return (
        <div className="glass rounded-2xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 w-full border-red-500/30">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-red-400">
                <span className="text-xl">⚠️</span> Cheat Items
            </h3>
            <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-white">{count}</span>
                <span className="text-sm text-gray-400 mb-1">items today</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
                Keep it under 3 for a bonus!
            </div>
        </div>
    );
}
