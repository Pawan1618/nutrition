import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, foodName, calories, protein, carbs, fats, isUnhealthy, quantity } = body;

        // 1. Find or Create Food
        let food = await prisma.food.findFirst({
            where: { name: { equals: foodName } },
        });

        if (!food) {
            food = await prisma.food.create({
                data: {
                    name: foodName,
                    calories: parseInt(calories),
                    protein: parseFloat(protein),
                    carbs: parseFloat(carbs),
                    fats: parseFloat(fats),
                    isUnhealthy: isUnhealthy || false,
                },
            });
        }

        // 2. Get or Create Daily Log for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let dailyLog = await prisma.dailyLog.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today,
                },
            },
        });

        if (!dailyLog) {
            dailyLog = await prisma.dailyLog.create({
                data: {
                    userId,
                    date: today,
                    totalCalories: 0,
                },
            });
        }

        // 3. Create Log Entry
        const entry = await prisma.logEntry.create({
            data: {
                dailyLogId: dailyLog.id,
                foodId: food.id,
                quantity: parseFloat(quantity) || 1,
            },
        });

        // 5. Update User XP (Gamification)
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { xp: { increment: 10 } },
        });

        // Check for Level Up (e.g., every 100 XP)
        const currentLevel = Math.floor(updatedUser.xp / 100) + 1;
        let leveledUp = false;

        if (currentLevel > updatedUser.level) {
            await prisma.user.update({
                where: { id: userId },
                data: { level: currentLevel },
            });
            leveledUp = true;
        }

        return NextResponse.json({ success: true, entry, leveledUp, newLevel: currentLevel });
    } catch (error) {
        console.error('Error logging food:', error);
        return NextResponse.json({ error: 'Error logging food' }, { status: 500 });
    }
}
