import { AppSidebar } from "./_components/app-sidebar";
import { SiteHeader } from "./_components/site-header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const SystemLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider
      className="h-svh overflow-hidden"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="h-full overflow-hidden">
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SystemLayout;
