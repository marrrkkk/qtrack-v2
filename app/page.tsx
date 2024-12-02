import Nav from "@/components/Nav"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block text-primary">Qtrack</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl mt-2">QR Code-Based Attendance for Schools</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Simplify attendance tracking with Qtrack. Our innovative QR code system makes it easy for schools to manage student attendance efficiently and accurately.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <SignedOut>
              <Button size="lg">
                <SignUpButton>Get Started</SignUpButton>
              </Button>
              <Button size="lg" variant="outline">
                <SignInButton>Log In</SignInButton>
              </Button>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            </SignedIn>
          </div>
        </div>

        <div className="mt-16 w-full max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { title: "Generate QR Codes", description: "Create unique QR codes for each class or event." },
              { title: "Students Scan", description: "Students scan the QR code with their devices to mark attendance." },
              { title: "Instant Tracking", description: "View real-time attendance data and generate reports easily." }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-4 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">&copy; 2024 Qtrack. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

