"use server";

import { db, classes, attendance } from "@/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const AddNewClass = async (formdata: FormData) => {
  try {
    const user = await currentUser();
    const teacherName = user?.fullName as string;
    const teacherId = user?.id as string;
    const subject = formdata.get("subject") as string;
    const room = formdata.get("room") as string;
    const schedule = formdata.get("schedule") as string;
    const startDate = new Date(formdata.get("startDate") as string);
    const endDate = new Date(formdata.get("endDate") as string);

    await db.insert(classes).values({
      teacherName,
      teacherId,
      subject,
      room,
      schedule,
      startDate,
      endDate,
    });

    revalidatePath("/dashboard/classes");
  } catch (error) {
    console.error(error);
  }
};

// export const EditClass = async (classId: number, formdata: FormData) => {
//   try {
//     const subject = formdata.get("subject") as string;
//     const room = formdata.get("room") as string;
//     const schedule = formdata.get("schedule") as string;

//     await db
//       .update(classes)
//       .set({
//         subject,
//         room,
//         schedule,
//       })
//       .where(eq(classes.id, classId));

//     revalidatePath("/dashboard/classes");
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const DeleteClass = async (classId: number) => {
//   try {
//     await db.delete(classes).where(eq(classes.id, classId));
//     revalidatePath("/dashboard/classes");
//   } catch (error) {
//     console.error(error);
//   }
// };

export const EditClass = async (classId: number, formdata: FormData) => {
  try {
    const subject = formdata.get("subject") as string;
    const room = formdata.get("room") as string;
    const schedule = formdata.get("schedule") as string;

    await db
      .update(classes)
      .set({
        subject,
        room,
        schedule,
      })
      .where(eq(classes.id, classId));

    revalidatePath("/dashboard/classes");
  } catch (error) {
    console.error(error);
  }
};

export const DeleteClass = async (classId: number) => {
  try {
    await db.delete(classes).where(eq(classes.id, classId));
    revalidatePath("/dashboard/classes");
  } catch (error) {
    console.error(error);
  }
};

export const AddStudentToClass = async (
  email: string,
  classId: number,
  currentUserEmail: string
) => {
  try {
    if (email === currentUserEmail) {
      throw new Error("You cannot add yourself as a student");
    }

    const users = (await (await clerkClient()).users.getUserList()).data;
    const userExists = users.some((user) =>
      user.emailAddresses.some(
        (emailAddress) => emailAddress.emailAddress === email
      )
    );

    if (!userExists) {
      throw new Error("Student email not found in the database");
    }

    const classData = await db
      .select()
      .from(classes)
      .where(eq(classes.id, classId));
    if (classData.length > 0) {
      const currentClass = classData[0];
      const currentStudents = currentClass.students || [];

      if (currentStudents.includes(email)) {
        throw new Error("Student is already added to the class");
      }

      const updatedStudents = [...(currentClass.students || []), email];

      await db
        .update(classes)
        .set({ students: updatedStudents })
        .where(eq(classes.id, classId));
      console.log("Student added successfully!");
    } else {
      throw new Error("Class not found");
    }

    revalidatePath(`/dashboard/classes/${classId}`);
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be caught in the component
  }
};

// Start the class (create new attendance)
export const startAttendance = async (classId: number) => {
  const qrCode = `attendance-${classId}-${Date.now()}`;
  try {
    const studentsData = await db
      .select({ students: classes.students })
      .from(classes)
      .where(eq(classes.id, classId));
    const students = studentsData[0]?.students ?? []; // Use null coalescing to default to an empty array if students are not found

    const attendanceList = students.map((email) => ({ email, present: false }));

    await db
      .insert(attendance)
      .values({ classId: classId, attendanceList, isActive: true, qrCode });
  } catch (error) {
    console.error("Error starting attendance:", error);
  }
};

// End the class (update attendance isActive to false)
export const endAttendance = async (classId: number) => {
  try {
    await db
      .update(attendance)
      .set({ isActive: false })
      .where(eq(attendance.classId, classId));
  } catch (error) {
    console.error("Error ending attendance:", error);
  }
};

export const markAsPresent = async (email: string, classId: number) => {
  try {
    // Retrieve the active attendance record for the specified classId
    const existingAttendanceData = await db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.classId, classId),
          eq(attendance.isActive, true) // Assuming you have a field to indicate if attendance is active
        )
      );

    if (existingAttendanceData.length === 0) {
      console.error("Active attendance record not found.");
      return;
    }

    const activeAttendance = existingAttendanceData[0];
    const attendanceList = activeAttendance.attendanceList || [];

    // Update the presence status for the specified email in the attendance list
    const updatedAttendanceList = attendanceList.map((student) =>
      student.email === email ? { ...student, present: true } : student
    );

    // Update the attendance record in the database
    await db
      .update(attendance)
      .set({ attendanceList: updatedAttendanceList })
      .where(eq(attendance.id, activeAttendance.id)); // Update by active attendance ID

    console.log("Student marked as present.");
  } catch (error) {
    console.error("Error marking student as present:", error);
  }
};

export const getAttendanceStatus = async (classId: number) => {
  try {
    const attendanceData = await db
      .select({
        id: attendance.id,
        isActive: attendance.isActive,
        qrCode: attendance.qrCode,
      })
      .from(attendance)
      .where(
        and(eq(attendance.classId, classId), eq(attendance.isActive, true))
      );

    // If an active attendance record is found, return its ID, isActive status, and qrCode
    if (attendanceData.length > 0) {
      return {
        attendanceId: attendanceData[0].id,
        isActive: true,
        qrCode: attendanceData[0].qrCode ?? "",
      };
    }

    // Return default values if no active attendance found
    return {
      attendanceId: null,
      isActive: false,
      qrCode: "",
    };
  } catch (error) {
    console.error("Error fetching attendance status:", error);
    return {
      attendanceId: null,
      isActive: false,
      qrCode: "",
    };
  }
};

export const getAttendanceHistory = async (classId: number) => {
  try {
    const attendanceHistory = await db
      .select({
        id: attendance.id,
        createdAt: attendance.createdAt,
        isActive: attendance.isActive,
      })
      .from(attendance)
      .where(eq(attendance.classId, classId))
      .orderBy(desc(attendance.createdAt));

    return attendanceHistory;
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    return [];
  }
};

export const getAttendanceDetails = async (
  classId: number,
  attendanceId: number
) => {
  try {
    const attendanceDetails = await db
      .select()
      .from(attendance)
      .where(
        and(eq(attendance.classId, classId), eq(attendance.id, attendanceId))
      )
      .limit(1);

    if (attendanceDetails.length === 0) {
      return null;
    }

    return attendanceDetails[0];
  } catch (error) {
    console.error("Error fetching attendance details:", error);
    return null;
  }
};

export async function getTodayClasses(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const todayClasses = await db
    .select({
      id: classes.id,
      teacherName: classes.teacherName,
      teacherId: classes.teacherId,
      subject: classes.subject,
      room: classes.room,
      schedule: classes.schedule,
      students: classes.students,
      createdAt: classes.createdAt,
      isActive: sql<boolean>`EXISTS (
        SELECT 1 FROM ${attendance} 
        WHERE ${attendance.classId} = ${classes.id} 
        AND ${attendance.isActive} = true
        ORDER BY ${attendance.createdAt} DESC
        LIMIT 1
      )`
    })
    .from(classes)
    .where(and(
      eq(classes.teacherId, userId),
      sql`DATE(${classes.createdAt}) = ${today}`
    ))
    .groupBy(classes.id);

  return todayClasses;
}

export async function getAllClasses(userId: string) {
  return await db
    .select({
      id: classes.id,
      teacherName: classes.teacherName,
      teacherId: classes.teacherId,
      subject: classes.subject,
      room: classes.room,
      schedule: classes.schedule,
      students: classes.students,
      startDate: classes.startDate,
      endDate: classes.endDate,
      createdAt: classes.createdAt,
    })
    .from(classes)
    .where(eq(classes.teacherId, userId));
}
