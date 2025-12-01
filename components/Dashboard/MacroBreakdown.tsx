interface MacroBreakdownProps {
    protein: number;
    carbs: number;
    fats: number;
}

export function MacroBreakdown({ protein, carbs, fats }: MacroBreakdownProps) {
    return (
        <div className="grid grid-cols-3 gap-4 w-full">
            <div className="glass p-4 rounded-2xl text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Protein</div>
                <div className="text-xl font-bold text-blue-400">{protein}g</div>
            </div>
            <div className="glass p-4 rounded-2xl text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Carbs</div>
                <div className="text-xl font-bold text-green-400">{carbs}g</div>
            </div>
            <div className="glass p-4 rounded-2xl text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Fats</div>
                <div className="text-xl font-bold text-purple-400">{fats}g</div>
            </div>
        </div>
    );
}
