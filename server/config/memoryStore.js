const bcrypt = require('bcryptjs');

/**
 * High-fidelity in-memory storage fallback.
 * Ensures that if MongoDB Atlas is not yet configured or during offline testing/demos,
 * all endpoints (auth, movies, showtimes, seat lock, payment simulation, bookings, admin)
 * function seamlessly without server crashes.
 */
class MemoryStore {
  constructor() {
    this.users = [];
    this.movies = [];
    this.theaters = [];
    this.showtimes = [];
    this.bookings = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    // Seed default admin and user
    const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10);
    const userPasswordHash = await bcrypt.hash('UserPass123!', 10);

    const adminUser = {
      _id: '66a100000000000000000001',
      name: 'Yashasvi Admin',
      email: 'admin@imovies.com',
      password: adminPasswordHash,
      role: 'admin',
      phone: '+91 9876543210',
      createdAt: new Date()
    };

    const demoUser = {
      _id: '66a100000000000000000002',
      name: 'Yashasvi Goswami',
      email: 'user@imovies.com',
      password: userPasswordHash,
      role: 'user',
      phone: '+91 9876543211',
      createdAt: new Date()
    };

    this.users.push(adminUser, demoUser);

    // Seed sample movies with realistic rich cinema data
    this.movies = [
      {
        _id: '66a200000000000000000001',
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
        genre: ['Biography', 'Drama', 'History'],
        language: 'English',
        duration: 180,
        releaseDate: new Date('2024-07-21'),
        rating: 8.9,
        posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
        director: 'Christopher Nolan',
        cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
        isActive: true,
        createdAt: new Date()
      },
      {
        _id: '66a200000000000000000002',
        title: 'Interstellar',
        description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.',
        genre: ['Adventure', 'Drama', 'Sci-Fi'],
        language: 'English',
        duration: 169,
        releaseDate: new Date('2024-11-07'),
        rating: 8.7,
        posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        director: 'Christopher Nolan',
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
        isActive: true,
        createdAt: new Date()
      },
      {
        _id: '66a200000000000000000003',
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        language: 'English',
        duration: 166,
        releaseDate: new Date('2024-03-01'),
        rating: 8.8,
        posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
        director: 'Denis Villeneuve',
        cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler'],
        isActive: true,
        createdAt: new Date()
      },
      {
        _id: '66a200000000000000000004',
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        language: 'English',
        duration: 148,
        releaseDate: new Date('2023-07-16'),
        rating: 8.8,
        posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
        isActive: true,
        createdAt: new Date()
      },
      {
        _id: '66a200000000000000000005',
        title: 'Spider-Man: Across the Spider-Verse',
        description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
        genre: ['Animation', 'Action', 'Adventure'],
        language: 'English',
        duration: 140,
        releaseDate: new Date('2024-06-02'),
        rating: 8.6,
        posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
        director: 'Joaquim Dos Santos',
        cast: ['Shameik Moore', 'Hailee Steinfeld', 'Brian Tyree Henry', 'Oscar Isaac'],
        isActive: true,
        createdAt: new Date()
      }
    ];

    // Seed Theaters
    this.theaters = [
      {
        _id: '66a300000000000000000001',
        name: 'IMovies Cineplex Grand Central',
        location: 'Downtown Boulevard, Sector 18',
        city: 'Metropolis',
        screens: [
          {
            screenNumber: 1,
            screenName: 'Screen 1 (IMAX Laser)',
            soundSystem: 'Dolby Atmos 7.1',
            totalSeats: 60,
            seatLayout: {
              rows: ['A', 'B', 'C', 'D', 'E', 'F'],
              seatsPerRow: 10,
              tiers: [
                { name: 'Standard', rows: ['A', 'B', 'C'], basePrice: 250 },
                { name: 'Premium', rows: ['D', 'E'], basePrice: 350 },
                { name: 'VIP Recliner', rows: ['F'], basePrice: 500 }
              ]
            }
          }
        ],
        createdAt: new Date()
      },
      {
        _id: '66a300000000000000000002',
        name: 'IMovies Royale Multiplex',
        location: 'Westgate Mall, Galleria Road',
        city: 'Metropolis',
        screens: [
          {
            screenNumber: 1,
            screenName: 'Audi 2 (4DX 3D)',
            soundSystem: 'Dolby Surround 5.1',
            totalSeats: 60,
            seatLayout: {
              rows: ['A', 'B', 'C', 'D', 'E', 'F'],
              seatsPerRow: 10,
              tiers: [
                { name: 'Standard', rows: ['A', 'B', 'C'], basePrice: 220 },
                { name: 'Premium', rows: ['D', 'E'], basePrice: 320 },
                { name: 'VIP Recliner', rows: ['F'], basePrice: 480 }
              ]
            }
          }
        ],
        createdAt: new Date()
      }
    ];

    // Compute dynamic today/tomorrow dates in YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    // Seed Showtimes
    const showtimesList = [];
    let showtimeIdCount = 1;

    for (const movie of this.movies) {
      for (const theater of this.theaters) {
        for (const date of [today, tomorrow]) {
          const times = ['10:30 AM', '02:00 PM', '06:15 PM', '09:45 PM'];
          for (let i = 0; i < times.length; i++) {
            const time = times[i];
            const hexId = (showtimeIdCount++).toString().padStart(8, '0');
            showtimesList.push({
              _id: `66a4000000000000${hexId}`,
              movieId: movie._id,
              theaterId: theater._id,
              screenNumber: 1,
              screenName: theater.screens[0].screenName,
              date: date,
              time: time,
              format: i % 2 === 0 ? 'IMAX 3D' : '2D Dolby',
              pricing: {
                standard: theater.screens[0].seatLayout.tiers[0].basePrice,
                premium: theater.screens[0].seatLayout.tiers[1].basePrice,
                vip: theater.screens[0].seatLayout.tiers[2].basePrice
              },
              // Pre-fill a few booked seats for realistic look
              bookedSeats: ['A3', 'A4', 'B5', 'D6'],
              lockedSeats: [],
              createdAt: new Date()
            });
          }
        }
      }
    }

    this.showtimes = showtimesList;
    this.initialized = true;
    console.log(`[MemoryStore] Loaded: ${this.users.length} Users, ${this.movies.length} Movies, ${this.theaters.length} Theaters, ${this.showtimes.length} Showtimes.`);
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
