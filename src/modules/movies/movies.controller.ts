import type { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/response.js';
import { getAllMovies, getMovieById, getCinemasByMovie, getShowsByCinemaAndMovie, getShowsByMovie, getSeatsByShow, bookSeats, getMyBookings } from './movies.service.js';
import type { BookSeatsDtoType } from './movies.dto.js';


export const listMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllMovies();
        return sendSuccess(res, data);
    } catch (err) {
        next(err);
    }
};

export const getMovie = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const movieId = Number(req.params.id);
        const data = await getMovieById(movieId);
        return sendSuccess(res, data);
    } catch (err) {
        next(err);
    }
};

export const listCinemas = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const movieId = Number(req.params.movieId);
        const data = await getCinemasByMovie(movieId);
        return sendSuccess(res, data);
    } catch (err) {
        next(err);
    }
};

export const listShowsByCinema = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const cinemaId = Number(req.params.cinemaId);
        const movieId = Number(req.params.movieId);
        const data = await getShowsByCinemaAndMovie(cinemaId, movieId);
        return sendSuccess(res, data);
    } catch (err) {
        next(err);
    }
};

export const listShows = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const movieId = Number(req.params.movieId);
        const data = await getShowsByMovie(movieId);
        return sendSuccess(res, data);
    } catch (err) {
        next(err);
    }
};

export const listSeats = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const showId = Number(req.params.showId);
        const data = await getSeatsByShow(showId);
        return sendSuccess(res, data);
    } catch (err) {
        next(err);
    }
};

export const createBooking = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.userId!;
        const showId = Number(req.params.showId);
        const body = req.body as BookSeatsDtoType;
        const data = await bookSeats(userId, showId, body.seatIds);
        return sendSuccess(res, data, 'Seats booked successfully');
    } catch (err) {
        next(err);
    }
};

export const myBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId!;
        const data = await getMyBookings(userId);
        return sendSuccess(res, data);
    } catch (err) {
        next(err);
    }
};
