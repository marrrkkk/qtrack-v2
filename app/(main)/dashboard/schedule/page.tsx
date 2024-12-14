'use client'

import { useState, useEffect } from 'react'
import { useUser } from "@clerk/nextjs"
import { DayPicker } from 'react-day-picker'
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Users, MapPin } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { getAllClasses } from "@/actions/classes"
import { motion } from "framer-motion"

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
  const [selectedDay, setSelectedDay] = useState<Date>()

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
    return classes.filter(cls => {
      const dayName = day.toLocaleDateString('en-US', { weekday: 'long' })
      const isWithinDateRange = day >= cls.startDate && day <= cls.endDate
      return cls.schedule.includes(dayName) && isWithinDateRange
    })
  }

  const isDayWithClass = (day: Date) => {
    return getClassesForDay(day).length > 0
  }

  const selectedDayClasses = selectedDay ? getClassesForDay(selectedDay) : []

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 text-center text-foreground">
          Class Schedule
        </h1>
        
        <div className="grid md:grid-cols-7 gap-8">
          <Card className="md:col-span-3 shadow-sm">
            <CardContent className="p-4">
              <DayPicker
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                modifiers={{ hasClass: isDayWithClass }}
                modifiersStyles={{
                  hasClass: {
                    fontWeight: 'bold',
                    color: 'hsl(var(--primary))',
                  }
                }}
                className="mx-auto"
                classNames={{
                  months: "flex flex-col space-y-4",
                  month: "space-y-4",
                  caption: "flex justify-between pt-1 relative items-center px-2",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 transition-opacity",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm relative p-0 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-4 shadow-sm">
            <CardContent className="p-4">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                {selectedDay ? (
                  `${selectedDay.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}`
                ) : (
                  "Select a date"
                )}
              </h2>
              
              {selectedDayClasses.length > 0 ? (
                <motion.div 
                  className="space-y-4"
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
                      <div className="p-3 border-l-2 border-primary bg-background hover:bg-accent/5 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-base">{cls.subject}</h3>
                            <p className="text-sm text-muted-foreground flex items-center mt-1">
                              <MapPin className="mr-1 h-3 w-3" /> Room {cls.room}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            <Users className="mr-1 h-3 w-3" />
                            {cls.students?.length || 0}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.p 
                  className="text-muted-foreground text-center py-8 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedDay ? "No classes scheduled" : "Select a date to view classes"}
                </motion.p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ClassSchedule

