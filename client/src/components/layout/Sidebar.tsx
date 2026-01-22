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
  Zap,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

type UserRole = "idea-holder" | "developer" | "investor";

interface AppSidebarProps {
  role?: UserRole;
}

export function AppSidebar({ role = "idea-holder" }: AppSidebarProps) {
  const [location] = useLocation();

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

  const createOptions = {
    "idea-holder": ["Post Idea", "Raise Fund"],
    "developer": ["Post Project", "Post Job"],
    "investor": ["Raise Fund"],
  };

  const generalItems = getGeneralItems(role);
  const currentCreateOptions = createOptions[role] || [];

  return (
    <>
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex mt-16 border-r bg-background">
        <div className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full justify-start gap-2 shadow-lg shadow-primary/20 group relative overflow-hidden h-11" size="default">
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

          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              My Activity
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {getMyActivityItems(role).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location === item.url} tooltip={item.title} className="relative overflow-hidden transition-all group/sidebar-item">
                      <Link href={item.url}>
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

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-t px-4 flex items-center justify-between">
        {generalItems.slice(0, 2).map((item) => (
          <Link key={item.url} href={item.url}>
            <button className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              location === item.url ? "text-primary" : "text-muted-foreground"
            )}>
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.title}</span>
            </button>
          </Link>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="h-12 w-12 rounded-full shadow-lg shadow-primary/20 -mt-8 border-4 border-background">
              <Plus className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48 glass-card border-white/10 bg-background/40 backdrop-blur-xl shadow-2xl">
            {currentCreateOptions.map((option) => (
              <DropdownMenuItem key={option} className="cursor-pointer py-3">
                <span className="font-medium">{option}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {generalItems.slice(2, 4).map((item) => (
          <Link key={item.url} href={item.url}>
            <button className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              location === item.url ? "text-primary" : "text-muted-foreground"
            )}>
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.title}</span>
            </button>
          </Link>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              location === "/profile" ? "text-primary" : "text-muted-foreground"
            )}>
              <User className="w-6 h-6" />
              <span className="text-[10px] font-medium">Profile</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-card border-white/10 bg-background/40 backdrop-blur-xl shadow-2xl">
            <DropdownMenuLabel className="px-4 py-3 border-b border-white/5">
              <p className="text-sm font-bold text-gradient-primary">John Doe</p>
              <p className="text-[10px] text-muted-foreground">My Account</p>
            </DropdownMenuLabel>
            <div className="p-1">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>View Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-white/5" />
            <div className="p-1">
              <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                My Activity
              </DropdownMenuLabel>
              {getMyActivityItems(role).map((item) => (
                <DropdownMenuItem key={item.url} asChild>
                  <Link href={item.url} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator className="bg-white/5" />
            <div className="p-1">
              <DropdownMenuItem className="text-destructive flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
