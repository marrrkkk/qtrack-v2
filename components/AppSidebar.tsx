'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Calendar, Settings, Plus } from 'lucide-react'
import { cn } from "@/lib/utils"
import CreateClass from "@/components/CreateClass"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: BookOpen, label: "Classes", href: "/dashboard/classes" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/schedule" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed h-screen w-48 flex-col border-r bg-card px-4 py-5 z-50">
        <div className="flex flex-col gap-6">
          <CreateClass>
            <Button variant="outline" className="w-full justify-start text-sm" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Class
            </Button>
          </CreateClass>
          
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-3 z-50">
        <div className="flex items-center justify-around">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <React.Fragment key={item.label}>
                {index === Math.floor(navItems.length / 2) && (
                  <CreateClass>
                    <Button size="icon" className="rounded-full" variant="default">
                      <Plus className="h-5 w-5" />
                      <span className="sr-only">Create New Class</span>
                    </Button>
                  </CreateClass>
                )}
                <a
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center p-1 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title={item.label}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </a>
              </React.Fragment>
            )
          })}
        </div>
      </nav>
    </>
  )
}

