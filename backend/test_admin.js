const API_URL = 'http://localhost:5000/api';

async function runTests() {
  try {
    const normalUserEmail = `normal_${Date.now()}@test.com`;
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Normal User',
        username: `normal_${Date.now()}`,
        email: normalUserEmail,
        password: 'password123'
      })
    });
    
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: normalUserEmail,
            password: 'password123'
        })
    });
    const loginData = await loginRes.json();
    console.log('Login data:', loginData);
    // Usually token is in loginData.token or loginData.data.token or cookie
    const token = loginData.token || (loginData.data && loginData.data.token);

    if (!token) {
        console.log('No token found in response. Headers?', loginRes.headers.get('set-cookie'));
        return;
    }

    const normalUserRes = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (normalUserRes.status === 403) {
        console.log('✅ PASS: Normal user request returns 403');
    } else {
        console.error('❌ FAIL: Normal user request returned', normalUserRes.status);
    }
  } catch (error) {
    console.error(error);
  }
}

runTests();
