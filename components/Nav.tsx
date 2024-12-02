import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Button } from "./ui/button"
import Link from "next/link"

const Nav = () => {
  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">Qtrack</h1>
            </Link>
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

