import { pgTable, serial, text, integer, pgEnum, numeric, timestamp } from 'drizzle-orm/pg-core'
import { users } from '../auth/auth.schema.js';

export const cinemas = pgTable('cinemas', {
    id:       serial('id').primaryKey(),
    name:     text('name').notNull(),
    address:  text('address').notNull(),
    city:     text('city').notNull(),
    state:    text('state').notNull(),
    pincode:  text('pincode').notNull(),
    phone:    text('phone'),
});

export const screens = pgTable('screens', {
    id:          serial('id').primaryKey(),
    cinemaId:    integer('cinema_id').notNull().references(() => cinemas.id, { onDelete: 'cascade' }),
    name:        text('name').notNull(),
    totalSeats:  integer('total_seats').notNull(),
});

export const movies = pgTable('movies', {
    id:       serial('id').primaryKey(),
    title:    text('title').notNull(),
    duration: integer('duration').notNull(),   
    language: text('language').notNull(),
    image:    text('image'),
});

export const shows = pgTable('shows', {
    id:       serial('id').primaryKey(),
    movieId:  integer('movie_id').notNull().references(() => movies.id, { onDelete: 'cascade' }),
    screenId: integer('screen_id').notNull().references(() => screens.id, { onDelete: 'cascade' }),
    startsAt: timestamp('starts_at').notNull(),
    price:    numeric('price', { precision: 10, scale: 2 }).notNull(),
});


export const seatTypeEnum   = pgEnum('seat_type',   ['regular', 'premium', 'vip']);
export const seatStatusEnum = pgEnum('seat_status', ['available', 'booked']);

export const seats = pgTable('seats', {
    id:       serial('id').primaryKey(),
    screenId: integer('screen_id').notNull().references(() => screens.id, { onDelete: 'cascade' }),
    row:      text('row').notNull(),
    number:   integer('number').notNull(),
    type:     seatTypeEnum('type').default('regular').notNull(),
    status:   seatStatusEnum('status').default('available').notNull(),
})

export const bookingStatusEnum = pgEnum('booking_status', ['confirmed', 'cancelled']);

export const bookings = pgTable('bookings', {
    id:          serial('id').primaryKey(),
    userId:      integer('user_id').notNull().references(() => users.id,  { onDelete: 'cascade' }),
    showId:      integer('show_id').notNull().references(() => shows.id,  { onDelete: 'cascade' }),
    seatId:      integer('seat_id').notNull().references(() => seats.id,  { onDelete: 'cascade' }),
    bookingTime: timestamp('booking_time').defaultNow().notNull(),
    status:      bookingStatusEnum('status').default('confirmed').notNull(),
});


export type Cinema  = typeof cinemas.$inferSelect;
export type Movie   = typeof movies.$inferSelect;
export type Screen  = typeof screens.$inferSelect;
export type Show    = typeof shows.$inferSelect;
export type Seat    = typeof seats.$inferSelect;
export type Booking = typeof bookings.$inferSelect;