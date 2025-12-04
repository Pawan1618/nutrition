const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testNewFeatures() {
    console.log('Starting New Features Test...');

    try {
        // 1. Create a test user
        const user = await prisma.user.create({
            data: {
                name: 'Test User Features',
                age: 30,
                sex: 'male',
                weight: 80,
                height: 180,
                goalType: 'lose_weight',
                dailyCalorieGoal: 2000,
            },
        });
        console.log('Created test user:', user.id);

        // 2. Test Water Logging
        console.log('\nTesting Water Logging...');
        const waterRes = await fetch('http://localhost:3000/api/water', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, amount: 500 }),
        });
        const waterData = await waterRes.json();
        console.log('Water Log Response:', waterRes.status, waterData);

        if (waterRes.status === 200 && waterData.amount === 500) {
            console.log('PASS: Water logged successfully');
        } else {
            console.error('FAIL: Water logging failed');
        }

        // 3. Test Habit Fetching (Should seed defaults)
        console.log('\nTesting Habit Fetching...');
        const habitsRes = await fetch(`http://localhost:3000/api/habit?userId=${user.id}`);
        const habitsData = await habitsRes.json();
        console.log('Habits Fetch Response:', habitsRes.status, habitsData.length, 'habits found');

        if (habitsRes.status === 200 && habitsData.length === 3) {
            console.log('PASS: Default habits seeded and fetched');
        } else {
            console.error('FAIL: Habit fetching failed');
        }

        // 4. Test Habit Toggling
        if (habitsData.length > 0) {
            const habitId = habitsData[0].id;
            console.log(`\nToggling habit: ${habitId}`);

            // Toggle ON
            const toggleRes1 = await fetch('http://localhost:3000/api/habit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, habitId }),
            });
            const toggleData1 = await toggleRes1.json();
            console.log('Toggle ON Response:', toggleData1);

            if (toggleData1.completed === true) {
                console.log('PASS: Habit toggled ON');
            } else {
                console.error('FAIL: Habit toggle ON failed');
            }

            // Toggle OFF
            const toggleRes2 = await fetch('http://localhost:3000/api/habit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, habitId }),
            });
            const toggleData2 = await toggleRes2.json();
            console.log('Toggle OFF Response:', toggleData2);

            if (toggleData2.completed === false) {
                console.log('PASS: Habit toggled OFF');
            } else {
                console.error('FAIL: Habit toggle OFF failed');
            }
        }

        // Cleanup
        await prisma.waterLog.deleteMany({ where: { userId: user.id } });
        await prisma.habitLog.deleteMany({ where: { habit: { userId: user.id } } });
        await prisma.habit.deleteMany({ where: { userId: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
        console.log('\nCleanup complete');

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testNewFeatures();
