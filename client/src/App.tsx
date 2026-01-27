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
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function ProtectedRoute({ component: Component, path }: { component: React.ComponentType<any>, path: string }) {
  const [location, setLocation] = useLocation();
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (!userRole) {
      setLocation("/login");
    }
  }, [userRole, setLocation]);

  if (!userRole) return null;
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
