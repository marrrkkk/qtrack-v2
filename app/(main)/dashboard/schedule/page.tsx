import { Suspense } from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { db, classes } from '@/db'
import { eq } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Users, Calendar } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

async function getAllClasses(userId: string) {
  return await db
    .select()
    .from(classes)
    .where(eq(classes.teacherId, userId));
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function ClassCard({ classData }: { classData: any }) {
  return (
    <Card className="mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/20">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="text-lg font-bold flex items-center">
          <span className="mr-2">{classData.subject}</span>
          <Badge variant="outline" className="ml-auto text-xs font-normal">
            Room {classData.room}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={classData.avatar} alt={classData.teacherName} />
            <AvatarFallback>{classData.subject[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{classData.teacherName}</span>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-primary" />
            {classData.schedule}
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-primary" />
            {classData.students?.length || 0} students
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ClassCardSkeleton() {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  )
}

function ScheduleSkeleton() {
  return (
    <div className="space-y-8">
      {DAYS.map((day) => (
        <div key={day}>
          <Skeleton className="h-8 w-40 mb-4" />
          <ClassCardSkeleton />
          <ClassCardSkeleton />
        </div>
      ))}
    </div>
  )
}

async function ScheduleContent() {
  const user = await currentUser();
  if (!user) return <div className="text-center text-lg text-muted-foreground">Please sign in to view your schedule.</div>;

  const allClasses = await getAllClasses(user.id);
  
  const classesWithAvatars = await Promise.all(
    allClasses.map(async (cls) => ({
      ...cls,
      avatar: user.imageUrl,
    }))
  );
  
  return (
    <div className="space-y-8">
      {DAYS.map((day) => {
        const dayClasses = classesWithAvatars.filter(cls => cls.schedule.includes(day));
        if (dayClasses.length === 0) return null;
        
        return (
          <div key={day} className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-primary">
              <Calendar className="mr-2 h-6 w-6" />
              {day}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dayClasses.map((cls) => (
                <ClassCard key={cls.id} classData={cls} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/80">
      <div className="container mx-auto p-4 max-w-7xl">
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          Weekly Schedule
        </h1>
        <Suspense fallback={<ScheduleSkeleton />}>
          <ScheduleContent />
        </Suspense>
      </div>
    </div>
  );
}

