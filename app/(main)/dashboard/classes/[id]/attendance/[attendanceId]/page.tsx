import { getAttendanceDetails } from '@/actions/classes'
import { getUsersByEmails } from '@/actions/user'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Calendar, Users, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface AttendanceDetails {
  createdAt: string;
  isActive: boolean;
  attendanceList: { email: string; present: boolean }[] | null;
}

export default async function AttendanceDetailsPage({ params }: { params: { id: string, attendanceId: string } }) {
  const attendanceDetails = await getAttendanceDetails(parseInt(params.id), parseInt(params.attendanceId)) as AttendanceDetails | null

  if (!attendanceDetails) {
    return <div>Attendance record not found.</div>
  }

  const emails = attendanceDetails.attendanceList?.map(student => student.email) || []
  console.log("Emails being fetched:", emails);
  
  const userDetails = await getUsersByEmails(emails)
  console.log("User details received:", userDetails);

  return (
    <div className="container mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold text-gray-800">Attendance Details</CardTitle>
            <Button asChild variant="outline" className="flex items-center gap-2">
              <a href={`/api/download-attendance?id=${params.id}&attendanceId=${params.attendanceId}`} download>
                <Download className="h-4 w-4" />
                Download CSV
              </a>
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(attendanceDetails.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Status: {attendanceDetails.isActive ? 'Active' : 'Ended'}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Student Attendance</h2>
          {attendanceDetails.attendanceList ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceDetails.attendanceList.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userDetails[student.email]?.avatarUrl || ''} />
                        <AvatarFallback>
                          {userDetails[student.email]?.name?.[0] || student.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{userDetails[student.email]?.name || student.email}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`flex items-center ${student.present ? "text-green-500" : "text-red-500"}`}>
                        {student.present ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Present
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Absent
                          </>
                        )}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-600 italic">No attendance data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

