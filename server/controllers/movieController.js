const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const memoryStore = require('../config/memoryStore');

// @desc    Get all active movies with search and filters
// @route   GET /api/movies
// @access  Public
exports.getAllMovies = async (req, res, next) => {
  try {
    const { search, genre, language } = req.query;
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      let query = { isActive: true };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { cast: { $regex: search, $options: 'i' } },
          { director: { $regex: search, $options: 'i' } }
        ];
      }

      if (genre && genre !== 'All') {
        query.genre = { $in: [genre] };
      }

      if (language && language !== 'All') {
        query.language = language;
      }

      const movies = await Movie.find(query).sort({ rating: -1 });

      return res.status(200).json({
        success: true,
        count: movies.length,
        data: movies
      });
    } else {
      // Memory Store fallback
      let list = memoryStore.movies.filter(m => m.isActive);

      if (search) {
        const s = search.toLowerCase();
        list = list.filter(m =>
          m.title.toLowerCase().includes(s) ||
          m.director.toLowerCase().includes(s) ||
          m.cast.some(c => c.toLowerCase().includes(s))
        );
      }

      if (genre && genre !== 'All') {
        list = list.filter(m => m.genre.includes(genre));
      }

      if (language && language !== 'All') {
        list = list.filter(m => m.language.toLowerCase() === language.toLowerCase());
      }

      list.sort((a, b) => b.rating - a.rating);

      return res.status(200).json({
        success: true,
        count: list.length,
        data: list
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
exports.getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const movie = await Movie.findById(id);
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found.' });
      }
      return res.status(200).json({ success: true, data: movie });
    } else {
      const movie = memoryStore.movies.find(m => m._id.toString() === id.toString());
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found.' });
      }
      return res.status(200).json({ success: true, data: movie });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new movie
// @route   POST /api/movies
// @access  Private/Admin
exports.createMovie = async (req, res, next) => {
  try {
    const { title, description, genre, language, duration, releaseDate, rating, posterUrl, backdropUrl, trailerUrl, director, cast } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Movie title and description are required.' });
    }

    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const movie = await Movie.create(req.body);
      return res.status(201).json({ success: true, message: 'Movie created successfully.', data: movie });
    } else {
      const newMovie = {
        _id: '66a2' + Math.random().toString(16).substring(2, 22).padEnd(20, '0'),
        title,
        description,
        genre: Array.isArray(genre) ? genre : (genre ? genre.split(',').map(s => s.trim()) : ['Action']),
        language: language || 'English',
        duration: Number(duration) || 120,
        releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        rating: Number(rating) || 8.0,
        posterUrl: posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
        backdropUrl: backdropUrl || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: trailerUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        director: director || 'Director',
        cast: Array.isArray(cast) ? cast : (cast ? cast.split(',').map(s => s.trim()) : []),
        isActive: true,
        createdAt: new Date()
      };

      memoryStore.movies.unshift(newMovie);
      return res.status(201).json({ success: true, message: 'Movie created successfully.', data: newMovie });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie details
// @route   PUT /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const movie = await Movie.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found.' });
      }
      return res.status(200).json({ success: true, message: 'Movie updated successfully.', data: movie });
    } else {
      const index = memoryStore.movies.findIndex(m => m._id.toString() === id.toString());
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Movie not found.' });
      }
      memoryStore.movies[index] = { ...memoryStore.movies[index], ...req.body };
      return res.status(200).json({ success: true, message: 'Movie updated successfully.', data: memoryStore.movies[index] });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const movie = await Movie.findByIdAndDelete(id);
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found.' });
      }
      return res.status(200).json({ success: true, message: 'Movie deleted successfully.' });
    } else {
      const index = memoryStore.movies.findIndex(m => m._id.toString() === id.toString());
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Movie not found.' });
      }
      memoryStore.movies.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Movie deleted successfully.' });
    }
  } catch (error) {
    next(error);
  }
};
