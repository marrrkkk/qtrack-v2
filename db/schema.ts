import { pgTable, serial, text, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

// Define the schema for the classes table
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),           // Primary key for the class
  teacherName: text("teacher_name").notNull(), // Full name of the teacher
  teacherId: text("teacher_id").notNull(),  // Unique ID of the teacher
  subject: text("subject").notNull(),       // The subject being taught
  room: text("room").notNull(),             // Room where the class takes place
  schedule: text("schedule").notNull(),    // Class schedule stored as JSON (e.g., days and times)
  students: jsonb("students").$type<string[]>(),    // List of students in the class (e.g., as an array of IDs or names)
  createdAt: timestamp("created_at").defaultNow().notNull(), // Timestamp for when the class was created
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),                 // Primary key for the attendance record
  classId: serial("class_id").notNull(),          // Reference to the class ID
  isActive: boolean("is_active").default(true),
  qrCode: text('qr_code'),  // Indicates if the attendance is active (e.g., if the class is ongoing)
  attendanceList: jsonb("attendance_list").$type<{ email: string; present: boolean }[]>(), // List of students with their presence status
  createdAt: timestamp("created_at").defaultNow().notNull(), // Timestamp for when the attendance record was created
});

export type Classes = typeof classes.$inferSelect
export type User = typeof users.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;