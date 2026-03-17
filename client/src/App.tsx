import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Feed from "@/pages/Feed";
import Saved from "@/pages/Saved";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import MyIdeas from "@/pages/MyIdeas";
import MyFundraising from "@/pages/MyFundraising";
import Analytics from "@/pages/Analytics";
import MyProjects from "@/pages/MyProjects";
import AppliedJobs from "@/pages/AppliedJobs";
import ApplicationsReceived from "@/pages/ApplicationsReceived";
import MyInvestments from "@/pages/MyInvestments";
import Portfolio from "@/pages/Portfolio";
import Funded from "@/pages/Funded";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { UserActivityProvider } from "@/hooks/use-user-activity";

function ProtectedRoute({ component: Component, path }: { component: React.ComponentType<any>, path: string }) {
  const [, setLocation] = useLocation();
  const { user, loading } = useFirebaseAuth();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Auth} />
      <Route path="/register" component={Auth} />
      <Route path="/feed">
        <ProtectedRoute component={Feed} path="/feed" />
      </Route>
      <Route path="/chat">
        <ProtectedRoute component={Chat} path="/chat" />
      </Route>
      <Route path="/saved">
        <ProtectedRoute component={Saved} path="/saved" />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} path="/profile" />
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} path="/dashboard" />
      </Route>
      <Route path="/my-ideas">
        <ProtectedRoute component={MyIdeas} path="/my-ideas" />
      </Route>
      <Route path="/my-fundraising">
        <ProtectedRoute component={MyFundraising} path="/my-fundraising" />
      </Route>
      <Route path="/analytics">
        <ProtectedRoute component={Analytics} path="/analytics" />
      </Route>
      <Route path="/my-projects">
        <ProtectedRoute component={MyProjects} path="/my-projects" />
      </Route>
      <Route path="/applied-jobs">
        <ProtectedRoute component={AppliedJobs} path="/applied-jobs" />
      </Route>
      <Route path="/applications-received">
        <ProtectedRoute component={ApplicationsReceived} path="/applications-received" />
      </Route>
      <Route path="/my-investments">
        <ProtectedRoute component={MyInvestments} path="/my-investments" />
      </Route>
      <Route path="/portfolio">
        <ProtectedRoute component={Portfolio} path="/portfolio" />
      </Route>
      <Route path="/funded">
        <ProtectedRoute component={Funded} path="/funded" />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={Settings} path="/settings" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserActivityProvider>
          <Toaster />
          <Router />
        </UserActivityProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
