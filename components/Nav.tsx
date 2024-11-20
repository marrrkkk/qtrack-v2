import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Button } from "./ui/button"
import Link from "next/link"

const Nav = () => {
  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">Qtrack</h1>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-6">
                <Link href="#features" className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Features</Link>
                <Link href="#pricing" className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Pricing</Link>
                <Link href="#contact" className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <SignedOut>
              <Button variant="ghost" className="mr-2">
                <SignInButton>Log in</SignInButton>
              </Button>
              <Button>
                <SignUpButton forceRedirectUrl={'/select-role'}>Get Started</SignUpButton>
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav