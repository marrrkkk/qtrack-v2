import { getAttendanceDetails } from '@/actions/classes'

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Attendance Details</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-lg mb-4">Date: {new Date(attendanceDetails.createdAt).toLocaleString()}</p>
        <p className="text-lg mb-4">Status: {attendanceDetails.isActive ? 'Active' : 'Ended'}</p>
        <h2 className="text-2xl font-semibold mb-4">Student Attendance</h2>
        {attendanceDetails.attendanceList ? (
          <ul className="space-y-2">
            {attendanceDetails.attendanceList.map((student, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <span>{student.email}</span>
                <span className={student.present ? "text-green-500" : "text-red-500"}>
                  {student.present ? "Present" : "Absent"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No attendance data available.</p>
        )}
      </div>
    </div>
  )
}