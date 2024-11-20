import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Clock, MapPin } from 'lucide-react';

interface ClassType {
  id: number;
  teacherName: string;
  subject: string;
  room: string;
  schedule: string;
  avatar: string;
}

const ClassCard = ({ id, teacherName, subject, room, schedule, avatar }: ClassType) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar} alt={teacherName} />
              <AvatarFallback>{teacherName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <span className="font-medium text-sm block">{teacherName}</span>
              <span className="text-xs text-muted-foreground">Instructor</span>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {room}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Link href={`/dashboard/classes/${id}`} className="block hover:underline">
          <h2 className="font-bold text-xl mb-2 line-clamp-2">{subject}</h2>
        </Link>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          <span>{schedule}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="mr-2 h-4 w-4" />
          <span>Room {room}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link href={`/dashboard/classes/${id}`} className="text-sm font-medium text-primary hover:underline">
          View Class Details
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ClassCard;