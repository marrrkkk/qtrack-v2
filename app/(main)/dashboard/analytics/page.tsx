import { getAllClasses } from "@/actions/classes";
import { auth } from "@clerk/nextjs/server";
import ClientAnalyticsPage from "@/components/ClientAnalyticsPage";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) return null;
  
  const classes = await getAllClasses(userId);

  return <ClientAnalyticsPage classes={classes} />;
} 