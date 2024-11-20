CREATE TABLE IF NOT EXISTS "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"teacher_name" text NOT NULL,
	"teacher_id" text NOT NULL,
	"subject" text NOT NULL,
	"room" text NOT NULL,
	"schedule" text NOT NULL,
	"students" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
