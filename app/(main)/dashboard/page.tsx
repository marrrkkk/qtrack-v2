import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const Dashboard = async () => {
  const user = await currentUser();
  return(
    <div>
      <h1>Welcome</h1>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

export default Dashboard;