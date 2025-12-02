
async function testUserCreationV2() {
    console.log('--- Testing User Creation API V2 (String Inputs) ---');

    // Test 1: Valid user with string inputs (mimicking frontend)
    console.log('\nTest 1: Valid user with string inputs');
    try {
        const res = await fetch('http://localhost:3000/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Frontend User',
                age: '28',
                sex: 'female',
                weight: '65.5',
                height: '170',
                goalType: 'loss',
                dailyCalorieGoal: '1800'
            })
        });

        console.log(`Status: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            console.log('PASS: User created successfully', data.id);
        } else {
            console.log('FAIL: Failed to create user');
            console.log(await res.text());
        }
    } catch (e) {
        console.error('Error:', e.message);
    }

    // Test 2: Invalid string inputs (non-numeric strings)
    console.log('\nTest 2: Invalid string inputs');
    try {
        const res = await fetch('http://localhost:3000/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Invalid Input User',
                age: 'twenty',
                sex: 'male',
                weight: 'heavy',
                height: 'tall',
                goalType: 'maintain',
                dailyCalorieGoal: 'lots'
            })
        });
        console.log(`Status: ${res.status}`);
        if (res.status === 400) {
            console.log('PASS: Correctly rejected invalid strings');
        } else {
            console.log('FAIL: Did not reject invalid strings properly');
            console.log(await res.text());
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

testUserCreationV2();
