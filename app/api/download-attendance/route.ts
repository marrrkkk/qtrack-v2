import { NextRequest, NextResponse } from 'next/server'
import { getAttendanceDetails, generateAttendanceCSV } from '@/actions/classes'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')
  const attendanceId = searchParams.get('attendanceId')

  if (!id || !attendanceId) {
    return new NextResponse('Missing id or attendanceId', { status: 400 })
  }

  const attendanceDetails = await getAttendanceDetails(parseInt(id), parseInt(attendanceId))

  if (!attendanceDetails) {
    return new NextResponse('Attendance record not found', { status: 404 })
  }

  const csvContent = await generateAttendanceCSV(attendanceDetails)

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="attendance_${id}_${attendanceId}.csv"`,
    },
  })
}

