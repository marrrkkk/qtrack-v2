import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from 'lucide-react'
import Link from "next/link"

interface ClassCardProps {
  id: number
  teacherName: string
  subject: string
  room: string
  schedule: string
  avatar: string
}

const ClassCard = ({ id, teacherName, subject, room, schedule, avatar }: ClassCardProps) => {
  return (
    <Link href={`/dashboard/classes/${id}`} className="block h-full">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/20 hover:-translate-y-1 h-full flex flex-col">
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="text-lg font-bold flex items-center justify-between">
            <span className="truncate">{subject}</span>
            <Badge variant="outline" className="ml-2 text-xs font-normal shrink-0">
              Room {room}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex-grow flex flex-col justify-between">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20 shrink-0">
              <AvatarImage src={avatar} alt={teacherName} />
              <AvatarFallback>{teacherName[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium truncate">{teacherName}</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{schedule}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-primary shrink-0" />
              <span className="truncate">Room {room}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default ClassCard
