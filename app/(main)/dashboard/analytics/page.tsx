import { getAllClasses } from "@/actions/classes";
import { auth } from "@clerk/nextjs/server";
import ClientAnalyticsPage from "@/components/ClientAnalyticsPage";
import { TrendingUp } from "lucide-react";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) return null;
  
  const classes = await getAllClasses(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/80 pt-20 md:pt-12 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 flex items-center justify-center sm:justify-start">
          <TrendingUp className="mr-4 h-10 w-10 text-primary" />
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Analytics
          </h1>
        </div>
        
        <ClientAnalyticsPage classes={classes} />
      </div>
    </div>
  )
} 