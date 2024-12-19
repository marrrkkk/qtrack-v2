import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, ChevronRight } from "lucide-react"
import Link from "next/link"

interface ClassCardProps {
  id: number
  teacherName: string
  subject: string
  room: string
  schedule: string
  avatar: string
}

export default function ClassCard({
  id,
  teacherName,
  subject,
  room,
  schedule,
  avatar,
}: ClassCardProps) {
  return (
    <Link href={`/dashboard/classes/${id}`}>
      <Card className="group bg-card/50 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary transition-all duration-300 group-hover:ring-4">
              <AvatarImage src={avatar} alt={teacherName} />
              <AvatarFallback>{subject[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-xl group-hover:text-primary transition-colors duration-300">
                {subject}
              </h3>
              <p className="text-sm text-muted-foreground">{teacherName}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4 text-primary" />
              Room {room}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              {schedule}
            </div>
          </div>
          <div className="flex justify-end">
            <ChevronRight className="h-5 w-5 text-primary transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

