import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, age, sex, weight, height, goalType, dailyCalorieGoal } = body;

        // Validation
        if (!name || !age || !sex || !weight || !height || !goalType || !dailyCalorieGoal) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const parsedAge = parseInt(age);
        const parsedWeight = parseFloat(weight);
        const parsedHeight = parseFloat(height);
        const parsedGoal = parseInt(dailyCalorieGoal);

        if (isNaN(parsedAge) || isNaN(parsedWeight) || isNaN(parsedHeight) || isNaN(parsedGoal)) {
            return NextResponse.json({ error: 'Invalid numeric values' }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                name,
                age: parsedAge,
                sex,
                weight: parsedWeight,
                height: parsedHeight,
                goalType,
                dailyCalorieGoal: parsedGoal,
            },
        });

        // Initialize weight history
        await prisma.weightHistory.create({
            data: {
                userId: user.id,
                weight: parsedWeight,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        // @ts-ignore
        return NextResponse.json({ error: `Error creating user: ${error.message || error}` }, { status: 500 });
    }
}

export async function GET(request: Request) {
    // For simplicity in this MVP, we might just get the first user or pass an ID
    // In a real app, we'd use auth. Here we'll just fetch the first user found.
    try {
        const user = await prisma.user.findFirst({
            include: {
                dailyLogs: {
                    orderBy: { date: 'desc' },
                    take: 1,
                },
            },
        });
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, weight, ...otherData } = body;

        const user = await prisma.user.update({
            where: { id },
            data: {
                ...otherData,
                weight: weight ? parseFloat(weight) : undefined,
            },
        });

        if (weight) {
            await prisma.weightHistory.create({
                data: {
                    userId: id,
                    weight: parseFloat(weight),
                },
            });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
    }
}
