import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testApi() {
  const log = [];
  function addLog(msg) {
    console.log(msg);
    log.push(msg);
  }

  try {
    addLog("=== Starting Integration Test ===");
    
    // 2. Register Creator
    const creatorUser = { name: "Creator Test", username: `creator_${Date.now()}`, email: `creator_${Date.now()}@test.com`, password: "password123", role: "creator" };
    let res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(creatorUser)
    });
    let data = await res.json();
    let creatorToken = data.token || data.data?.token;

    // 5. Creator gets profile
    res = await fetch(`${BASE_URL}/users/me`, { headers: { "Authorization": `Bearer ${creatorToken}` } });
    data = await res.json();
    console.log("Profile Data:", data);

  } catch(e) {
    addLog(`Error: ${e.message}`);
  }
}

testApi();
