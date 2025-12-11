// Simple backend test script
// Run: node backend/test-backend.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testBackend() {
    console.log('🚀 Testing MentorConnect Backend...\n');

    try {
        // 1. Test health endpoint
        console.log('1. Testing health endpoint...');
        const health = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health check:', health.data);

        // 2. Test registration
        console.log('\n2. Testing student registration...');
        const studentData = {
            name: 'Test Student',
            email: `student${Date.now()}@test.com`,
            password: 'password123',
            role: 'student'
        };

        const registerRes = await axios.post(`${BASE_URL}/auth/register`, studentData);
        console.log('✅ Student registered:', registerRes.data.data.name);
        const token = registerRes.data.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        // 3. Test XP award
        console.log('\n3. Testing XP award...');
        const xpRes = await axios.post(`${BASE_URL}/gamification/award-xp`,
            { amount: 50 },
            { headers }
        );
        console.log('✅ XP awarded:', xpRes.data.gamification);

        // 4. Test mentor registration
        console.log('\n4. Testing mentor registration...');
        const mentorData = {
            name: 'Test Mentor',
            email: `mentor${Date.now()}@test.com`,
            password: 'password123',
            role: 'mentor',
            domain: 'Web Development',
            experience: 5,
            bio: 'Experienced web developer'
        };

        const mentorRes = await axios.post(`${BASE_URL}/auth/register`, mentorData);
        console.log('✅ Mentor registered:', mentorRes.data.data.name);

        // 5. Test get mentors (restricted)
        console.log('\n5. Testing get mentors (student view)...');
        const mentorsRes = await axios.get(`${BASE_URL}/mentors`, { headers });
        console.log('✅ Mentors returned:', mentorsRes.data.count);

        console.log('\n🎉 All backend tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testBackend();
