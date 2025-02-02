import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { getActiveClasses } from "@/actions/classes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Users,
  MapPin,
  BookOpen,
  ChevronRight,
  Bell,
} from "lucide-react";
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
  const activeClasses = user ? await getActiveClasses(user.id) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/80 pt-20 md:pt-12 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 flex items-center justify-center sm:justify-start">
          <BookOpen className="mr-4 h-10 w-10 text-primary" />
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Dashboard
          </h1>
        </div>

        <div className="grid gap-6">
          <div className="rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <CalendarDays className="mr-2 h-6 w-6 text-primary" />
              Active Classes
            </h2>

            {activeClasses.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-gray-500 dark:text-gray-400 text-center text-lg">
                    No active classes found
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeClasses.map((cls) => (
                  <Link
                    href={`/dashboard/classes/${cls.id}`}
                    key={cls.id}
                    className="block group"
                  >
                    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 ring-2 ring-primary transition-all duration-300 group-hover:ring-4">
                            <AvatarImage
                              src={user?.imageUrl}
                              alt={cls.teacherName}
                            />
                            <AvatarFallback>{cls.subject[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                              {cls.subject}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {cls.teacherName}
                            </p>
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
                            <Users className="mr-2 h-4 w-4 text-primary" />
                            <Badge
                              variant="secondary"
                              className="transition-all duration-300 group-hover:bg-primary group-hover:text-white"
                            >
                              {cls.students?.length || 0} students
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
