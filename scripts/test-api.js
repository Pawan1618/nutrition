// Node 18+ has fetch built-in
// Actually Node 18+ has fetch.

async function test() {
    try {
        console.log('Creating user...');
        const res = await fetch('http://localhost:3000/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                age: 30,
                sex: 'male',
                weight: 80,
                height: 180,
                goalType: 'loss',
                dailyCalorieGoal: 1800
            })
        });

        if (!res.ok) {
            console.error('Failed to create user:', res.status, await res.text());
            return;
        }

        const user = await res.json();
        console.log('User created:', user);

        console.log('Fetching stats...');
        const statsRes = await fetch(`http://localhost:3000/api/stats?userId=${user.id}`);
        if (!statsRes.ok) {
            console.error('Failed to fetch stats:', statsRes.status, await statsRes.text());
            return;
        }

        const stats = await statsRes.json();
        console.log('Stats fetched:', stats);

    } catch (error) {
        console.error('Error:', error);
    }
}

test();
