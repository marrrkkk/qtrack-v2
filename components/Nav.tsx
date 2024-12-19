import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Button } from "./ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"

const Nav = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Qtrack
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton>
                <Button 
                  variant="ghost" 
                  className="rounded-xl font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  Log in
                </Button>
              </SignInButton>
              <SignUpButton forceRedirectUrl={'/select-role'}>
                <Button 
                  className="rounded-xl font-medium shadow-lg hover:shadow-primary/25 transition-all"
                >
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all",
                    userButtonPopoverCard: "shadow-lg rounded-xl border-border bg-card/95 backdrop-blur",
                    userButtonPopoverActionButton: "hover:bg-primary/10 hover:text-primary transition-colors rounded-lg",
                    userButtonPopoverActionButtonText: "font-medium",
                    userButtonPopoverFooter: "hidden"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav

