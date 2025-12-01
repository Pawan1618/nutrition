interface HeatmapProps {
    data: { date: string; totalCalories: number }[];
}

export function DietHeatmap({ data }: HeatmapProps) {
    // Generate last 30 days
    const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return d.toISOString().split('T')[0];
    });

    const getIntensity = (dateStr: string) => {
        const log = data.find(d => new Date(d.date).toISOString().split('T')[0] === dateStr);
        if (!log) return 'bg-white/5';
        if (log.totalCalories > 2500) return 'bg-green-500'; // High activity
        if (log.totalCalories > 1500) return 'bg-green-500/60';
        return 'bg-green-500/30';
    };

    return (
        <div className="glass rounded-2xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 w-full">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">📅</span> Consistency
            </h3>
            <div className="flex gap-1 justify-between">
                {days.map((date) => (
                    <div
                        key={date}
                        className={`w-full aspect-square rounded-sm ${getIntensity(date)} transition-all hover:scale-125`}
                        title={date}
                    />
                ))}
            </div>
        </div>
    );
}
