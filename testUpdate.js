const axios = require('axios');

async function testUpdate() {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:4000/api/accounts/authenticate', {
            email: 'kent@email.com',
            password: 'password'
        });
        const jwt = loginRes.data.jwtToken;

        console.log('Updating user 2...');
        const updateRes = await axios.put('http://localhost:4000/api/accounts/2', {
            role: 'Teacher'
        }, {
            headers: { Authorization: `Bearer ${jwt}` }
        });

        console.log('Update success:', updateRes.status, updateRes.data);
    } catch (e) {
        console.error('Update failed:', e.response?.status, e.response?.data || e.message);
    }
}
testUpdate();
