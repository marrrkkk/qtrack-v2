import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { classes, db } from "@/db";
import { eq } from "drizzle-orm";
import ClientClassPage from "@/components/ClientClassPage";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ClassPage({ params }: PageProps) {
  const { id } = params;
  const user = await currentUser();

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  const classData = await db
    .select()
    .from(classes)
    .where(eq(classes.id, Number(id)));

  const _class = classData[0];

  if (!_class) {
    return <div>Class not found.</div>;
  }

  // Serialize the user and class data
  const serializedUser = {
    id: user.id,
    emailAddresses: user.emailAddresses.map((email) => email.emailAddress),
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const serializedClass = {
    id: _class.id,
    teacherName: _class.teacherName,
    teacherId: _class.teacherId,
    subject: _class.subject,
    room: _class.room,
    schedule: _class.schedule,
    students: _class.students,
    createdAt: _class.createdAt.toISOString(),
  };

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <svg
            className="animate-spin h-8 w-8 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
            ></path>
          </svg>
        </div>
      }
    >
      <ClientClassPage user={serializedUser} classData={serializedClass} />
    </Suspense>
  );
}
