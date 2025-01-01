import { SidebarProvider } from "@/components/ui/sidebar";
import { QuranSidebar } from "@/components/layout/QuranSidebar";
import QuranNavigation from "@/components/quran/QuranNavigation";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950">
        <QuranSidebar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-2 text-emerald-800 dark:text-emerald-200">
              The Noble Quran
            </h1>
            <p className="text-center mb-8 text-muted-foreground">
              Read, study, and learn The Noble Quran
            </p>
            <QuranNavigation />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;