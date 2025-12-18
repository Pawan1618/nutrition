'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Plus,
    ScanLine,
    Loader2
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BottomNav } from '@/components/BottomNav';
import { createClient } from '@/utils/supabase/client';
import { addXP, XP_CONSTANTS } from '@/utils/xp';
import { Toast } from '@/components/Toast';

export default function LogFood() {
    const router = useRouter();
    const supabase = createClient();

    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fats, setFats] = useState('');
    const [isCheatMeal, setIsCheatMeal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleSubmit = async () => {
        if (!foodName || !calories) return;

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            const { error } = await supabase.from('logs').insert({
                user_id: user.id,
                name: foodName,
                calories: parseInt(calories),
                protein: parseInt(protein) || 0,
                carbs: parseInt(carbs) || 0,
                fats: parseInt(fats) || 0,
                is_cheat_meal: isCheatMeal,
                date: new Date().toISOString().split('T')[0]
            });

            if (error) throw error;

            // Award XP
            const { error: xpError } = await addXP(user.id, XP_CONSTANTS.LOG_FOOD);
            if (xpError) console.error('Error adding XP:', xpError);

            // Show Toast and Redirect
            setToastMessage(`Food logged! +${XP_CONSTANTS.LOG_FOOD} XP`);
            setShowToast(true);

            // Wait for toast before redirecting (optional, or redirect immediately)
            setTimeout(() => {
                router.push('/dashboard');
                router.refresh();
            }, 2000);

        } catch (error) {
            console.error('Error logging food:', error);
            alert('Failed to log food. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30 pb-32 relative overflow-hidden transition-colors duration-300">

            <div className="max-w-md mx-auto relative z-10 px-6 pt-8 space-y-6">

                {/* HEADER */}
                <header className="flex justify-between items-center mb-6">
                    <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-400">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Log Meal</h1>
                    <ThemeToggle />
                </header>

                {/* AI SCANNER BUTTON */}
                <button className="w-full glass-card p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 group hover:scale-[1.02] transition-all relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
                        <ScanLine size={32} className="text-white" />
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-slate-900 dark:text-white text-lg">AI Auto-Scan</div>
                        <div className="text-xs text-slate-500 font-medium">Snap a photo to log instantly</div>
                    </div>
                </button>

                <div className="flex items-center gap-4 py-2">
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or Manual Entry</span>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                </div>

                {/* MANUAL FORM */}
                <div className="glass-card p-6 rounded-[2rem] space-y-5">

                    {/* Food Name */}
                    <div>
                        <label className="text-xs text-slate-500 font-bold uppercase tracking-wider ml-1 mb-1 block">Food Name</label>
                        <input
                            type="text"
                            value={foodName}
                            onChange={(e) => setFoodName(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 py-4 px-4 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500/50 focus:bg-white dark:focus:bg-black/50 outline-none transition-all placeholder:text-slate-400 font-medium"
                            placeholder="e.g., Grilled Chicken Salad"
                        />
                    </div>

                    {/* Calories */}
                    <div>
                        <label className="text-xs text-slate-500 font-bold uppercase tracking-wider ml-1 mb-1 block">Calories</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 py-4 px-4 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500/50 focus:bg-white dark:focus:bg-black/50 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="0"
                            />
                            <span className="absolute right-4 top-4 text-slate-400 font-bold text-sm">kcal</span>
                        </div>
                    </div>

                    {/* Macros Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-[10px] text-blue-500 font-bold uppercase tracking-wider ml-1 mb-1 block">Protein</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={protein}
                                    onChange={(e) => setProtein(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 py-3 px-3 rounded-xl text-slate-900 dark:text-white focus:border-blue-500/50 outline-none transition-all text-center font-bold"
                                    placeholder="0"
                                />
                                <span className="absolute right-2 top-3.5 text-slate-400 text-[10px]">g</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] text-purple-500 font-bold uppercase tracking-wider ml-1 mb-1 block">Carbs</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={carbs}
                                    onChange={(e) => setCarbs(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 py-3 px-3 rounded-xl text-slate-900 dark:text-white focus:border-purple-500/50 outline-none transition-all text-center font-bold"
                                    placeholder="0"
                                />
                                <span className="absolute right-2 top-3.5 text-slate-400 text-[10px]">g</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider ml-1 mb-1 block">Fats</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={fats}
                                    onChange={(e) => setFats(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 py-3 px-3 rounded-xl text-slate-900 dark:text-white focus:border-yellow-500/50 outline-none transition-all text-center font-bold"
                                    placeholder="0"
                                />
                                <span className="absolute right-2 top-3.5 text-slate-400 text-[10px]">g</span>
                            </div>
                        </div>
                    </div>

                    {/* Cheat Meal Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isCheatMeal ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'} transition-colors`}>
                                <Plus size={16} className={isCheatMeal ? "rotate-45 transition-transform" : ""} />
                            </div>
                            <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Flag as Cheat Meal</span>
                        </div>
                        <button
                            onClick={() => setIsCheatMeal(!isCheatMeal)}
                            className={`w-12 h-7 rounded-full transition-colors relative ${isCheatMeal ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${isCheatMeal ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Log Entry <Plus size={20} /></>}
                    </button>

                </div>

            </div>

            <BottomNav />

            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
