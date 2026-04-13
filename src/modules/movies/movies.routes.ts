import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { validate, validateParams } from '../../middleware/validate.middleware.js';
import { authMiddleware, isAuthenticated } from '../auth/auth.middleware.js';
import { MovieIdParamDto, MovieIdParamForShowsDto, CinemaShowsParamDto, ShowIdParamDto, BookSeatsDto } from './movies.dto.js';
import { listMovies, getMovie, listCinemas, listShowsByCinema, listShows, listSeats, createBooking, myBookings } from './movies.controller.js';

const router: ExpressRouter = Router();

// Public Routes
router.get('/', authMiddleware, listMovies);
router.get('/shows/:showId/seats', authMiddleware, validateParams(ShowIdParamDto), listSeats);
router.get('/:id', authMiddleware, validateParams(MovieIdParamDto), getMovie);
router.get('/:movieId/cinemas', authMiddleware, validateParams(MovieIdParamForShowsDto), listCinemas);
router.get('/:movieId/shows', validateParams(MovieIdParamForShowsDto), listShows);
router.get('/:movieId/cinemas/:cinemaId/shows', validateParams(CinemaShowsParamDto), listShowsByCinema);

// Protected routes
router.get('/my/bookings', authMiddleware, isAuthenticated, myBookings);
router.post('/shows/:showId/book', authMiddleware, isAuthenticated, validateParams(ShowIdParamDto), validate(BookSeatsDto), createBooking);

export default router;
