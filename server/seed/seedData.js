const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');

const seedData = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/imovies';

  try {
    console.log(`Connecting to database at ${uri}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected! Purging existing records...');

    await User.deleteMany();
    await Movie.deleteMany();
    await Theater.deleteMany();
    await Showtime.deleteMany();
    await Booking.deleteMany();

    console.log('Seeding demo accounts...');
    const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10);
    const userPasswordHash = await bcrypt.hash('UserPass123!', 10);

    const admin = await User.create({
      name: 'Yashasvi Admin',
      email: 'admin@imovies.com',
      password: adminPasswordHash,
      role: 'admin',
      phone: '+91 9876543210'
    });

    const user = await User.create({
      name: 'Yashasvi Goswami',
      email: 'user@imovies.com',
      password: userPasswordHash,
      role: 'user',
      phone: '+91 9876543211'
    });

    console.log('Seeding movies...');
    const movies = await Movie.insertMany([
      {
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
        isActive: true
      },
      {
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
        isActive: true
      },
      {
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
        isActive: true
      },
      {
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
        isActive: true
      },
      {
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
        isActive: true
      }
    ]);

    console.log('Seeding theaters...');
    const theaters = await Theater.insertMany([
      {
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
        ]
      },
      {
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
        ]
      }
    ]);

    console.log('Seeding showtimes...');
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    const showtimesData = [];
    for (const movie of movies) {
      for (const theater of theaters) {
        for (const date of [today, tomorrow]) {
          const times = ['10:30 AM', '02:00 PM', '06:15 PM', '09:45 PM'];
          for (let i = 0; i < times.length; i++) {
            showtimesData.push({
              movieId: movie._id,
              theaterId: theater._id,
              screenNumber: 1,
              screenName: theater.screens[0].screenName,
              date: date,
              time: times[i],
              format: i % 2 === 0 ? 'IMAX 3D' : '2D Dolby',
              pricing: {
                standard: theater.screens[0].seatLayout.tiers[0].basePrice,
                premium: theater.screens[0].seatLayout.tiers[1].basePrice,
                vip: theater.screens[0].seatLayout.tiers[2].basePrice
              },
              bookedSeats: ['A3', 'A4', 'B5', 'D6'],
              lockedSeats: []
            });
          }
        }
      }
    }

    await Showtime.insertMany(showtimesData);

    console.log('Database seeding successfully finished!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
