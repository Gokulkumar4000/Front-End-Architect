import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Hammer, Heart, MessageSquare, Plus, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { getUserPosts, type FirestorePost } from "@/lib/firestoreService";

export default function MyProjects() {
  const [, setLocation] = useLocation();
  const { user } = useFirebaseAuth();
  const [posts, setPosts] = useState<FirestorePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserPosts(user.uid, "project").then((data) => {
      setPosts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold flex items-center gap-2">
                <Hammer className="w-6 h-6 text-orange-400" />
                My Projects
              </h1>
              <p className="text-muted-foreground text-sm">Projects you've posted</p>
            </div>
          </div>
          <Link href="/feed">
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Post Project
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="glass-card border-white/5">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4 shimmer-bg" />
                  <Skeleton className="h-4 w-full shimmer-bg" />
                  <Skeleton className="h-4 w-1/2 shimmer-bg" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card className="glass-card border-white/5">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <Hammer className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-muted-foreground font-medium">No projects posted yet</p>
              <Link href="/feed">
                <Button variant="outline" size="sm">Post your first project</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="glass-card border-white/5 hover:border-white/10 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.content}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.domains?.map((domain) => (
                          <Badge key={domain} variant="outline" className="text-xs bg-orange-500/5 border-orange-500/20 text-orange-400">
                            {domain}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" /> {post.stats?.likes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> {post.stats?.comments || 0}
                        </span>
                        <span>{post.timestamp || "Recently"}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="shrink-0 bg-orange-500/10 border-orange-500/20 text-orange-400">
                      Project
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
