'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Settings,
    LogOut,
    ChevronRight,
    Target,
    X,
    Save,
    Loader2,
    MessageSquare
} from 'lucide-react';
import { FeedbackModal } from '@/components/FeedbackModal';
import { BottomNav } from '@/components/BottomNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client';

export default function Profile() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    // Edit State
    const [editForm, setEditForm] = useState({
        name: '',
        age: '',
        weight: '',
        height: '',
        goal_weight: '',
        daily_calorie_goal: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            let { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            // Handle missing profile (lazy creation)
            if (error && (error.code === 'PGRST116' || error.message.includes('Row not found'))) {
                console.log('Profile not found, creating one...');
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

                if (createError) throw createError;
                data = newProfile;
                error = null;
            }

            if (error) throw error;

            setProfile(data);
            setEditForm({
                name: data.name || '',
                age: data.age?.toString() || '',
                weight: data.weight?.toString() || '',
                height: data.height?.toString() || '',
                goal_weight: data.goal_weight?.toString() || '',
                daily_calorie_goal: data.daily_calorie_goal?.toString() || '2500'
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Helper to safely parse numbers
            const parseNum = (val: string) => {
                if (!val || val.trim() === '') return null;
                const num = parseFloat(val);
                return isNaN(num) ? null : num;
            };

            const updates = {
                name: editForm.name,
                age: parseNum(editForm.age),
                weight: parseNum(editForm.weight),
                height: parseNum(editForm.height),
                goal_weight: parseNum(editForm.goal_weight),
                daily_calorie_goal: parseNum(editForm.daily_calorie_goal) || 2500
            };

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            // Update Weight History if changed
            if (updates.weight && updates.weight !== profile?.weight) {
                const { error: historyError } = await supabase
                    .from('weight_history')
                    .insert({
                        user_id: user.id,
                        weight: updates.weight,
                        date: new Date().toISOString().split('T')[0]
                    });

                if (historyError) {
                    console.error('Error updating weight history:', historyError);
                    // Don't throw here, as profile update was successful
                }
            }

            setIsSettingsOpen(false);
            fetchProfile(); // Refresh data
        } catch (error: any) {
            console.error('Error updating profile:', error);
            alert(`Failed to update profile: ${error.message || JSON.stringify(error)}`);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="animate-spin text-emerald-500" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30 pb-32 relative overflow-hidden transition-colors duration-300">

            <div className="max-w-md mx-auto relative z-10 px-6 pt-8 space-y-6">

                {/* HEADER */}
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Profile</h1>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-white/10 transition-all backdrop-blur-md"
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                {/* AGENT PROFILE CARD */}
                <div className="glass-card p-8 rounded-[2.5rem] text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/10 to-transparent -z-10" />

                    <div className="w-28 h-28 mx-auto bg-slate-100 dark:bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center mb-6 shadow-2xl relative">
                        <User size={48} className="text-slate-400" />
                        <div className="absolute bottom-0 right-0 bg-emerald-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full border border-white dark:border-black shadow-lg">Lvl 1</div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                        {profile?.name || 'User'}
                    </h2>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-widest">Nutrition Explorer</p>

                    <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-white/10">
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                            <div className="text-2xl font-black text-slate-900 dark:text-white">
                                {profile?.weight || '--'}<span className="text-xs text-slate-500 font-normal ml-1">kg</span>
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Current</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                            <div className="text-2xl font-black text-emerald-500">
                                {profile?.goal_weight || '--'}<span className="text-xs text-slate-500 font-normal ml-1">kg</span>
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Goal</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                            <div className="text-2xl font-black text-blue-500">
                                {profile?.age || '--'}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Age</div>
                        </div>
                    </div>
                </div>

                {/* ACTION BUTTON */}
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-full glass-card p-6 rounded-3xl flex justify-between items-center hover:scale-[1.02] transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
                            <Target size={24} />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-slate-900 dark:text-white">Update Biometrics</div>
                            <div className="text-xs text-slate-500">Weight, Height, Age</div>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>

                {/* CALORIC PARAMETERS */}
                <div className="glass-card p-6 rounded-3xl">
                    <h4 className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-4 ml-1">Caloric Parameters</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5">
                            <span className="text-slate-500 dark:text-slate-400">Daily Calorie Goal</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">{profile?.daily_calorie_goal || 2500} kcal</span>
                        </div>
                    </div>
                </div>

                {/* FEEDBACK BUTTON */}
                <button
                    onClick={() => setIsFeedbackOpen(true)}
                    className="w-full flex items-center justify-between p-4 glass-card rounded-3xl hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 transition-colors group cursor-pointer mb-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            <MessageSquare size={20} />
                        </div>
                        <span className="font-medium text-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Give Feedback</span>
                    </div>
                </button>

                {/* SIGN OUT */}
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-between p-4 glass-card rounded-3xl hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-colors group cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 group-hover:text-red-600 dark:group-hover:text-red-400"><LogOut size={20} /></div>
                        <span className="font-medium text-red-500 group-hover:text-red-600 dark:group-hover:text-red-400">Sign Out</span>
                    </div>
                </button>

            </div>

            {/* SETTINGS MODAL */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-white/10 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Edit Profile</h2>
                            <button onClick={() => setIsSettingsOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                <X size={24} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Age</label>
                                    <input
                                        type="number"
                                        value={editForm.age}
                                        onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Height (cm)</label>
                                    <input
                                        type="number"
                                        value={editForm.height}
                                        onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={editForm.weight}
                                        onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Goal (kg)</label>
                                    <input
                                        type="number"
                                        value={editForm.goal_weight}
                                        onChange={(e) => setEditForm({ ...editForm, goal_weight: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Daily Calorie Goal</label>
                                <input
                                    type="number"
                                    value={editForm.daily_calorie_goal}
                                    onChange={(e) => setEditForm({ ...editForm, daily_calorie_goal: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <button
                                onClick={handleUpdateProfile}
                                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg shadow-lg shadow-emerald-500/20 mt-4 flex items-center justify-center gap-2"
                            >
                                <Save size={20} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />

            <BottomNav />
        </div>
    );
}
