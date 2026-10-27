const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('imovies_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  },

  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  // Movies
  async getMovies(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/movies${query ? `?${query}` : ''}`);
    return await res.json();
  },

  async getMovieById(id) {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    return await res.json();
  },

  async createMovie(data) {
    const res = await fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Showtimes
  async getShowtimes(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/showtimes${query ? `?${query}` : ''}`);
    return await res.json();
  },

  async getShowtimeById(id) {
    const res = await fetch(`${API_BASE}/showtimes/${id}`);
    return await res.json();
  },

  async lockSeats(showtimeId, seats) {
    const res = await fetch(`${API_BASE}/showtimes/${showtimeId}/lock-seats`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ seats })
    });
    return await res.json();
  },

  async releaseSeats(showtimeId, seats) {
    const res = await fetch(`${API_BASE}/showtimes/${showtimeId}/release-seats`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ seats })
    });
    return await res.json();
  },

  async createShowtime(data) {
    const res = await fetch(`${API_BASE}/showtimes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Bookings
  async createBooking(bookingData) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    return await res.json();
  },

  async getUserBookings() {
    const res = await fetch(`${API_BASE}/bookings/my-bookings`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async getBookingById(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async cancelBooking(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async getAdminBookings() {
    const res = await fetch(`${API_BASE}/admin/bookings`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  }
};
