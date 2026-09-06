async function testApis() {
  const endpoints = [
    '/api/health',
    '/api/conference',
    '/api/dates',
    '/api/tracks',
    '/api/speakers',
    '/api/committee',
    '/api/gallery',
    '/api/registrations/categories'
  ];

  console.log('Testing ICC-CNS 2027 API Endpoints on http://localhost:5000:');
  for (const ep of endpoints) {
    try {
      const res = await fetch(`http://localhost:5000${ep}`);
      const data = await res.json();
      console.log(`[PASS] ${ep} - HTTP ${res.status} - Count/Status: ${Array.isArray(data.data) ? data.data.length + ' items' : data.status || 'OK'}`);
    } catch (err) {
      console.error(`[FAIL] ${ep} - Error:`, err.message);
    }
  }

  // Test paper status tracking
  try {
    const trackRes = await fetch('http://localhost:5000/api/submissions/track/ICC-2027-104');
    const trackData = await trackRes.json();
    console.log(`[PASS] GET /api/submissions/track/ICC-2027-104 - Found: "${trackData.data?.title}" Status: ${trackData.data?.status}`);
  } catch (err) {
    console.error('[FAIL] GET /api/submissions/track/ICC-2027-104:', err.message);
  }

  // Test Admin Login
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@icccns.org', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    console.log(`[PASS] POST /api/auth/login - Admin Token Issued: ${!!loginData.token}`);
  } catch (err) {
    console.error('[FAIL] POST /api/auth/login:', err.message);
  }

  // Test Frontend Dev Server
  try {
    const frontRes = await fetch('http://localhost:5173/');
    console.log(`[PASS] Frontend Vite Dev Server - HTTP ${frontRes.status}`);
  } catch (err) {
    console.error('[FAIL] Frontend Vite Server:', err.message);
  }
}

testApis();
