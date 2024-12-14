"use client"

import React, { useState } from "react"
import { AddNewClass } from "@/actions/classes"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Loader2, BookOpen, MapPin, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

interface CreateClassProps {
  children: React.ReactNode
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function CreateClass({ children }: CreateClassProps = { children: null }) {
  const [subject, setSubject] = useState("")
  const [room, setRoom] = useState("")
  const [schedule, setSchedule] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()

  const handleScheduleChange = (day: string) => {
    setSchedule((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (schedule.length === 0 || !startDate || !endDate) {
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("subject", subject)
    formData.append("room", room)
    formData.append("schedule", schedule.join(", "))
    formData.append("startDate", startDate.toISOString())
    formData.append("endDate", endDate.toISOString())

    try {
      await AddNewClass(formData)
      setTimeout(() => {
        setSubject("")
        setRoom("")
        setSchedule([])
        setOpen(false)
        setIsLoading(false)
      }, 1000) // Simulating a delay for the loading state to be visible
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Create New Class
          </DialogTitle>
          <DialogDescription>
            Add a new class to your schedule. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-2"
            >
              <Label htmlFor="subject" className="text-sm font-medium">
                Subject
              </Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject name"
                  required
                  className="pl-10"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="grid gap-2"
            >
              <Label htmlFor="room" className="text-sm font-medium">
                Room
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Enter room number"
                  required
                  className="pl-10"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="grid gap-2"
            >
              <Label className="text-sm font-medium">Schedule</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !schedule.length && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {schedule.length > 0 ? schedule.join(", ") : "Select days"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  {daysOfWeek.map((day) => (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center space-x-2 p-2 hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={day}
                        checked={schedule.includes(day)}
                        onCheckedChange={() => handleScheduleChange(day)}
                      />
                      <label
                        htmlFor={day}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                      >
                        {day}
                      </label>
                    </motion.div>
                  ))}
                </PopoverContent>
              </Popover>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="grid gap-2"
            >
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  id="startDate"
                  required
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="pl-10"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="grid gap-2"
            >
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  id="endDate"
                  required
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  className="pl-10"
                />
              </div>
            </motion.div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading || schedule.length === 0}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Class"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

