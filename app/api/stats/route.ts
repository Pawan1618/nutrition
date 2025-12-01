import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Get Today's Log
        const dailyLog = await prisma.dailyLog.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today,
                },
            },
            include: {
                entries: {
                    include: { food: true },
                },
            },
        });

        // 2. Calculate Macros
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFats = 0;
        let unhealthyCount = 0;

        if (dailyLog) {
            dailyLog.entries.forEach((entry: any) => {
                const q = entry.quantity;
                totalProtein += entry.food.protein * q;
                totalCarbs += entry.food.carbs * q;
                totalFats += entry.food.fats * q;
                if (entry.food.isUnhealthy) unhealthyCount++;
            });
        }

        // 3. Get Heatmap Data (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const pastLogs = await prisma.dailyLog.findMany({
            where: {
                userId,
                date: { gte: thirtyDaysAgo },
            },
            select: {
                date: true,
                totalCalories: true,
            },
        });

        return NextResponse.json({
            today: {
                calories: dailyLog?.totalCalories || 0,
                protein: Math.round(totalProtein),
                carbs: Math.round(totalCarbs),
                fats: Math.round(totalFats),
                unhealthyCount,
            },
            heatmap: pastLogs,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 });
    }
}
