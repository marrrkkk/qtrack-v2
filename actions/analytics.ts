"use server";

import { db, classes, attendance } from "@/db";
import { sql } from "drizzle-orm";

export async function getStudentAttendanceData(userId: string) {
  const attendanceData = await db
    .select({
      subject: classes.subject,
      totalClasses: sql<number>`COUNT(DISTINCT ${attendance.id})`,
      attendedClasses: sql<number>`SUM(CASE WHEN ${attendance.attendanceList} @> jsonb_build_array(jsonb_build_object('email', ${userId}, 'present', true)) THEN 1 ELSE 0 END)`,
    })
    .from(classes)
    .leftJoin(attendance, sql`${attendance.classId} = ${classes.id}`)
    .where(sql`${classes.students} @> ARRAY[${userId}]::text[]`)
    .groupBy(classes.id);

  return attendanceData;
}

export async function getStudentPerformanceData(userId: string) {
  // This is a placeholder. In a real application, you would fetch actual performance data.
  // For this example, we'll generate some random data.
  const subjects = ["Math", "Science", "English", "History"];
  return subjects.map(subject => ({
    subject,
    score: Math.floor(Math.random() * 41) + 60, // Random score between 60 and 100
  }));
}

export async function getStudentActivityData(userId: string) {
  const activityData = await db
    .select({
      date: sql<string>`DATE(${attendance.createdAt})`,
      classesAttended: sql<number>`COUNT(DISTINCT CASE WHEN ${attendance.attendanceList} @> jsonb_build_array(jsonb_build_object('email', ${userId}, 'present', true)) THEN ${attendance.id} END)`,
    })
    .from(attendance)
    .innerJoin(classes, sql`${attendance.classId} = ${classes.id}`)
    .where(sql`${classes.students} @> ARRAY[${userId}]::text[]`)
    .groupBy(sql`DATE(${attendance.createdAt})`)
    .orderBy(sql`DATE(${attendance.createdAt})`);

  return activityData;
}

