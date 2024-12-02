"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  QrCode,
  Users,
  History,
  Settings,
  Loader2,
  MapPin,
  Calendar,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddStudent from "@/components/AddStudent";
import CreateAttendance from "@/components/CreateAttendance";
import Link from "next/link";
import {
  DeleteClass,
  EditClass,
  getAttendanceHistory,
  getAttendanceDetails,
} from "@/actions/classes";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUsersByEmails, getUser } from "@/actions/user";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface SerializedUser {
  id: string;
  emailAddresses: string[];
  firstName: string | null;
  lastName: string | null;
}

interface SerializedClassData {
  id: number;
  teacherName: string;
  teacherId: string;
  subject: string;
  room: string;
  schedule: string;
  students: string[] | null;
  createdAt: string;
}

interface AttendanceRecord {
  id: number;
  createdAt: Date;
  isActive: boolean | null;
}

interface AttendanceDetails {
  id: number;
  createdAt: Date;
  classId: number;
  isActive: boolean | null;
  qrCode: string | null;
  attendanceList: { email: string; present: boolean }[] | null;
}

interface ClientClassPageContentProps {
  user: SerializedUser;
  classData: SerializedClassData;
}

export default function ClientClassPage({
  user,
  classData,
}: ClientClassPageContentProps) {
  const isTeacher = user.id === classData.teacherId;
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceRecord[]
  >([]);
  const [schedule, setSchedule] = useState<string[]>(
    classData.schedule.split(", ")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [latestAttendance, setLatestAttendance] =
    useState<AttendanceDetails | null>(null);
  const router = useRouter();
  const [studentNames, setStudentNames] = useState<Record<string, { name: string; avatarUrl: string | null }>>({});
  const [teacherData, setTeacherData] = useState<{ name: string; avatarUrl: string | null } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      const history = await getAttendanceHistory(classData.id);
      setAttendanceHistory(history);
      if (history.length > 0) {
        const latestRecord = history[0];
        const details = await getAttendanceDetails(
          classData.id,
          latestRecord.id
        );
        if (details) {
          setLatestAttendance(details as AttendanceDetails);
        }
      }
    };
    fetchAttendanceHistory();
  }, [classData.id]);

  useEffect(() => {
    const fetchStudentNames = async () => {
      if (classData.students && classData.students.length > 0) {
        const studentData = await getUsersByEmails(classData.students);
        setStudentNames(studentData);
      }
    };
    fetchStudentNames();
  }, [classData.students]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      const teacher = await getUser(classData.teacherId);
      if (teacher) {
        setTeacherData({
          name: teacher.name,
          avatarUrl: teacher.avatarUrl
        });
      }
    };
    fetchTeacherData();
  }, [classData.teacherId]);

  const handleScheduleChange = (day: string) => {
    setSchedule((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleEditClass = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.set("schedule", schedule.join(", "));
    await EditClass(classData.id, formData);
    router.refresh();
    setIsLoading(false);
    setDialogOpen(false);
  };

  const handleDeleteClass = async () => {
    await DeleteClass(classData.id);
    router.push("/dashboard/classes");
  };

  const presentCount =
    latestAttendance?.attendanceList?.filter((student) => student.present)
      .length || 0;
  const absentCount =
    (latestAttendance?.attendanceList?.length || 0) - presentCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/80 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 mb-4 sm:mb-0">
            {classData.subject}
          </h1>
          {isTeacher && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-primary">
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Class Settings</DialogTitle>
                  <DialogDescription>
                    Make changes to your class here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditClass}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="subject" className="text-right">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        defaultValue={classData.subject}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="room" className="text-right">
                        Room
                      </Label>
                      <Input
                        id="room"
                        name="room"
                        defaultValue={classData.room}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="schedule" className="text-right">
                        Schedule
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="schedule"
                            variant="outline"
                            className={cn(
                              "col-span-3 justify-start text-left font-normal truncate",
                              !schedule.length && "text-muted-foreground"
                            )}
                            title={schedule.join(", ")}
                          >
                            {schedule.length > 0 ? schedule.join(", ") : "Select days"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          {daysOfWeek.map((day) => (
                            <div key={day} className="flex items-center space-x-2 p-2">
                              <Checkbox
                                id={`schedule-${day}`}
                                checked={schedule.includes(day)}
                                onCheckedChange={() => handleScheduleChange(day)}
                              />
                              <label
                                htmlFor={`schedule-${day}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {day}
                              </label>
                            </div>
                          ))}
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="mt-4">
                      Delete Class
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the class and remove all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteClass}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Tabs defaultValue="attendance" className="space-y-8">
          <TabsList className="flex flex-wrap justify-start sm:justify-center gap-2 p-1 bg-muted rounded-full">
            <TabsTrigger value="attendance" className="rounded-full">
              <QrCode className="mr-2 h-4 w-4" />
              <span>Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="rounded-full">
              <Users className="mr-2 h-4 w-4" />
              <span>Students</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-full">
              <History className="mr-2 h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <Card className="bg-card/50 backdrop-blur-sm border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <QrCode className="mr-2 h-6 w-6 text-primary" />
                  Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 mb-6">
                  <div className="flex items-center space-x-4 bg-muted p-4 rounded-lg">
                    <Avatar className="w-16 h-16 ring-2 ring-primary">
                      <AvatarImage src={teacherData?.avatarUrl || "/placeholder-avatar.jpg"} alt="Teacher" />
                      <AvatarFallback>{teacherData?.name?.[0] || classData.teacherName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {classData.subject}
                      </h2>
                      <p className="text-muted-foreground">
                        Teacher: {teacherData?.name || classData.teacherName}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>Room: {classData.room}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>Schedule: {classData.schedule}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span>Students: {classData.students?.length || 0}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg flex justify-between items-center">
                    <div className="space-x-2">
                      {latestAttendance?.isActive && (
                        <>
                          <Badge variant="default" className="bg-primary text-primary-foreground">Present: {presentCount}</Badge>
                          <Badge variant="destructive">Absent: {absentCount}</Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <CreateAttendance
                  userId={user.id}
                  teacherId={classData.teacherId}
                  classId={classData.id}
                  email={user.emailAddresses[0]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card className="bg-card/50 backdrop-blur-sm border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Users className="mr-2 h-6 w-6 text-primary" />
                  Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 bg-muted p-4 rounded-lg">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">
                    Teacher
                  </h2>
                  <div className="flex items-center space-x-4">
                    <Avatar className="ring-2 ring-primary">
                      <AvatarImage src={teacherData?.avatarUrl || "/placeholder-avatar.jpg"} alt="Teacher" />
                      <AvatarFallback>{teacherData?.name?.[0] || classData.teacherName[0]}</AvatarFallback>
                    </Avatar>
                    <span>{teacherData?.name || classData.teacherName}</span>
                  </div>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold mb-4">
                  Student List
                </h2>
                <ul className="space-y-2">
                  {classData.students?.map((student, index) => (
                    <li key={index} className="flex items-center space-x-4 bg-muted p-3 rounded-lg transition-colors hover:bg-muted/80">
                      <Avatar className="ring-2 ring-primary/50">
                        <AvatarImage
                          src={studentNames[student]?.avatarUrl || `/placeholder-avatar-${index + 1}.jpg`}
                          alt={studentNames[student]?.name || student}
                        />
                        <AvatarFallback>
                          {(studentNames[student]?.name || student)[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>{studentNames[student]?.name || student}</span>
                    </li>
                  ))}
                </ul>
                {isTeacher && (
                  <div className="mt-6">
                    <AddStudent
                      classId={classData.id}
                      currentUserEmail={user.emailAddresses[0]}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-card/50 backdrop-blur-sm border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <History className="mr-2 h-6 w-6 text-primary" />
                  Attendance History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {attendanceHistory.length > 0 ? (
                  <ul className="space-y-2">
                    {attendanceHistory.map((record) => (
                      <li key={record.id}>
                        <Link
                          href={`/dashboard/classes/${classData.id}/attendance/${record.id}`}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                        >
                          <span className="mb-2 sm:mb-0 font-medium">
                            {record.createdAt.toLocaleString()}
                          </span>
                          <Badge
                            variant={record.isActive ? "default" : "secondary"}
                            className={cn(
                              "px-2 py-1 text-xs font-semibold",
                              record.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            )}
                          >
                            {record.isActive ? "Active" : "Ended"}
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-muted-foreground">No attendance records found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

