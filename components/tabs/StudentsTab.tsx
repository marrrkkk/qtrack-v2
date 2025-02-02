import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, X } from "lucide-react";
import AddStudent from "@/components/AddStudent";
import { Button } from "@/components/ui/button";
import { removeStudent } from "@/actions/classes";

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

interface StudentsTabProps {
  teacherData: { name: string; avatarUrl: string | null } | null;
  classData: SerializedClassData;
  studentNames: Record<string, { name: string; avatarUrl: string | null }>;
  user: SerializedUser;
  isTeacher: boolean;
}

export function StudentsTab({
  teacherData,
  classData,
  studentNames,
  user,
  isTeacher,
}: StudentsTabProps) {
  const handleRemoveStudent = async (email: string) => {
    if (
      confirm(
        `Are you sure you want to remove ${studentNames[email]?.name || email}?`
      )
    ) {
      await removeStudent(classData.id, email);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Students List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {classData.students && classData.students.length > 0 ? (
                classData.students.map((email) => {
                  const student = studentNames[email] || {
                    name: email,
                    avatarUrl: null,
                  };
                  return (
                    <div
                      key={email}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          {student.avatarUrl && (
                            <AvatarImage src={student.avatarUrl} />
                          )}
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {student.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {email}
                          </p>
                        </div>
                      </div>
                      {isTeacher && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleRemoveStudent(email)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground">
                  No students enrolled yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        {isTeacher && (
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Add Student</CardTitle>
            </CardHeader>
            <CardContent>
              <AddStudent
                classId={classData.id}
                userId={user.id}
                teacherId={classData.teacherId}
                email={user.emailAddresses[0]}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
