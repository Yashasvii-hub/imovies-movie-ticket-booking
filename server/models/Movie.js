const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide the movie title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide movie synopsis/description']
  },
  genre: {
    type: [String],
    required: true,
    default: []
  },
  language: {
    type: String,
    required: true,
    default: 'English'
  },
  duration: {
    type: Number, // in minutes
    required: true,
    default: 120
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number, // out of 10 or 5
    default: 8.5,
    min: 0,
    max: 10
  },
  posterUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'
  },
  backdropUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80'
  },
  trailerUrl: {
    type: String,
    default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  director: {
    type: String,
    default: 'Christopher Nolan'
  },
  cast: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema);
