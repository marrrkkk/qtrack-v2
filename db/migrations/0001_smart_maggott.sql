CREATE TABLE IF NOT EXISTS "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" serial NOT NULL,
	"is_active" boolean DEFAULT true,
	"attendance_list" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
