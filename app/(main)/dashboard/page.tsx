import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { getTodayClasses } from "@/actions/classes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Users, MapPin, BookOpen, ChevronRight, Bell } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = async () => {
  const user = await currentUser();
  const todayClasses = user ? await getTodayClasses(user.id) : [];

  const classesWithAvatars = todayClasses.map(cls => ({
    ...cls,
    avatar: user?.imageUrl
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">Qtrack</h1>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>New assignment added</DropdownMenuItem>
                  <DropdownMenuItem>Class schedule updated</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
            Welcome back, <span className="text-primary">{user?.firstName}</span>
          </h2>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CalendarDays className="mr-2 h-6 w-6 text-primary" />
              Today's Classes
            </h3>
            {classesWithAvatars.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-gray-500 dark:text-gray-400 text-center text-lg">No classes scheduled for today</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {classesWithAvatars.map((cls) => (
                  <Link href={`/dashboard/classes/${cls.id}`} key={cls.id} className="block group">
                    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 ring-2 ring-primary transition-all duration-300 group-hover:ring-4">
                            <AvatarImage src={cls.avatar} alt={cls.teacherName} />
                            <AvatarFallback>{cls.subject[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">{cls.subject}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{cls.teacherName}</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="grid gap-3">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <MapPin className="mr-2 h-4 w-4 text-primary" />
                            Room: {cls.room}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                            {cls.schedule}
                          </div>
                          {cls.students && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <Users className="mr-2 h-4 w-4 text-primary" />
                              <Badge variant="secondary" className="transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                                {cls.students.length} students
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <ChevronRight className="h-5 w-5 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;