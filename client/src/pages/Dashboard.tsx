import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Lightbulb, Hammer, Coins, Users, Heart, MessageSquare, Bookmark,
  BarChart3, ArrowRight, Briefcase, Target, Rocket, FileText, PieChart,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { useUserProfile } from "@/hooks/use-profile";
import { getUserPosts, getUserSavedPosts, getMyApplications, getMyInvestments } from "@/lib/firestoreService";

export default function Dashboard() {
  const { user } = useFirebaseAuth();
  const { profile } = useUserProfile();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    savedPosts: 0,
    applications: 0,
    investments: 0,
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  const role = (profile?.role || "idea-holder") as "idea-holder" | "developer" | "investor";

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getUserPosts(user.uid),
      getUserSavedPosts(user.uid),
      role === "developer" ? getMyApplications(user.uid) : Promise.resolve([]),
      role === "investor" ? getMyInvestments(user.uid) : Promise.resolve([]),
    ]).then(([posts, saved, apps, investments]) => {
      const totalLikes = posts.reduce((sum, p) => sum + (p.stats?.likes || 0), 0);
      const totalComments = posts.reduce((sum, p) => sum + (p.stats?.comments || 0), 0);
      setStats({
        totalPosts: posts.length,
        totalLikes,
        totalComments,
        savedPosts: saved.length,
        applications: apps.length,
        investments: investments.length,
      });
      setRecentPosts(posts.slice(0, 5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, role]);

  const roleLabel = role.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const quickLinks = {
    "idea-holder": [
      { label: "My Ideas", icon: Lightbulb, url: "/my-ideas", color: "text-yellow-400" },
      { label: "My Fundraising", icon: Coins, url: "/my-fundraising", color: "text-green-400" },
      { label: "Analytics", icon: BarChart3, url: "/analytics", color: "text-blue-400" },
      { label: "Saved", icon: Bookmark, url: "/saved", color: "text-primary" },
    ],
    "developer": [
      { label: "My Projects", icon: Hammer, url: "/my-projects", color: "text-orange-400" },
      { label: "Applied Jobs", icon: Briefcase, url: "/applied-jobs", color: "text-blue-400" },
      { label: "Applications Received", icon: FileText, url: "/applications-received", color: "text-purple-400" },
      { label: "Saved", icon: Bookmark, url: "/saved", color: "text-primary" },
    ],
    "investor": [
      { label: "My Investments", icon: Target, url: "/my-investments", color: "text-green-400" },
      { label: "Portfolio", icon: PieChart, url: "/portfolio", color: "text-blue-400" },
      { label: "Funded Projects", icon: Rocket, url: "/funded", color: "text-purple-400" },
      { label: "Saved", icon: Bookmark, url: "/saved", color: "text-primary" },
    ],
  };

  const links = quickLinks[role] || quickLinks["idea-holder"];

  const postTypeLabel: Record<string, string> = {
    idea: "Idea",
    project: "Project",
    fund: "Fund",
    recruitment: "Job Post",
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">
              Welcome back, {profile?.fullName?.split(" ")[0] || "there"}!
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Here's what's happening with your {roleLabel} account.
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 capitalize">
            {roleLabel}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="glass-card border-white/5">
                <CardContent className="p-4">
                  <Skeleton className="h-8 w-12 mb-1 shimmer-bg" />
                  <Skeleton className="h-3 w-20 shimmer-bg" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card className="glass-card border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold">{stats.totalPosts}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Total Posts</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span className="text-2xl font-bold">{stats.totalLikes}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Total Likes</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-2xl font-bold">{stats.totalComments}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Comments</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Bookmark className="w-4 h-4 text-yellow-400" />
                    <span className="text-2xl font-bold">{stats.savedPosts}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Saved Items</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Quick Links */}
        <Card className="glass-card border-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {links.map((link) => (
                <Link key={link.url} href={link.url}>
                  <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all group text-left">
                    <link.icon className={`w-6 h-6 mb-2 ${link.color} group-hover:scale-110 transition-transform`} />
                    <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{link.label}</p>
                  </button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card className="glass-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Recent Posts</CardTitle>
            <Link href={role === "investor" ? "/my-investments" : role === "developer" ? "/my-projects" : "/my-ideas"}>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full shimmer-bg" />
                ))}
              </div>
            ) : recentPosts.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No posts yet.</p>
                <Link href="/feed">
                  <Button size="sm" className="mt-3" variant="outline">Go to Feed</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{post.title}</p>
                      <p className="text-xs text-muted-foreground">{post.timestamp || "Recently"}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5">
                        {postTypeLabel[post.type] || post.type}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Heart className="w-3 h-3" /> {post.stats?.likes || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
