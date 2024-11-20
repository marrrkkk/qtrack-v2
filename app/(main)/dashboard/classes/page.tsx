import ClassCard from "@/components/ClassCard";
import { classes, db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

const Classes = async () => {
  const user = await currentUser();
  if (!user?.id) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">You must be logged in to see your classes.</p>
      </div>
    );
  }

  // Classes user created
  const createdClasses = await db
    .select()
    .from(classes)
    .where(eq(classes.teacherId, user.id));

  // Classes user enrolled
  const allClasses = await db.select().from(classes);
  const enrolledClasses = allClasses.filter(
    (_class) =>
      _class.students &&
      _class.students.includes(user.emailAddresses[0]?.emailAddress)
  );

  // Combine created and enrolled classes
  const _classes = [...createdClasses, ...enrolledClasses];

  // Fetch avatar
  const classData = await Promise.all(
    _classes.map(async (_class) => {
      const teacher = (
        await (await clerkClient()).users.getUser(_class.teacherId)
      ).imageUrl;
      return {
        ..._class,
        avatar: teacher,
      };
    })
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">
        My Classes
      </h1>
      
      {classData.length === 0 ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-lg text-gray-500">No classes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classData.map((_class) => (
            <div className="flex justify-center" key={_class.id}>
              <div className="w-full max-w-sm sm:max-w-md md:max-w-none">
                <ClassCard
                  id={_class.id}
                  teacherName={_class.teacherName}
                  subject={_class.subject}
                  room={_class.room}
                  schedule={_class.schedule}
                  avatar={_class.avatar}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Classes;