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
  Plus
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

  const commonItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Feed", icon: Rss, url: "/feed" },
    { title: "Connections", icon: Users, url: "/connections" },
    { title: "Saved", icon: Bookmark, url: "/saved" },
  ];

  const roleItems = {
    "idea-holder": [
      { title: "My Ideas", icon: Lightbulb, url: "/my-ideas" },
      { title: "Fundraising", icon: Coins, url: "/fundraising" },
      { title: "Idea Analytics", icon: BarChart3, url: "/analytics" },
    ],
    "developer": [
      { title: "Projects", icon: Code2, url: "/projects" },
      { title: "Jobs", icon: Briefcase, url: "/jobs" },
      { title: "Applications", icon: FileText, url: "/applications" },
      { title: "My Contributions", icon: Hammer, url: "/contributions" },
    ],
    "investor": [
      { title: "Portfolio", icon: PieChart, url: "/portfolio" },
      { title: "Investments", icon: Target, url: "/investments" },
      { title: "Opportunities", icon: Rss, url: "/opportunities" },
      { title: "Funded Projects", icon: Rocket, url: "/funded" },
    ],
  };

  const createOptions = {
    "idea-holder": ["Post Idea", "Raise Fund"],
    "developer": ["Post Project", "Post Job"],
    "investor": ["Post Project", "Raise Fund"], // Optional as per prompt
  };

  const currentRoleItems = roleItems[role] || [];
  const currentCreateOptions = createOptions[role] || [];

  return (
    <Sidebar className="mt-16 border-r bg-background">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {commonItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Professional</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {currentRoleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full justify-start gap-2 shadow-lg shadow-primary/20 group relative overflow-hidden" size="lg">
               {/* Glass Reflection Animation Overlay */}
               <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
              </div>
              <Plus className="w-5 h-5 relative z-20" />
              <span className="relative z-20">Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-48">
            {currentCreateOptions.map((option) => (
              <DropdownMenuItem key={option} className="cursor-pointer">
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
