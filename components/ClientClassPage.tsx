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
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        {classData.subject}
      </h1>
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList className="flex flex-wrap justify-start sm:justify-center gap-2">
          <TabsTrigger value="attendance" className="flex-grow sm:flex-grow-0">
            <QrCode className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex-grow sm:flex-grow-0">
            <Users className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Students</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-grow sm:flex-grow-0">
            <History className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          {isTeacher && (
            <TabsTrigger value="settings" className="flex-grow sm:flex-grow-0">
              <Settings className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Teacher" />
                    <AvatarFallback>{classData.teacherName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {classData.subject}
                    </h2>
                    <p className="text-muted-foreground">
                      Teacher: {classData.teacherName}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>Room: {classData.room}</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg flex justify-between items-center">
                  <div className="space-x-2">
                    <Badge variant="secondary">
                      Students: {classData.students?.length || 0}
                    </Badge>
                    {latestAttendance?.isActive && (
                      <>
                        <Badge variant="default">Present: {presentCount}</Badge>
                        <Badge variant="destructive">
                          Absent: {absentCount}
                        </Badge>
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
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-2">
                  Teacher
                </h2>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Teacher" />
                    <AvatarFallback>{classData.teacherName[0]}</AvatarFallback>
                  </Avatar>
                  <span>{classData.teacherName}</span>
                </div>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Student List
              </h2>
              <ul className="space-y-2">
                {classData.students?.map((student, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={`/placeholder-avatar-${index + 1}.jpg`}
                        alt={student}
                      />
                      <AvatarFallback>{student[0]}</AvatarFallback>
                    </Avatar>
                    <span>{student}</span>
                  </li>
                ))}
              </ul>
              {isTeacher && (
                <div className="mt-6">
                  <AddStudent classId={classData.id} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              {attendanceHistory.length > 0 ? (
                <ul className="space-y-2">
                  {attendanceHistory.map((record) => (
                    <li key={record.id}>
                      <Link
                        href={`/dashboard/classes/${classData.id}/attendance/${record.id}`}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <span className="mb-2 sm:mb-0">
                          Date: {record.createdAt.toLocaleString()}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-semibold",
                            record.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {record.isActive ? "Active" : "Ended"}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No attendance records found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {isTeacher && (
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Class Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEditClass} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      defaultValue={classData.subject}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room">Room</Label>
                    <Input
                      type="text"
                      id="room"
                      name="room"
                      defaultValue={classData.room}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Schedule</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !schedule.length && "text-muted-foreground"
                          )}
                        >
                          {schedule.length > 0
                            ? schedule.join(", ")
                            : "Select days"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        {daysOfWeek.map((day) => (
                          <div
                            key={day}
                            className="flex items-center space-x-2 p-2"
                          >
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
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
                <div className="mt-6">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full sm:w-auto"
                      >
                        Delete Class
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the class and remove all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteClass}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
