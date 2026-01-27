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
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MOCK_USERS } from "@/mocks/users";

type UserRole = "idea-holder" | "developer" | "investor";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const role = (localStorage.getItem("userRole") as UserRole) || "idea-holder";
  const username = localStorage.getItem("username");
  
  const currentUser = MOCK_USERS.find(u => u.username === username) || {
    name: "Guest User",
    username: "guest",
    avatar: "",
    role: "idea-holder"
  };

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setLocation("/login");
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
            id="search-input"
            placeholder="Search projects, ideas, people..." 
            className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20 h-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Link href="/chat">
          <Button variant="ghost" size="icon" className="relative group/nav-icon">
            <MessageSquare className="w-5 h-5 group-hover/nav-icon:text-primary transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 glass-card border-white/10 bg-background/40 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200" align="end" forceMount>
            <DropdownMenuLabel className="font-normal px-3 py-2 flex items-center justify-between">
              <span className="text-xs font-bold text-gradient-primary">Notifications</span>
              <span className="text-[10px] text-muted-foreground">3 new</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              <div className="px-2 py-1.5 hover:bg-primary/10 cursor-pointer rounded-md mx-1 my-0.5 group">
                <div className="flex gap-2 w-full items-start">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">New collaboration request</p>
                    <p className="text-[10px] text-muted-foreground truncate">Sarah wants to join your project</p>
                    <p className="text-[9px] text-muted-foreground/60 mt-0.5">2 min ago</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded" data-testid="button-dismiss-notification-1">
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </div>
              <div className="px-2 py-1.5 hover:bg-primary/10 cursor-pointer rounded-md mx-1 my-0.5 group">
                <div className="flex gap-2 w-full items-start">
                  <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Coins className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">Investment received</p>
                    <p className="text-[10px] text-muted-foreground truncate">You received $5,000 for AI Tutor</p>
                    <p className="text-[9px] text-muted-foreground/60 mt-0.5">1 hour ago</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded" data-testid="button-dismiss-notification-2">
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </div>
              <div className="px-2 py-1.5 hover:bg-primary/10 cursor-pointer rounded-md mx-1 my-0.5 group">
                <div className="flex gap-2 w-full items-start">
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">New message from Alex</p>
                    <p className="text-[10px] text-muted-foreground truncate">Hey, I loved your idea about...</p>
                    <p className="text-[9px] text-muted-foreground/60 mt-0.5">3 hours ago</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded" data-testid="button-dismiss-notification-3">
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </div>
              <div className="px-2 py-1.5 hover:bg-primary/10 cursor-pointer rounded-md mx-1 my-0.5 bg-muted/20 group">
                <div className="flex gap-2 w-full items-start">
                  <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">Milestone achieved</p>
                    <p className="text-[10px] text-muted-foreground truncate">Your project reached 100 views</p>
                    <p className="text-[9px] text-muted-foreground/60 mt-0.5">Yesterday</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded" data-testid="button-dismiss-notification-4">
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Desktop Profile Dropdown */}
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover-elevate active-elevate-2 p-0 overflow-hidden">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-primary/5 text-primary">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass-card border-white/10 bg-background/40 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200" align="end" forceMount>
              <DropdownMenuLabel className="font-normal px-4 py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none text-gradient-primary">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground font-medium">@{currentUser.username}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <div className="p-1">
                <DropdownMenuItem asChild className="relative overflow-hidden focus:bg-primary/10 transition-colors cursor-pointer rounded-md group/nav-item">
                  <Link href="/profile">
                    <div className="flex items-center w-full">
                      <div className="absolute inset-0 translate-x-[-100%] group-hover/nav-item:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                      </div>
                      <User className="mr-2 h-4 w-4 relative z-20 group-hover/nav-item:text-primary transition-colors" />
                      <span className="relative z-20 font-medium">Profile</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-white/5 my-1" />
                
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
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 relative overflow-hidden transition-colors cursor-pointer rounded-md group/nav-item"
                >
                  <div className="flex items-center w-full">
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

        {/* Mobile Profile Sheet */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover-elevate active-elevate-2 p-0 overflow-hidden">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-primary/5 text-primary">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 glass-card border-white/10 bg-background/40 backdrop-blur-xl shadow-2xl p-0">
              <SheetHeader className="font-normal px-6 py-8 border-b border-white/5 text-left">
                <SheetTitle>
                  <div className="flex flex-col space-y-1">
                    <p className="text-lg font-bold leading-none text-gradient-primary">{currentUser.name}</p>
                    <p className="text-sm leading-none text-muted-foreground font-medium">@{currentUser.username}</p>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full overflow-y-auto">
                <div className="p-4 space-y-6">
                  <div className="space-y-1">
                    <Link href="/profile">
                      <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-primary/10 transition-all text-sm font-medium group relative overflow-hidden">
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                        </div>
                        <User className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="group-hover:text-primary transition-colors">Profile</span>
                      </button>
                    </Link>
                  </div>

                  <div className="h-px bg-white/5 mx-3" />

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

                  <div className="h-px bg-white/5 mx-3" />

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
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-all text-sm font-bold group relative overflow-hidden"
                  >
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
      </div>
    </nav>
  );
}
