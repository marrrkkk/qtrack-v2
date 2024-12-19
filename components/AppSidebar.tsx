"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Calendar, TrendingUp, Plus, GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";
import CreateClass from "@/components/CreateClass";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: BookOpen, label: "Classes", href: "/dashboard/classes" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/schedule" },
  { icon: TrendingUp, label: "Analytics", href: "/dashboard/analytics" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={mounted ? false : { x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex fixed h-screen w-48 flex-col border-r bg-card px-4 py-5 z-50"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Qtrack
              </span>
            </div>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all",
                  userButtonPopoverCard: "shadow-lg rounded-xl border-border bg-card/95 backdrop-blur",
                  userButtonPopoverActionButton: "hover:bg-primary/10 hover:text-primary transition-colors rounded-lg",
                  userButtonPopoverActionButtonText: "font-medium",
                  userButtonPopoverFooter: "hidden"
                }
              }}
            />
          </div>

          <CreateClass>
            <Button
              variant="default"
              className="w-full justify-start text-sm rounded-xl bg-primary hover:bg-primary/90"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Class
            </Button>
          </CreateClass>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-3 py-2 text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-md"
                      : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Mobile Top Bar */}
      <motion.div
        initial={mounted ? false : { y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="md:hidden fixed top-0 left-0 right-0 border-b bg-background px-4 py-3 z-50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Qtrack
            </span>
          </div>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all",
                userButtonPopoverCard: "shadow-lg rounded-xl border-border bg-card/95 backdrop-blur",
                userButtonPopoverActionButton: "hover:bg-primary/10 hover:text-primary transition-colors rounded-lg",
                userButtonPopoverActionButtonText: "font-medium",
                userButtonPopoverFooter: "hidden"
              }
            }}
          />
        </div>
      </motion.div>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        initial={mounted ? false : { y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-3 z-50"
      >
        <div className="flex items-center justify-around">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <React.Fragment key={item.label}>
                {index === Math.floor(navItems.length / 2) && (
                  <CreateClass>
                    <Button
                      size="icon"
                      className="rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                      variant="default"
                    >
                      <Plus className="h-5 w-5" />
                      <span className="sr-only">Create New Class</span>
                    </Button>
                  </CreateClass>
                )}
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center p-1 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                  title={item.label}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
