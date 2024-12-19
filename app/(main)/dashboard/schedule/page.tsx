'use client'

import { useState, useEffect } from 'react'
import { useUser } from "@clerk/nextjs"
import { format } from 'date-fns'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Users, MapPin, BookOpen, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { getAllClasses } from "@/actions/classes"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Class {
  id: number
  teacherName: string
  teacherId: string
  subject: string
  room: string
  schedule: string
  startDate: Date
  endDate: Date
  students: string[] | null
  createdAt: Date
}

function ClassSchedule() {
  const { user } = useUser()
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())

  useEffect(() => {
    const fetchClasses = async () => {
      if (user) {
        const fetchedClasses = await getAllClasses(user.id)
        setClasses(fetchedClasses.map(cls => ({
          ...cls,
          startDate: new Date(cls.startDate),
          endDate: new Date(cls.endDate)
        })))
      }
    }
    fetchClasses()
  }, [user])

  const getClassesForDay = (day: Date) => {
    const dayName = day.toLocaleDateString('en-US', { weekday: 'long' })
    
    console.log('Current day info:', {
      fullDate: day,
      dayName,
      formattedDate: day.toLocaleDateString(),
      isoString: day.toISOString()
    })

    return classes.filter(cls => {
      const classStartDate = new Date(cls.startDate)
      const classEndDate = new Date(cls.endDate)
      
      // Reset time components for accurate date comparison
      const compareDate = new Date(day.getFullYear(), day.getMonth(), day.getDate())
      const startDate = new Date(classStartDate.getFullYear(), classStartDate.getMonth(), classStartDate.getDate())
      const endDate = new Date(classEndDate.getFullYear(), classEndDate.getMonth(), classEndDate.getDate())
      
      const isWithinDateRange = compareDate >= startDate && compareDate <= endDate
      console.log({
        class: cls.subject,
        dayName,
        schedule: cls.schedule,
        isWithinDateRange,
        compareDate,
        startDate,
        endDate
      })
      
      return cls.schedule.includes(dayName) && isWithinDateRange
    })
  }

  const isDayWithClass = (day: Date) => {
    return getClassesForDay(day).length > 0
  }

  const selectedDayClasses = getClassesForDay(selectedDay)

  const nextDay = () => {
    setSelectedDay(prev => {
      const next = new Date(prev)
      next.setDate(next.getDate() + 1)
      return next
    })
  }

  const prevDay = () => {
    setSelectedDay(currentDay => {
      const newDate = new Date(currentDay)
      newDate.setDate(newDate.getDate() - 1)
      return newDate
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/80 pt-20 md:pt-12 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 flex items-center justify-center sm:justify-start">
          <CalendarDays className="mr-2 sm:mr-4 h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Class Schedule
          </h1>
        </div>

        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="ghost"
                onClick={prevDay}
                className="text-primary hover:text-primary hover:bg-primary/10"
              >
                <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[180px] sm:w-[240px] justify-start text-left font-normal text-sm sm:text-base",
                      !selectedDay && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    {selectedDay ? format(selectedDay, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDay}
                    onSelect={(day) => day && setSelectedDay(day)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                onClick={nextDay}
                className="text-primary hover:text-primary hover:bg-primary/10"
              >
                <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
              </Button>
            </div>

            {selectedDayClasses.length > 0 ? (
              <motion.div 
                className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {selectedDayClasses.map((cls) => (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">{cls.subject}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                              <MapPin className="mr-1 h-3 w-3" /> Room {cls.room}
                            </p>
                          </div>
                          <Badge variant="secondary" className="transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                            <Users className="mr-1 h-3 w-3" />
                            {cls.students?.length || 0}
                          </Badge>
                        </div>
                        <Button 
                          className="w-full mt-4 bg-primary hover:bg-primary/90 text-white"
                          size="sm"
                        >
                          <BookOpen className="mr-2 h-4 w-4" /> Start Class
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-8 sm:py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <BookOpen className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-primary mb-3 sm:mb-4" />
                <p className="text-gray-900 dark:text-white text-base sm:text-lg font-medium">No classes scheduled for today</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-2">Enjoy your free time or prepare for upcoming classes!</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ClassSchedule

