import { Link, useLocation } from "wouter";
import { 
  Bell, 
  MessageSquare, 
  Search, 
  User, 
  LogOut, 
  Settings,
  LayoutGrid,
  LayoutDashboard,
  Bookmark,
  Lightbulb,
  Coins,
  BarChart3,
  Hammer,
  FileText,
  Briefcase,
  Target,
  PieChart,
  Rocket
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserRole = "idea-holder" | "developer" | "investor";

export function Navbar() {
  const [location] = useLocation();
  const role = (localStorage.getItem("userRole") as UserRole) || "idea-holder";

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

  const myActivityItems = getMyActivityItems(role);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/80 backdrop-blur-md px-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/feed">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <LayoutGrid className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-display font-bold text-gradient-primary hidden md:block">DevConnect</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search projects, ideas, people..." 
            className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20 h-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-primary/5 text-primary">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 glass-card border-white/10 bg-background/40 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200" align="end" forceMount>
            <DropdownMenuLabel className="font-normal px-4 py-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none text-gradient-primary">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground font-medium">john@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <div className="p-1">
              <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                My Activity
              </DropdownMenuLabel>
              {myActivityItems.map((item) => (
                <DropdownMenuItem key={item.url} asChild className="relative overflow-hidden focus:bg-primary/10 transition-colors cursor-pointer rounded-md group/nav-item">
                  <Link href={item.url}>
                    <div className="flex items-center w-full">
                      <div className="absolute inset-0 translate-x-[-100%] group-hover/nav-item:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                      </div>
                      <item.icon className="mr-2 h-4 w-4 relative z-20 group-hover/nav-item:text-primary transition-colors" />
                      <span className="relative z-20 font-medium">{item.title}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator className="bg-white/5" />
            <div className="p-1">
              <DropdownMenuItem asChild className="relative overflow-hidden focus:bg-primary/10 transition-colors cursor-pointer rounded-md group/nav-item">
                <Link href="/settings">
                  <div className="flex items-center w-full">
                    {/* Glass Reflection Animation Overlay */}
                    <div className="absolute inset-0 translate-x-[-100%] group-hover/nav-item:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                      <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                    </div>
                    <Settings className="mr-2 h-4 w-4 relative z-20 group-hover/nav-item:text-primary transition-colors" />
                    <span className="relative z-20 font-medium">Settings</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-white/5" />
            <div className="p-1">
              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 relative overflow-hidden transition-colors cursor-pointer rounded-md group/nav-item">
                <div className="flex items-center w-full">
                  {/* Glass Reflection Animation Overlay */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover/nav-item:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                  </div>
                  <LogOut className="mr-2 h-4 w-4 relative z-20" />
                  <span className="relative z-20 font-medium">Log out</span>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
