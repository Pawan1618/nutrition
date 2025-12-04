'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BottomNav } from '@/components/BottomNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
    Zap,
    Flame,
    Droplets,
    Plus,
    Check,
    Menu,
    User,
    Home,
    List,
    Activity,
    Loader2,
    X
} from 'lucide-react';
import { addXP, XP_CONSTANTS } from '@/utils/xp';
import { Toast } from '@/components/Toast';

export default function Dashboard() {
    const supabase = createClient();
    const router = useRouter(); // Initialize router
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLoadingUser, setIsLoadingUser] = useState(true); // Add loading state for user check

    // Habit States
    const [showAddHabitModal, setShowAddHabitModal] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setIsLoadingUser(false);
            }
        };
        checkUser();
    }, [router, supabase]);

    // Fetch User Profile (for Goals)
    const { data: profile } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            let { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

            // Handle missing profile (lazy creation)
            if (error && (error.code === 'PGRST116' || error.message.includes('Row not found'))) {
                console.log('Profile not found in dashboard, creating one...');
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        name: user.user_metadata?.full_name || 'User',
                        xp: 0,
                        level: 1,
                        streak: 0
                    })
                    .select()
                    .single();

                if (!createError) {
                    data = newProfile;
                }
            }

            return data;
        }
    });

    // Fetch Logs for Today
    const { data: logs, isLoading } = useQuery({
        queryKey: ['logs', date],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data } = await supabase
                .from('logs')
                .select('*')
                .eq('user_id', user.id)
                .eq('date', date);
            return data || [];
        }
    });

    // Calculate Totals
    const totalCalories = logs?.reduce((sum, log) => sum + log.calories, 0) || 0;
    const totalProtein = logs?.reduce((sum, log) => sum + log.protein, 0) || 0;
    const totalCarbs = logs?.reduce((sum, log) => sum + log.carbs, 0) || 0;
    const totalFats = logs?.reduce((sum, log) => sum + log.fats, 0) || 0;

    // Goals
    const maxCalories = profile?.daily_calorie_goal || 2500;
    // Fetch Water Logs
    const { data: waterLogs, refetch: refetchWater } = useQuery({
        queryKey: ['water_logs', date],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data } = await supabase
                .from('water_logs')
                .select('amount')
                .eq('user_id', user.id)
                .eq('date', date);

            return data || [];
        }
    });

    const water = waterLogs?.reduce((sum, log) => sum + log.amount, 0) || 0;
    const waterGoal = 3000;

    // Fetch Habits
    const { data: habits, refetch: refetchHabits } = useQuery({
        queryKey: ['habits', date],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            // 1. Fetch all habits
            const { data: allHabits } = await supabase
                .from('habits')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (!allHabits || allHabits.length === 0) {
                // Seed default habits if none exist
                const defaultHabits = [
                    { user_id: user.id, name: "Morning Stretch", icon: "Activity" },
                    { user_id: user.id, name: "Take Creatine", icon: "Zap" },
                    { user_id: user.id, name: "Read 10 Pages", icon: "Book" }
                ];
                const { data: insertedHabits } = await supabase
                    .from('habits')
                    .insert(defaultHabits)
                    .select();

                return (insertedHabits || []).map(h => ({ ...h, completed: false, streak: 0 }));
            }

            // 2. Check completion for today
            const { data: logs } = await supabase
                .from('habit_logs')
                .select('habit_id')
                .eq('date', date);

            const completedHabitIds = new Set(logs?.map(l => l.habit_id));

            return allHabits.map(habit => ({
                ...habit,
                completed: completedHabitIds.has(habit.id)
            }));
        }
    });

    const handleAddHabit = async () => {
        if (!newHabitName.trim()) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('habits')
            .insert({
                user_id: user.id,
                name: newHabitName,
                icon: 'Check', // Default icon
                streak: 0
            });

        if (error) {
            console.error('Error adding habit:', error);
            return;
        }

        setNewHabitName('');
        setShowAddHabitModal(false);
        refetchHabits();
        setToastMessage('Habit added!');
        setShowToast(true);
    };

    const toggleHabit = async (habit: any) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (habit.completed) {
            // Uncheck: Remove log, decrease streak
            await supabase.from('habit_logs').delete().match({ habit_id: habit.id, date: date });
            await supabase.from('habits').update({ streak: Math.max(0, habit.streak - 1) }).eq('id', habit.id);
        } else {
            // Check: Add log, increase streak, award XP
            await supabase.from('habit_logs').insert({ habit_id: habit.id, date: date });
            await supabase.from('habits').update({ streak: habit.streak + 1 }).eq('id', habit.id);

            // Award XP
            await addXP(user.id, XP_CONSTANTS.HABIT_COMPLETION);
            setToastMessage(`Habit done! +${XP_CONSTANTS.HABIT_COMPLETION} XP`);
            setShowToast(true);
        }
        refetchHabits();
    };

    const addWater = async (amount: number) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('water_logs')
            .insert({
                user_id: user.id,
                date: date,
                amount: amount
            });

        if (error) {
            console.error('Error adding water:', error);
            setToastMessage('Failed to add water');
            setShowToast(true);
        } else {
            refetchWater();
            setToastMessage(`Added ${amount}ml water`);
            setShowToast(true);
        }
    };

    if (isLoading || isLoadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="animate-spin text-emerald-500" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30 pb-32 relative overflow-hidden transition-colors duration-300">

            {/* Top Bar / HUD */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/70 backdrop-blur-lg border-b border-slate-200 dark:border-white/5 p-4 mb-6">
                <div className="flex justify-between items-center max-w-md mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 flex items-center justify-center font-black text-xl text-emerald-600 dark:text-emerald-400 backdrop-blur-md shadow-inner">
                                {profile?.level || 1}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-widest mb-1">XP Progress</span>
                            <div className="w-24 sm:w-32 h-2 bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    style={{ width: `${Math.min(((profile?.xp || 0) % 100), 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Streak</div>
                            <div className="font-bold text-orange-500 flex items-center justify-end gap-1">
                                <Flame size={16} fill="currentColor" /> {profile?.streak || 0} Days
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <div className="max-w-md mx-auto relative z-10 px-4 space-y-6">

                {/* MAIN STATS CARD */}
                <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
                    {/* Internal glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-20 -mt-20 opacity-20 pointer-events-none bg-emerald-500" />

                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div>
                            <h2 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Daily Target</h2>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-900 dark:text-white">{totalCalories}</span>
                                <span className="text-slate-500 font-medium">/ {maxCalories}</span>
                            </div>
                        </div>
                        <div className="text-right text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 backdrop-blur-sm">
                            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Remaining</div>
                            <div className="text-lg font-bold">{maxCalories - totalCalories} kcal</div>
                        </div>
                    </div>

                    {/* Circular Progress */}
                    <div className="flex justify-center py-4 relative z-10">
                        <div className="relative w-56 h-56 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                <circle
                                    cx="112"
                                    cy="112"
                                    r="90"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-slate-200 dark:text-slate-800"
                                />
                                <motion.circle
                                    cx="112"
                                    cy="112"
                                    r="90"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={2 * Math.PI * 90}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 90 - ((Math.min(totalCalories, maxCalories) / maxCalories) * 2 * Math.PI * 90) }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    strokeLinecap="round"
                                    className="text-emerald-500"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Zap size={32} className="text-emerald-500 mb-2 fill-emerald-500/20" />
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Kcal</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MACROS GRID */}
                <div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 ml-1">Macronutrients</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {/* Protein */}
                        <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                            <div className="text-[10px] font-bold text-blue-500 uppercase mb-1">Protein</div>
                            <div className="font-black text-xl text-slate-900 dark:text-white mb-1">{totalProtein}g</div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                        {/* Carbs */}
                        <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                            <div className="text-[10px] font-bold text-purple-500 uppercase mb-1">Carbs</div>
                            <div className="font-black text-xl text-slate-900 dark:text-white mb-1">{totalCarbs}g</div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 shadow-[0_0_8px_#A855F7]" style={{ width: '50%' }}></div>
                            </div>
                        </div>
                        {/* Fat */}
                        <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                            <div className="text-[10px] font-bold text-yellow-500 uppercase mb-1">Fats</div>
                            <div className="font-black text-xl text-slate-900 dark:text-white mb-1">{totalFats}g</div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 shadow-[0_0_8px_#EAB308]" style={{ width: '40%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* HYDRATION CARD */}
                <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-500 border border-cyan-500/20">
                                <Droplets size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-white">Hydration</div>
                                <div className="text-xs text-slate-500 font-medium">{water} / {waterGoal} ml</div>
                            </div>
                        </div>
                        <div className="text-2xl font-black text-cyan-500">{Math.round((water / waterGoal) * 100)}%</div>
                    </div>

                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative mb-6">
                        <motion.div
                            className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(water / waterGoal) * 100}%` }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => addWater(250)}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 transition-all active:scale-95 font-bold text-sm"
                        >
                            <Plus size={16} /> 250ml
                        </button>
                        <button
                            onClick={() => addWater(500)}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 transition-all active:scale-95 font-bold text-sm"
                        >
                            <Plus size={16} /> 500ml
                        </button>
                    </div>
                </div>

                {/* HABITS */}
                <div className="pb-8">
                    <div className="flex justify-between items-end mb-4 ml-1">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Daily Habits</h3>
                        <button
                            onClick={() => setShowAddHabitModal(true)}
                            className="text-emerald-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:text-emerald-400 transition-colors"
                        >
                            <Plus size={14} /> Add Habit
                        </button>
                    </div>

                    <div className="space-y-3">
                        {habits?.map((habit: any) => (
                            <motion.div
                                key={habit.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleHabit(habit)}
                                className={`
                                    flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300
                                    ${habit.completed
                                        ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                        : 'glass-card hover:bg-white/80 dark:hover:bg-white/10'}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        w-6 h-6 rounded-full flex items-center justify-center border transition-colors
                                        ${habit.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-700'}
                                    `}>
                                        {habit.completed && <Check size={14} className="text-white" />}
                                    </div>
                                    <span className={`font-medium ${habit.completed ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                                        {habit.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold">
                                    <Flame size={14} className={habit.completed ? "text-orange-500 fill-orange-500" : "text-slate-300 dark:text-slate-600"} />
                                    <span className={habit.completed ? "text-orange-500" : "text-slate-400"}>{habit.streak}</span>
                                </div>
                            </motion.div>
                        ))}

                        {/* Add Habit Button (Large) */}
                        <button
                            onClick={() => setShowAddHabitModal(true)}
                            className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-emerald-500 hover:text-emerald-500 transition-all group"
                        >
                            <Plus size={20} className="group-hover:scale-110 transition-transform" />
                            <span>Add New Habit</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Habit Modal */}
            {showAddHabitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/20"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">New Habit</h3>
                            <button onClick={() => setShowAddHabitModal(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider ml-1 mb-1 block">Habit Name</label>
                                <input
                                    type="text"
                                    value={newHabitName}
                                    onChange={(e) => setNewHabitName(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500/50 outline-none transition-all font-medium"
                                    placeholder="e.g., Drink Water"
                                    autoFocus
                                />
                            </div>

                            <button
                                onClick={handleAddHabit}
                                disabled={!newHabitName.trim()}
                                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Habit
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            <BottomNav />
        </div>
    );
}
