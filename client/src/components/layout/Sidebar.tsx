import { 
  LayoutDashboard, 
  Rss, 
  Users, 
  Bookmark,
  Lightbulb,
  Coins,
  BarChart3,
  Code2,
  Briefcase,
  FileText,
  Hammer,
  PieChart,
  Target,
  Rocket,
  Plus,
  Search,
  Zap
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserRole = "idea-holder" | "developer" | "investor";

interface AppSidebarProps {
  role?: UserRole;
}

export function AppSidebar({ role = "idea-holder" }: AppSidebarProps) {
  const [location] = useLocation();

  // 1️⃣ GENERAL SECTION (DISCOVERY / EXPLORE)
  const getGeneralItems = (role: UserRole) => {
    const base = [
      { title: "Feed", icon: Rss, url: "/feed" },
      { title: "Connections", icon: Users, url: "/connections" },
    ];

    switch (role) {
      case "idea-holder":
        return [
          ...base,
          { title: "Projects", icon: Code2, url: "/projects" },
          { title: "Fundings", icon: Coins, url: "/fundings" },
        ];
      case "developer":
        return [
          ...base,
          { title: "Projects", icon: Code2, url: "/projects" },
          { title: "Jobs", icon: Briefcase, url: "/jobs" },
          { title: "Fundings", icon: Coins, url: "/fundings" },
        ];
      case "investor":
        return [
          ...base,
          { title: "Projects", icon: Code2, url: "/projects" },
          { title: "Fundings", icon: Coins, url: "/fundings" },
          { title: "Opportunities", icon: Zap, url: "/opportunities" },
        ];
      default:
        return base;
    }
  };

  // 2️⃣ MY ACTIVITY SECTION (PERSONAL / OWNED)
  const getMyActivityItems = (role: UserRole) => {
    const base = [
      { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
      { title: "Saved", icon: Bookmark, url: "/saved" },
    ];

    switch (role) {
      case "idea-holder":
        return [
          ...base,
          { title: "My Ideas", icon: Lightbulb, url: "/my-ideas" },
          { title: "My Fundraising", icon: Coins, url: "/my-fundraising" },
          { title: "Idea Analytics", icon: BarChart3, url: "/analytics" },
        ];
      case "developer":
        return [
          ...base,
          { title: "My Projects", icon: Hammer, url: "/my-projects" },
          { title: "Applied Jobs", icon: Briefcase, url: "/applied-jobs" },
          { title: "Applications Received", icon: FileText, url: "/applications-received" },
        ];
      case "investor":
        return [
          ...base,
          { title: "My Investments", icon: Target, url: "/my-investments" },
          { title: "Portfolio", icon: PieChart, url: "/portfolio" },
          { title: "Funded Projects", icon: Rocket, url: "/funded" },
        ];
      default:
        return base;
    }
  };

  // 3️⃣ CREATE BUTTON OPTIONS
  const createOptions = {
    "idea-holder": ["Post Idea", "Raise Fund"],
    "developer": ["Post Project", "Post Job"],
    "investor": ["Raise Fund"],
  };

  const generalItems = getGeneralItems(role);
  const myActivityItems = getMyActivityItems(role);
  const currentCreateOptions = createOptions[role] || [];

  return (
    <Sidebar className="mt-16 border-r bg-background">
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full justify-start gap-2 shadow-lg shadow-primary/20 group relative overflow-hidden h-11" size="default">
               {/* Glass Reflection Animation Overlay */}
               <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
              </div>
              <Plus className="w-5 h-5 relative z-20" />
              <span className="relative z-20 font-bold">Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-48 glass-card border-white/10 bg-background/40 backdrop-blur-xl shadow-2xl">
            {currentCreateOptions.map((option) => (
              <DropdownMenuItem key={option} className="cursor-pointer group relative overflow-hidden py-2 focus:bg-primary/10">
                {/* Glass Reflection Animation Overlay */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                </div>
                <span className="relative z-20 font-medium">{option}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <SidebarContent>
        {/* GENERAL Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} tooltip={item.title} className="relative overflow-hidden transition-all group/sidebar-item">
                    <Link href={item.url}>
                      {/* Glass Reflection Animation Overlay */}
                      <div className="absolute inset-0 translate-x-[-100%] group-hover/sidebar-item:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                      </div>
                      <item.icon className="relative z-20 group-hover/sidebar-item:text-primary transition-colors" />
                      <span className="relative z-20 group-hover/sidebar-item:text-primary transition-colors">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* MY ACTIVITY Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            My Activity
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {myActivityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} tooltip={item.title} className="relative overflow-hidden transition-all group/sidebar-item">
                    <Link href={item.url}>
                      {/* Glass Reflection Animation Overlay */}
                      <div className="absolute inset-0 translate-x-[-100%] group-hover/sidebar-item:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                      </div>
                      <item.icon className="relative z-20 group-hover/sidebar-item:text-primary transition-colors" />
                      <span className="relative z-20 group-hover/sidebar-item:text-primary transition-colors">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
