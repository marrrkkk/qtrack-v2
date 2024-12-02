import { AppSidebar } from "@/components/AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AppSidebar />
      <main className="flex-1 md:ml-48 min-h-screen pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
}
