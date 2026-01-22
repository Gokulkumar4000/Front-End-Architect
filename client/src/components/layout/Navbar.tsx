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
  Rocket,
  Menu
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetSeparator
} from "@/components/ui/sheet";

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
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover-elevate active-elevate-2 p-0 overflow-hidden">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-primary/5 text-primary">JD</AvatarFallback>
              </Avatar>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 glass-card border-white/10 bg-background/40 backdrop-blur-xl shadow-2xl p-0">
            <SheetHeader className="font-normal px-6 py-8 border-b border-white/5 text-left">
              <SheetTitle>
                <div className="flex flex-col space-y-1">
                  <p className="text-lg font-bold leading-none text-gradient-primary">John Doe</p>
                  <p className="text-sm leading-none text-muted-foreground font-medium">john@example.com</p>
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="p-4 space-y-6">
                <div>
                  <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">
                    My Activity
                  </p>
                  <div className="space-y-1">
                    {myActivityItems.map((item) => (
                      <Link key={item.url} href={item.url}>
                        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-primary/10 transition-all text-sm font-medium group relative overflow-hidden">
                          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                          </div>
                          <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="group-hover:text-primary transition-colors">{item.title}</span>
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>

                <SheetSeparator className="bg-white/5" />

                <div className="space-y-1">
                  <Link href="/settings">
                    <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-primary/10 transition-all text-sm font-medium group relative overflow-hidden">
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                      </div>
                      <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="group-hover:text-primary transition-colors">Settings</span>
                    </button>
                  </Link>
                </div>
              </div>

              <div className="mt-auto p-4 border-t border-white/5 pb-10">
                <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-all text-sm font-bold group relative overflow-hidden">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                  </div>
                  <LogOut className="w-5 h-5" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
