import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

interface AttendanceRecord {
  id: number;
  createdAt: Date;
  isActive: boolean | null;
}

interface HistoryTabProps {
  attendanceHistory: AttendanceRecord[];
  classData: SerializedClassData;
}

export function HistoryTab({ attendanceHistory, classData }: HistoryTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceHistory.length > 0 ? (
            <div className="space-y-8">
              {attendanceHistory.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {new Date(record.createdAt).toLocaleString()}
                    </p>
                    <div className="flex items-center pt-2">
                      <Badge
                        variant={record.isActive ? "default" : "secondary"}
                      >
                        {record.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/classes/${classData.id}/attendance/${record.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4 inline" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No attendance history available.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
