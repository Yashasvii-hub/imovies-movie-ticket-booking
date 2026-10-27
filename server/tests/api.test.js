const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../server');
const memoryStore = require('../config/memoryStore');

let server;
let baseUrl;
let userToken = '';
let adminToken = '';
let testShowtimeId = '';
let testBookingId = '';

const request = async (path, options = {}) => {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json();
  return { status: response.status, data };
};

describe('🎬 IMovies API Automated Test Suite', () => {
  before(async () => {
    await memoryStore.init();
    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        console.log(`[Test Runner] Test server active on ${baseUrl}`);
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
  });

  test('TC01: Health check endpoint returns status ok', async () => {
    const res = await request('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'ok');
  });

  test('TC02: User registration succeeds with valid data', async () => {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Automated Tester',
        email: `tester_${Date.now()}@example.com`,
        password: 'Password123!',
        phone: '+91 9999988888'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.token);
    assert.strictEqual(res.data.user.role, 'user');
    userToken = res.data.token;
  });

  test('TC03: Duplicate registration rejected with 400', async () => {
    const email = 'user@imovies.com'; // Already in seed
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Duplicate Guy',
        email,
        password: 'Password123!'
      }
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  test('TC04: Admin login succeeds with valid seed credentials', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@imovies.com',
        password: 'AdminPass123!'
      }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.user.role, 'admin');
    assert.ok(res.data.token);
    adminToken = res.data.token;
  });

  test('TC05: Login with invalid password returns 401', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@imovies.com',
        password: 'WrongPassword'
      }
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
  });

  test('TC06: Current user profile retrievable via JWT token', async () => {
    const res = await request('/api/auth/me', { token: userToken });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.user.email);
  });

  test('TC07: Movies listing returns active movies', async () => {
    const res = await request('/api/movies');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.data.length >= 3);
  });

  test('TC08: Movie search and filtering functions accurately', async () => {
    const res = await request('/api/movies?search=Oppenheimer');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data[0].title, 'Oppenheimer');
  });

  test('TC09: Get single movie details by ID', async () => {
    const listRes = await request('/api/movies');
    const firstMovieId = listRes.data.data[0]._id;
    const res = await request(`/api/movies/${firstMovieId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data._id, firstMovieId);
  });

  test('TC10: Fetch showtimes for available movies', async () => {
    const res = await request('/api/showtimes');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.length > 0);
    testShowtimeId = res.data.data[0]._id;
  });

  test('TC11: Seat lock mechanism temporarily holds selected seats', async () => {
    const res = await request(`/api/showtimes/${testShowtimeId}/lock-seats`, {
      method: 'POST',
      token: userToken,
      body: { seats: ['E1', 'E2'] }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
  });

  test('TC12: Prevent booking collision on already locked/booked seats', async () => {
    // Attempt to book pre-booked seat 'A3'
    const res = await request(`/api/showtimes/${testShowtimeId}/lock-seats`, {
      method: 'POST',
      token: userToken,
      body: { seats: ['A3'] }
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  test('TC13: Complete booking with simulated payment', async () => {
    const res = await request('/api/bookings', {
      method: 'POST',
      token: userToken,
      body: {
        showtimeId: testShowtimeId,
        seats: [
          { seatNumber: 'E1', tier: 'Premium', price: 350 },
          { seatNumber: 'E2', tier: 'Premium', price: 350 }
        ],
        paymentMethod: 'upi'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.bookingReference);
    assert.strictEqual(res.data.data.bookingStatus, 'confirmed');
    assert.strictEqual(res.data.data.paymentDetails.status, 'success');
    testBookingId = res.data.data._id;
  });

  test('TC14: User booking history contains the confirmed ticket', async () => {
    const res = await request('/api/bookings/my-bookings', { token: userToken });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.some(b => b._id === testBookingId));
  });

  test('TC15: User can cancel booking and release reserved seats', async () => {
    const res = await request(`/api/bookings/${testBookingId}/cancel`, {
      method: 'PUT',
      token: userToken
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.bookingStatus, 'cancelled');
  });

  test('TC16: Admin dashboard statistics accessible by authorized admin', async () => {
    const res = await request('/api/admin/stats', { token: adminToken });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.totalMovies >= 3);
  });

  test('TC17: Admin dashboard rejects non-admin users with 403 Forbidden', async () => {
    const res = await request('/api/admin/stats', { token: userToken });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.data.success, false);
  });
});
