'use client'

import { Home, BookOpen, Calendar, Settings, Plus } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { useIsMobile } from '@/hooks/use-mobile'
import CreateClass from "@/components/CreateClass"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: BookOpen, label: "Classes", href: "/dashboard/classes" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/schedule" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function AppSidebar() {
  const isMobile = useIsMobile()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {!isMobile && <SidebarTrigger className="absolute right-2 top-2" />}
        <div className='mt-8'>
          <CreateClass>
            {state === 'collapsed' ? (
              <SidebarMenuButton tooltip="Create New Class">
                <Plus className="h-4 w-4" />
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton className="w-full justify-start">
                <Plus className="h-4 w-4" />
                Create New Class
              </SidebarMenuButton>
            )}
          </CreateClass>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Separator className="my-2" />
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild tooltip={item.label}>
                <a href={item.href}>
                  <item.icon className="ml-2 h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {/* Add your footer content here */}
      </SidebarFooter>
    </Sidebar>
  )
}