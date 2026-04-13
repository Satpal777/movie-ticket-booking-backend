CREATE TYPE "public"."booking_status" AS ENUM('confirmed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."seat_status" AS ENUM('available', 'booked');--> statement-breakpoint
CREATE TYPE "public"."seat_type" AS ENUM('regular', 'premium', 'vip');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"show_id" integer NOT NULL,
	"seat_id" integer NOT NULL,
	"booking_time" timestamp DEFAULT now() NOT NULL,
	"status" "booking_status" DEFAULT 'confirmed' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"duration" integer NOT NULL,
	"language" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "screens" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"total_seats" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seats" (
	"id" serial PRIMARY KEY NOT NULL,
	"screen_id" integer NOT NULL,
	"row" text NOT NULL,
	"number" integer NOT NULL,
	"type" "seat_type" DEFAULT 'regular' NOT NULL,
	"status" "seat_status" DEFAULT 'available' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shows" (
	"id" serial PRIMARY KEY NOT NULL,
	"movie_id" integer NOT NULL,
	"hall_id" integer NOT NULL,
	"starts_at" timestamp NOT NULL,
	"price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_show_id_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_seat_id_seats_id_fk" FOREIGN KEY ("seat_id") REFERENCES "public"."seats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seats" ADD CONSTRAINT "seats_screen_id_screens_id_fk" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shows" ADD CONSTRAINT "shows_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shows" ADD CONSTRAINT "shows_hall_id_screens_id_fk" FOREIGN KEY ("hall_id") REFERENCES "public"."screens"("id") ON DELETE no action ON UPDATE no action;