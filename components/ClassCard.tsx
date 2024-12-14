import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, BookOpen } from 'lucide-react'
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
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/20 hover:-translate-y-1 h-full flex flex-col group">
        <CardHeader className="pb-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <BookOpen className="absolute right-2 top-2 h-12 w-12 text-primary/10 group-hover:text-primary/20 transition-colors duration-300" />
          <CardTitle className="text-lg font-bold flex items-start justify-between relative z-10">
            <span className="truncate flex-grow mr-2">{subject}</span>
            <Badge variant="secondary" className="text-xs font-normal shrink-0 shadow-sm">
              Room {room}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex-grow flex flex-col justify-between relative">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20 shrink-0 shadow-sm">
              <AvatarImage src={avatar} alt={teacherName} />
              <AvatarFallback>{teacherName[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium truncate">{teacherName}</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center group/item transition-colors duration-200 hover:text-foreground">
              <Clock className="mr-2 h-4 w-4 text-primary/70 group-hover/item:text-primary transition-colors duration-200" />
              <span className="truncate">{schedule}</span>
            </div>
            <div className="flex items-center group/item transition-colors duration-200 hover:text-foreground">
              <MapPin className="mr-2 h-4 w-4 text-primary/70 group-hover/item:text-primary transition-colors duration-200" />
              <span className="truncate">Room {room}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default ClassCard

