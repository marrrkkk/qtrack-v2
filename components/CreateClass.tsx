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
import { Loader2 } from 'lucide-react'

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

  const handleScheduleChange = (day: string) => {
    setSchedule((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (schedule.length === 0) {
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("subject", subject)
    formData.append("room", room)
    formData.append("schedule", schedule.join(", "))

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
          <DialogTitle>Create New Class</DialogTitle>
          <DialogDescription>Add a new class to your schedule. Fill in the details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Enter room number"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Schedule</Label>
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
                    {schedule.length > 0 ? schedule.join(", ") : "Select days"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center space-x-2 p-2">
                      <Checkbox
                        id={day}
                        checked={schedule.includes(day)}
                        onCheckedChange={() => handleScheduleChange(day)}
                      />
                      <label
                        htmlFor={day}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {day}
                      </label>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || schedule.length === 0}>
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