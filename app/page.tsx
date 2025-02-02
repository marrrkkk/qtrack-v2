'use client'

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Nav from "@/components/Nav"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/80">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
            >
              <span className="block text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Qtrack
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl mt-2 text-muted-foreground">
                QR Code-Based Attendance for Schools
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Simplify attendance tracking with Qtrack. Our innovative QR code system makes it easy for schools to manage student attendance efficiently and accurately.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex justify-center gap-4"
          >
            <SignedOut>
              <SignUpButton>
                <Button size="lg" className="rounded-full px-8">
                  Get Started
                </Button>
              </SignUpButton>
              <SignInButton>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Log In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="rounded-full px-8">Go to Dashboard</Button>
              </Link>
            </SignedIn>
          </motion.div>

          {/* Features Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 w-full max-w-5xl"
          >
            <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { 
                  title: "Generate QR Codes",
                  description: "Create unique QR codes for each class.",
                  icon: "🎯"
                },
                { 
                  title: "Students Scan",
                  description: "Students scan the QR code with their devices to mark attendance.",
                  icon: "📱"
                },
                { 
                  title: "Instant Tracking",
                  description: "View latest attendance data and generate reports easily.",
                  icon: "📊"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="text-4xl mb-4">{step.icon}</span>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden sm:block">
                    {index < 2 && (
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <ChevronRight className="h-6 w-6 text-primary" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="py-4 bg-muted mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">&copy; 2024 Qtrack. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

