'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CalorieRing } from '@/components/Dashboard/CalorieRing';
import { MacroBreakdown } from '@/components/Dashboard/MacroBreakdown';
import { DietHeatmap } from '@/components/Dashboard/DietHeatmap';
import { UnhealthyTracker } from '@/components/Dashboard/UnhealthyTracker';
import { Button } from '@/components/ui/Button';
import { Plus, Flame } from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch User for goals
                // In a real app, this would be optimized or context
                // For now we assume we might need to fetch user details separately or pass them
                // But let's just fetch stats which should ideally return goal info too, or we fetch user
                // Let's fetch user first to get goals
                // Actually, let's just fetch stats and maybe update API to return goals if needed
                // Or just fetch user here too.

                // Fetch Stats
                const statsRes = await fetch(`/api/stats?userId=${userId}`);
                const statsData = await statsRes.json();
                setStats(statsData);

                // Fetch User (for name and goals)
                // We can't easily get user by ID with the current GET /api/user which returns first user
                // Let's assume for MVP we just use the stats and maybe hardcode goal or fetch it properly if we updated API
                // Let's update API later if needed. For now, let's assume 2000 goal if not found.

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

    const dailyGoal = 2000; // TODO: Fetch from user profile
    const currentCalories = stats?.today?.calories || 0;

    return (
        <main className="min-h-screen p-6 pb-24">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Today's Progress</h1>
                    <p className="text-gray-400 text-sm">Keep up the good work!</p>
                </div>
                <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                    <span className="font-bold">5 Days</span>
                </div>
            </header>

            {/* Main Stats */}
            <div className="flex flex-col items-center mb-8">
                <CalorieRing current={currentCalories} target={dailyGoal} />

                <div className="mt-8 w-full">
                    <MacroBreakdown
                        protein={stats?.today?.protein || 0}
                        carbs={stats?.today?.carbs || 0}
                        fats={stats?.today?.fats || 0}
                    />
                </div>
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 gap-6 mb-24">
                <UnhealthyTracker count={stats?.today?.unhealthyCount || 0} />
                <DietHeatmap data={stats?.heatmap || []} />
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
                <Link href="/log" className="pointer-events-auto">
                    <Button size="lg" className="bg-green-500 text-black shadow-green-500/20 shadow-2xl">
                        <Plus className="w-6 h-6 mr-2" /> Log Food
                    </Button>
                </Link>
            </div>
        </main>
    );
}
