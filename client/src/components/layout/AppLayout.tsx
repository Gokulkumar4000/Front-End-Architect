import { Navbar } from "./Navbar";
import { AppSidebar } from "./Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

type UserRole = "idea-holder" | "developer" | "investor";

interface AppLayoutProps {
  children: React.ReactNode;
  role?: UserRole;
}

export function AppLayout({ children, role: propRole }: AppLayoutProps) {
  const role = propRole || (localStorage.getItem("userRole") as UserRole) || "idea-holder";
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex w-full pt-16">
          <AppSidebar role={role} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
