'use client'

import { Home, BookOpen, Calendar, Settings, Plus } from 'lucide-react'
import { cn } from "@/lib/utils"
import CreateClass from "@/components/CreateClass"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: BookOpen, label: "Classes", href: "/dashboard/classes" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/schedule" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function AppSidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed h-screen w-48 flex-col border-r bg-background px-4 py-4 z-50">
        <div className="flex flex-col gap-4">
          <CreateClass>
            <button className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted w-full" title="Create New Class">
              <Plus className="h-5 w-5" />
              <span>Create Class</span>
            </button>
          </CreateClass>

          <Separator className="w-full" />
          
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted"
                title={item.label}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item, index) => (
            <>
              {index === navItems.length / 2 && (
                <CreateClass>
                  <button className="rounded-full p-3 bg-primary hover:bg-primary/90" title="Create New Class">
                    <Plus className="h-6 w-6 text-primary-foreground" />
                  </button>
                </CreateClass>
              )}
              <a
                key={item.label}
                href={item.href}
                className="p-2"
                title={item.label}
              >
                <item.icon className="h-5 w-5" />
              </a>
            </>
          ))}
        </div>
      </nav>
    </>
  )
}