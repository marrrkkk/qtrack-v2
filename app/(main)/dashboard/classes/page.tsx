import { Suspense } from "react"
import ClassCard from "@/components/ClassCard"
import ClassCardSkeleton from "@/components/ClassCardSkeleton"
import { classes, db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { GraduationCap } from 'lucide-react'

const ClassesGrid = async () => {
  const user = await currentUser()
  if (!user?.id) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground bg-card shadow-lg rounded-lg p-6">
          You must be logged in to see your classes.
        </p>
      </div>
    )
  }

  // Classes user created
  const createdClasses = await db
    .select()
    .from(classes)
    .where(eq(classes.teacherId, user.id))

  // Classes user enrolled
  const allClasses = await db.select().from(classes)
  const enrolledClasses = allClasses.filter(
    (_class) =>
      _class.students &&
      _class.students.includes(user.emailAddresses[0]?.emailAddress)
  )

  // Combine created and enrolled classes
  const _classes = [...createdClasses, ...enrolledClasses]

  // Fetch avatar
  const classData = (
    await Promise.all(
      _classes.map(async (_class) => {
        try {
          const teacher = await (await clerkClient()).users.getUser(_class.teacherId);
          return {
            ..._class,
            avatar: teacher.imageUrl,
          };
        } catch (error) {
          return null; // Return null for classes with deleted teachers
        }
      })
    )
  ).filter(Boolean); // Remove null values from the array

  if (classData.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground bg-card shadow-lg rounded-lg p-6">
          No classes found. Start by creating or enrolling in a class!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {(classData as NonNullable<typeof classData[0]>[]).map((_class) => (
        <div className="flex justify-center" key={_class.id}>
          <div className="w-full">
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
  )
}

const ClassesSkeletonGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div className="flex justify-center" key={index}>
          <div className="w-full">
            <ClassCardSkeleton />
          </div>
        </div>
      ))}
    </div>
  )
}

const Classes = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/80 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-4xl font-extrabold mb-8 text-center sm:text-left flex items-center justify-center sm:justify-start">
          <GraduationCap className="mr-4 h-10 w-10 text-primary" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            My Classes
          </span>
        </h1>
        <Suspense fallback={<ClassesSkeletonGrid />}>
          <ClassesGrid />
        </Suspense>
      </div>
    </div>
  )
}

export default Classes

