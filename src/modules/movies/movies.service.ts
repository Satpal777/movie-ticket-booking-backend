import { eq, and, inArray } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { movies, shows, seats, screens, bookings, cinemas } from './movies.schema.js';
import { AppError } from '../../utils/errors.js';
import { sql } from 'drizzle-orm';


export const getAllMovies = async () => {
    return db.select().from(movies);
};

export const getMovieById = async (id: number) => {
    const [movie] = await db.select().from(movies).where(eq(movies.id, id));
    if (!movie) throw AppError.notFound('Movie not found');
    return movie;
};

export const getCinemasByMovie = async (movieId: number) => {
    return db
        .selectDistinct({
            id: cinemas.id,
            name: cinemas.name,
            address: cinemas.address,
            city: cinemas.city,
            state: cinemas.state,
            pincode: cinemas.pincode,
            phone: cinemas.phone,
        })
        .from(cinemas)
        .innerJoin(screens, eq(screens.cinemaId, cinemas.id))
        .innerJoin(shows, eq(shows.screenId, screens.id))
        .where(eq(shows.movieId, movieId));
};

export const getShowsByCinemaAndMovie = async (cinemaId: number, movieId: number) => {
    return db
        .select({
            id: shows.id,
            movieId: shows.movieId,
            startsAt: shows.startsAt,
            price: shows.price,
            screenId: screens.id,
            screenName: screens.name,
            totalSeats: screens.totalSeats,
            cinemaId: cinemas.id,
            cinemaName: cinemas.name,
        })
        .from(shows)
        .innerJoin(screens, eq(shows.screenId, screens.id))
        .innerJoin(cinemas, eq(screens.cinemaId, cinemas.id))
        .where(and(eq(shows.movieId, movieId), eq(cinemas.id, cinemaId)));
};

export const getShowsByMovie = async (movieId: number) => {
    return db
        .select({
            id: shows.id,
            movieId: shows.movieId,
            startsAt: shows.startsAt,
            price: shows.price,
            screenId: screens.id,
            screenName: screens.name,
            totalSeats: screens.totalSeats,
        })
        .from(shows)
        .innerJoin(screens, eq(shows.screenId, screens.id))
        .where(eq(shows.movieId, movieId));
};

export const getSeatsByShow = async (showId: number) => {
    const [show] = await db.select().from(shows).where(eq(shows.id, showId));
    if (!show) throw AppError.notFound('Show not found');

    const allSeats = await db.select().from(seats).where(eq(seats.screenId, show.screenId));

    const bookedForShow = await db
        .select({ seatId: bookings.seatId })
        .from(bookings)
        .where(and(eq(bookings.showId, showId), eq(bookings.status, 'confirmed')));

    const bookedSeatIds = new Set(bookedForShow.map((b) => b.seatId));

    return allSeats.map((seat) => ({
        ...seat,
        isBooked: bookedSeatIds.has(seat.id),
    }));
};

export const bookSeats = async (userId: number, showId: number, seatIds: number[]) => {
    if (seatIds.length === 0) throw AppError.badRequest('Select at least one seat');

    const result = await db.transaction(async (tx) => {
        const lockedSeats = await tx
            .select()
            .from(seats)
            .where(inArray(seats.id, seatIds))
            .for('update');

        if (lockedSeats.length !== seatIds.length) {
            throw AppError.badRequest('One or more seats not found');
        }

        const [show] = await tx.select().from(shows).where(eq(shows.id, showId));
        if (!show) throw AppError.notFound('Show not found');

        for (const seat of lockedSeats) {
            if (seat.screenId !== show.screenId) {
                throw AppError.badRequest(`Seat ${seat.id} does not belong to this show's screen`);
            }
        }

        const existingBookings = await tx
            .select()
            .from(bookings)
            .where(
                and(
                    eq(bookings.showId, showId),
                    inArray(bookings.seatId, seatIds),
                    eq(bookings.status, 'confirmed')
                )
            );

        if (existingBookings.length > 0) {
            const bookedIds = existingBookings.map((b) => b.seatId).join(', ');
            throw AppError.conflict(`Seat(s) ${bookedIds} already booked`);
        }

        const newBookings = await tx
            .insert(bookings)
            .values(
                seatIds.map((seatId) => ({
                    userId,
                    showId,
                    seatId,
                }))
            )
            .returning();

        return {
            bookings: newBookings,
            totalSeats: seatIds.length,
            totalPrice: (Number(show.price) * seatIds.length).toFixed(2),
        };
    });

    return result;
};

export const getMyBookings = async (userId: number) => {
    return db
        .select({
            bookingId: bookings.id,
            bookingTime: bookings.bookingTime,
            status: bookings.status,
            seatRow: seats.row,
            seatNumber: seats.number,
            seatType: seats.type,
            showTime: shows.startsAt,
            price: shows.price,
            movieTitle: movies.title,
            movieImage: movies.image,
            screenName: screens.name,
            cinemaName: cinemas.name,
            cinemaCity: cinemas.city,
        })
        .from(bookings)
        .innerJoin(seats, eq(bookings.seatId, seats.id))
        .innerJoin(shows, eq(bookings.showId, shows.id))
        .innerJoin(movies, eq(shows.movieId, movies.id))
        .innerJoin(screens, eq(shows.screenId, screens.id))
        .innerJoin(cinemas, eq(screens.cinemaId, cinemas.id))
        .where(eq(bookings.userId, userId));
};
