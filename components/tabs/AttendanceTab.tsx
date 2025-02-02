import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, BookOpen } from "lucide-react";
import CreateAttendance from "@/components/CreateAttendance";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getAttendanceDetails } from "@/actions/classes";
import { getUsersByEmails } from "@/actions/user";

interface SerializedClassData {
  id: number;
  teacherName: string;
  teacherId: string;
  subject: string;
  room: string;
  schedule: string;
  students: string[] | null;
  createdAt: string;
  startDate: string;
  endDate: string;
}

interface SerializedUser {
  id: string;
  emailAddresses: string[];
  firstName: string | null;
  lastName: string | null;
}

interface AttendanceDetails {
  id: number;
  createdAt: Date;
  classId: number;
  isActive: boolean | null;
  qrCode: string | null;
  attendanceList: { email: string; present: boolean }[] | null;
}

interface AttendanceTabProps {
  teacherData: { name: string; avatarUrl: string | null } | null;
  classData: SerializedClassData;
  latestAttendance: AttendanceDetails | null;
  user: SerializedUser;
}

export function AttendanceTab({
  teacherData,
  classData,
  latestAttendance: initialLatestAttendance,
  user,
}: AttendanceTabProps) {
  const [latestAttendance, setLatestAttendance] = useState(
    initialLatestAttendance
  );
  const [userDetails, setUserDetails] = useState<
    Record<string, { name: string }>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      // Get latest attendance even if no initial attendance exists
      const latest = await getAttendanceDetails(
        classData.id,
        initialLatestAttendance?.id || 0
      );
      if (latest?.attendanceList) {
        const emails = latest.attendanceList.map((record) => record.email);
        const users = await getUsersByEmails(emails);
        setUserDetails(users);
        setLatestAttendance(latest);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [classData.id, initialLatestAttendance?.id]); // Add initialLatestAttendance dependency

  const presentCount =
    latestAttendance?.attendanceList?.filter((student) => student.present)
      .length || 0;
  const absentCount =
    (latestAttendance?.attendanceList?.length || 0) - presentCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teacher</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar>
                {teacherData?.avatarUrl && (
                  <AvatarImage src={teacherData.avatarUrl} />
                )}
                <AvatarFallback>{teacherData?.name?.[0] || "T"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  {teacherData?.name || classData.teacherName}
                </p>
                <p className="text-sm text-muted-foreground">Teacher</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.room}</div>
            <p className="text-xs text-muted-foreground">Classroom Location</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schedule</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classData.schedule.split(", ").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {classData.schedule}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subject</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.subject}</div>
            <p className="text-xs text-muted-foreground">Course Subject</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Latest Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {latestAttendance ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Created at:{" "}
                      {new Date(latestAttendance.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status:{" "}
                      <Badge
                        variant={
                          latestAttendance.isActive ? "default" : "secondary"
                        }
                      >
                        {latestAttendance.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {presentCount}
                      </div>
                      <p className="text-xs text-muted-foreground">Present</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">
                        {absentCount}
                      </div>
                      <p className="text-xs text-muted-foreground">Absent</p>
                    </div>
                  </div>
                </div>
                {latestAttendance.attendanceList && (
                  <div className="space-y-2">
                    {latestAttendance.attendanceList.map((record) => (
                      <div
                        key={record.email}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-lg",
                          record.present ? "bg-green-500/10" : "bg-red-500/10"
                        )}
                      >
                        <span>
                          {userDetails[record.email]?.name || record.email}
                        </span>
                        <Badge
                          variant={record.present ? "default" : "destructive"}
                        >
                          {record.present ? "Present" : "Absent"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No attendance records found.
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Take Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateAttendance
              classId={classData.id}
              userId={user.id}
              teacherId={classData.teacherId}
              email={user.emailAddresses[0]}
            />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
