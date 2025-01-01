import { SidebarProvider } from "@/components/ui/sidebar";
import { QuranSidebar } from "./QuranSidebar";

export const QuranLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950">
        <QuranSidebar />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};