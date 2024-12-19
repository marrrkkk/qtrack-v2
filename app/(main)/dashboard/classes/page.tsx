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
        <div className="text-lg text-muted-foreground bg-card/50 backdrop-blur-sm shadow-lg rounded-xl p-8">
          You must be logged in to see your classes.
        </div>
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
          return null;
        }
      })
    )
  ).filter(Boolean);

  if (classData.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg text-muted-foreground bg-card/50 backdrop-blur-sm shadow-lg rounded-xl p-8">
          No classes found. Start by creating or enrolling in a class! 🎓
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {(classData as NonNullable<typeof classData[0]>[]).map((_class) => (
        <div key={_class.id} className="flex justify-center">
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

export default function Classes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/80 pt-20 md:pt-12 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 flex items-center justify-center sm:justify-start">
          <GraduationCap className="mr-4 h-10 w-10 text-primary" />
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            My Classes
          </h1>
        </div>
        <Suspense fallback={<ClassesSkeletonGrid />}>
          <ClassesGrid />
        </Suspense>
      </div>
    </div>
  )
}

