const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow all during development and preview
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'IMovies Ticketing API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Serve static frontend build if present (for single-service deployment)
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientBuildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>IMovies API Server</title></head>
        <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center;">
          <h1 style="color: #e11d48;">🎬 IMovies Backend API is Running</h1>
          <p>Full-stack movie ticket booking engine is operational.</p>
          <p><a href="/api/health" style="color: #38bdf8;">Check API Health</a> | <a href="/api/movies" style="color: #38bdf8;">Browse Movies API</a></p>
        </body>
        </html>
      `);
    }
  });
});

// Centralized error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only start listener if run directly (allows clean integration with test runners)
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🎬 [IMovies Server] Listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
      console.log(`   Local API URL: http://localhost:${PORT}/api`);
    });
  });
}

module.exports = app;
