// Test script without external dependencies

const API_URL = 'http://127.0.0.1:5001/api';

async function testRating() {
  try {
    // Let's first register users
    const user1Id = Date.now().toString();
    const user2Id = (Date.now() + 1).toString();
    const user3Id = (Date.now() + 2).toString();

    const registerUser = async (uId) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `User ${uId}`,
          username: `user_${uId}`,
          email: `user_${uId}@test.com`,
          password: 'password123'
        })
      });
      const data = await res.json();
      return data.data.token;
    };

    const token1 = await registerUser(user1Id);
    const token2 = await registerUser(user2Id);
    const token3 = await registerUser(user3Id);

    console.log('Users created successfully');

    // Get an existing artwork to test on
    const artworksRes = await fetch(`${API_URL}/artworks?limit=1`);
    const artworksData = await artworksRes.json();
    
    if (!artworksData.data || artworksData.data.length === 0) {
      console.log('No artworks found in DB to test on. Please create one first.');
      return;
    }

    const artworkId = artworksData.data[0]._id;
    console.log(`Using existing artwork: ${artworkId}`);

    // Rate artwork with User 2 (rating: 5)
    let res = await fetch(`${API_URL}/artworks/${artworkId}/rating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token2}` },
      body: JSON.stringify({ rating: 5 })
    });
    console.log('✅ User 2 rated artwork 5. Status:', res.status);

    // Fetch artwork
    res = await fetch(`${API_URL}/artworks/${artworkId}`);
    let artData = await res.json();
    console.log(`Rating: ${artData.data.ratingAverage} (${artData.data.ratingCount} ratings)`);

    // Change rating to 3
    res = await fetch(`${API_URL}/artworks/${artworkId}/rating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token2}` },
      body: JSON.stringify({ rating: 3 })
    });
    console.log('✅ User 2 changed rating to 3. Status:', res.status);

    res = await fetch(`${API_URL}/artworks/${artworkId}`);
    artData = await res.json();
    console.log(`Rating: ${artData.data.ratingAverage} (${artData.data.ratingCount} ratings)`);

    // User 3 rates artwork 4
    res = await fetch(`${API_URL}/artworks/${artworkId}/rating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token3}` },
      body: JSON.stringify({ rating: 4 })
    });
    console.log('✅ User 3 rated artwork 4. Status:', res.status);

    res = await fetch(`${API_URL}/artworks/${artworkId}`);
    artData = await res.json();
    console.log(`Rating: ${artData.data.ratingAverage} (${artData.data.ratingCount} ratings)`);

    // User 2 gets their rating
    res = await fetch(`${API_URL}/artworks/${artworkId}/rating`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token2}` }
    });
    const ratingInfo = await res.json();
    console.log(`✅ User 2 Rating Info: userRating=${ratingInfo.data.userRating}, average=${ratingInfo.data.ratingAverage}`);

    // Invalid rating (6)
    res = await fetch(`${API_URL}/artworks/${artworkId}/rating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token3}` },
      body: JSON.stringify({ rating: 6 })
    });
    console.log(`✅ Test Invalid Rating (6). Status: ${res.status}`);

    console.log('Done!');
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.cause) console.error(error.cause);
  }
}

testRating();
