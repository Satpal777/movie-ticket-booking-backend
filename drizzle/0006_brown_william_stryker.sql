CREATE TABLE "cinemas" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"pincode" text NOT NULL,
	"phone" text
);
--> statement-breakpoint
ALTER TABLE "shows" RENAME COLUMN "hall_id" TO "screen_id";--> statement-breakpoint
ALTER TABLE "shows" DROP CONSTRAINT "shows_hall_id_screens_id_fk";
--> statement-breakpoint
ALTER TABLE "shows" DROP CONSTRAINT "shows_movie_id_movies_id_fk";
--> statement-breakpoint
ALTER TABLE "screens" ADD COLUMN "cinema_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "screens" ADD CONSTRAINT "screens_cinema_id_cinemas_id_fk" FOREIGN KEY ("cinema_id") REFERENCES "public"."cinemas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shows" ADD CONSTRAINT "shows_screen_id_screens_id_fk" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shows" ADD CONSTRAINT "shows_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;