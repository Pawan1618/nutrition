
async function testUserCreation() {
    console.log('--- Testing User Creation API ---');

    // Test 1: Missing required fields
    console.log('\nTest 1: Missing required fields (should fail)');
    try {
        const res = await fetch('http://localhost:3000/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Incomplete User'
                // Missing age, weight, etc.
            })
        });
        console.log(`Status: ${res.status}`);
        if (res.status === 400) {
            console.log('PASS: Correctly rejected missing fields');
        } else {
            console.log('FAIL: Did not reject missing fields properly');
        }
    } catch (e) {
        console.error('Error:', e.message);
    }

    // Test 2: Invalid numeric fields
    console.log('\nTest 2: Invalid numeric fields (should fail)');
    try {
        const res = await fetch('http://localhost:3000/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Invalid User',
                age: 'not-a-number',
                sex: 'male',
                weight: 'heavy',
                height: 180,
                goalType: 'maintain',
                dailyCalorieGoal: 2000
            })
        });
        console.log(`Status: ${res.status}`);
        if (res.status === 400) {
            console.log('PASS: Correctly rejected invalid numbers');
        } else {
            console.log('FAIL: Did not reject invalid numbers properly');
        }
    } catch (e) {
        console.error('Error:', e.message);
    }

    // Test 3: Valid user
    console.log('\nTest 3: Valid user (should succeed)');
    try {
        const res = await fetch('http://localhost:3000/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Valid User',
                age: 25,
                sex: 'female',
                weight: 60,
                height: 165,
                goalType: 'maintain',
                dailyCalorieGoal: 2000
            })
        });
        console.log(`Status: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            console.log('PASS: User created successfully', data.id);
        } else {
            console.log('FAIL: Failed to create valid user');
            console.log(await res.text());
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

testUserCreation();
