'use client';
import React, { useState } from 'react';
import { TrendingUp, Calendar, Activity, Droplets, Zap } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar
} from 'recharts';

export default function Progress() {
    const supabase = createClient();
    const [date] = useState(new Date());

    // Fetch Weight History
    const { data: weightData } = useQuery({
        queryKey: ['weight_history'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data } = await supabase
                .from('weight_history')
                .select('date, weight')
                .eq('user_id', user.id)
                .order('date', { ascending: true })
                .limit(30);

            return data?.map(d => ({
                date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                weight: d.weight
            })) || [];
        }
    });

    // Fetch Calorie & Macro History
    const { data: calorieData } = useQuery({
        queryKey: ['calorie_history'],
        gcTime: 0,
        staleTime: 0,
        refetchOnMount: 'always',
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            // Get last 7 days INCLUDING today
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 6); // 6 days ago + today = 7 days total

            const { data } = await supabase
                .from('logs')
                .select('date, calories, protein, carbs, fats')
                .eq('user_id', user.id)
                .gte('date', startDate.toISOString().split('T')[0])
                .lte('date', endDate.toISOString().split('T')[0])
                .order('date', { ascending: true });

            // Aggregate by date
            const agg: Record<string, { calories: number, protein: number, carbs: number, fats: number }> = {};
            data?.forEach(log => {
                if (!agg[log.date]) {
                    agg[log.date] = { calories: 0, protein: 0, carbs: 0, fats: 0 };
                }
                agg[log.date].calories += log.calories || 0;
                agg[log.date].protein += log.protein || 0;
                agg[log.date].carbs += log.carbs || 0;
                agg[log.date].fats += log.fats || 0;
            });

            console.log('📈 Aggregated by date:', agg);

            // Fill missing days (7 days total)
            const result = [];
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                const dayData = agg[dateStr] || { calories: 0, protein: 0, carbs: 0, fats: 0 };
                result.push({
                    date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                    calories: Number(dayData.calories) || 0,
                    protein: Number(dayData.protein) || 0,
                    carbs: Number(dayData.carbs) || 0,
                    fats: Number(dayData.fats) || 0,
                    goal: 2500 // TODO: Fetch from profile
                });
            }
            return result;
        }
    });

    // Fetch Water History
    const { data: waterData } = useQuery({
        queryKey: ['water_history'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            // Get last 7 days INCLUDING today
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 6); // 6 days ago + today = 7 days total

            const { data } = await supabase
                .from('water_logs')
                .select('date, amount')
                .eq('user_id', user.id)
                .gte('date', startDate.toISOString().split('T')[0])
                .order('date', { ascending: true });

            // Aggregate
            const agg: Record<string, number> = {};
            data?.forEach(log => {
                agg[log.date] = (agg[log.date] || 0) + log.amount;
            });

            const result = [];
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                result.push({
                    date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                    amount: agg[dateStr] || 0
                });
            }
            return result;
        }
    });

    // Fetch Consistency (Dates with logs)
    const { data: consistencyData } = useQuery({
        queryKey: ['consistency'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return new Set();

            const { data } = await supabase
                .from('logs')
                .select('date')
                .eq('user_id', user.id);

            return new Set(data?.map(d => d.date));
        }
    });

    const avgCalories = Math.round((calorieData?.reduce((sum, d) => sum + d.calories, 0) ?? 0) / (calorieData?.length || 1));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30 pb-32 relative overflow-hidden transition-colors duration-300">

            <div className="max-w-md mx-auto relative z-10 px-6 pt-12">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Your Journey</h2>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Progress</h1>
                    </div>
                    <ThemeToggle />
                </header>

                {/* CALORIE TREND */}
                <div className="glass-card p-6 rounded-[2rem] shadow-2xl mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <div className="p-1.5 bg-orange-500/10 rounded-lg"><Zap size={18} className="text-orange-500" /></div>
                            Calorie Trend
                        </h3>
                    </div>
                    <div className="h-64 w-full">
                        {calorieData && calorieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" key={JSON.stringify(calorieData)}>
                                <LineChart data={calorieData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length > 0) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div style={{
                                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                        borderRadius: '12px',
                                                        padding: '12px',
                                                        color: '#fff'
                                                    }}>
                                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{data.date}</p>
                                                        <p style={{ margin: '4px 0 0 0', color: '#f97316' }}>Calories: {data.calories} kcal</p>
                                                        <p style={{ margin: '4px 0 0 0', color: '#94a3b8' }}>Goal: {data.goal} kcal</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="calories"
                                        stroke="#f97316"
                                        strokeWidth={3}
                                        name="Calories"
                                        isAnimationActive={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="goal"
                                        stroke="#94a3b8"
                                        strokeWidth={1}
                                        strokeDasharray="5 5"
                                        name="Goal"
                                        isAnimationActive={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">No calorie data yet</div>
                        )}
                    </div>
                </div>

                {/* MACRONUTRIENT TREND */}
                <div className="glass-card p-6 rounded-[2rem] shadow-2xl mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <div className="p-1.5 bg-blue-500/10 rounded-lg"><Activity size={18} className="text-blue-500" /></div>
                            Macronutrient Trend
                        </h3>
                    </div>
                    <div className="h-64 w-full">
                        {calorieData && calorieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={calorieData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length > 0) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div style={{
                                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                        borderRadius: '12px',
                                                        padding: '12px',
                                                        color: '#fff'
                                                    }}>
                                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{data.date}</p>
                                                        <p style={{ margin: '4px 0 0 0', color: '#3b82f6' }}>Protein: {data.protein}g</p>
                                                        <p style={{ margin: '4px 0 0 0', color: '#a855f7' }}>Carbs: {data.carbs}g</p>
                                                        <p style={{ margin: '4px 0 0 0', color: '#eab308' }}>Fats: {data.fats}g</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Line type="monotone" dataKey="protein" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} name="Protein (g)" />
                                    <Line type="monotone" dataKey="carbs" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7', strokeWidth: 0 }} activeDot={{ r: 6 }} name="Carbs (g)" />
                                    <Line type="monotone" dataKey="fats" stroke="#eab308" strokeWidth={3} dot={{ r: 4, fill: '#eab308', strokeWidth: 0 }} activeDot={{ r: 6 }} name="Fats (g)" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">No macro data yet</div>
                        )}
                    </div>
                </div>

                {/* WEIGHT TREND (Area Chart) */}
                <div className="glass-card p-6 rounded-[2rem] shadow-2xl mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-500/10 rounded-lg"><Activity size={18} className="text-emerald-500" /></div>
                            Weight Trend
                        </h3>
                    </div>
                    <div className="h-48 w-full">
                        {weightData && weightData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weightData}>
                                    <defs>
                                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: 'none', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">No weight data yet</div>
                        )}
                    </div>
                </div>

                {/* HYDRATION (Bar Chart) */}
                <div className="glass-card p-6 rounded-[2rem] shadow-2xl mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <div className="p-1.5 bg-cyan-500/10 rounded-lg"><Droplets size={18} className="text-cyan-500" /></div>
                            Hydration (Last 7 Days)
                        </h3>
                    </div>
                    <div className="h-48 w-full">
                        {waterData && waterData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={waterData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: 'none', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="amount" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">No hydration data yet</div>
                        )}
                    </div>
                </div>

                {/* CONSISTENCY GRID */}
                <div className="glass-card p-6 rounded-[2rem] shadow-2xl mb-8">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                        <div className="p-1.5 bg-blue-500/10 rounded-lg"><Calendar size={18} className="text-blue-500" /></div>
                        Consistency Grid
                    </h3>
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 28 }).map((_, i) => {
                            const d = new Date();
                            d.setDate(d.getDate() - (27 - i));
                            const dateStr = d.toISOString().split('T')[0];
                            const hasLog = consistencyData?.has(dateStr);

                            return (
                                <div
                                    key={i}
                                    title={dateStr}
                                    className={`aspect-square rounded-lg transition-all hover:scale-110 cursor-pointer shadow-sm ${hasLog ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-slate-200 dark:bg-white/5'}`}
                                />
                            )
                        })}
                    </div>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="glass-card p-5 rounded-3xl shadow-lg hover:scale-[1.02] transition-transform">
                        <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest mb-2 font-bold">Avg Calories</div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{avgCalories}</div>
                        <div className="text-xs text-emerald-500 font-bold mt-1 flex items-center gap-1">
                            <TrendingUp size={12} /> Last 7 Days
                        </div>
                    </div>
                    <div className="glass-card p-5 rounded-3xl shadow-lg hover:scale-[1.02] transition-transform">
                        <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest mb-2 font-bold">Workouts</div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">--</div>
                        <div className="text-xs text-slate-500 font-bold mt-1">Coming Soon</div>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
