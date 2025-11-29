import { AppSidebar } from '@/components/app-sidebar';
import { AppProvider } from '@/contexts/app-provider';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <div className="relative min-h-screen w-full bg-background font-body text-foreground">
        <div className="animated-background" />
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />
          <SidebarInset>
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </AppProvider>
  );
}
