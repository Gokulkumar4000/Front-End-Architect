import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Heart, MessageSquare, FileText, TrendingUp, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { getUserPosts, type FirestorePost } from "@/lib/firestoreService";

export default function Analytics() {
  const [, setLocation] = useLocation();
  const { user } = useFirebaseAuth();
  const [posts, setPosts] = useState<FirestorePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserPosts(user.uid).then((data) => {
      setPosts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const totalLikes = posts.reduce((sum, p) => sum + (p.stats?.likes || 0), 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.stats?.comments || 0), 0);
  const totalPosts = posts.length;
  const avgLikes = totalPosts ? Math.round(totalLikes / totalPosts) : 0;

  const topPost = posts.reduce<FirestorePost | null>((top, p) => {
    if (!top) return p;
    return (p.stats?.likes || 0) > (top.stats?.likes || 0) ? p : top;
  }, null);

  const byType = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              Idea Analytics
            </h1>
            <p className="text-muted-foreground text-sm">Performance overview of your posts</p>
          </div>
        </div>

        {/* Summary Stats */}
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
                    <span className="text-2xl font-bold">{totalPosts}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Total Posts</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span className="text-2xl font-bold">{totalLikes}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Total Likes</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-2xl font-bold">{totalComments}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Comments</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-2xl font-bold">{avgLikes}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Avg Likes/Post</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Posts by Type */}
          <Card className="glass-card border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Posts by Type</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full shimmer-bg" />
                  ))}
                </div>
              ) : Object.keys(byType).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No posts yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(byType).map(([type, count]) => (
                    <div key={type} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm capitalize font-medium">{type}</span>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${(count / totalPosts) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Performing Post */}
          <Card className="glass-card border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Top Post</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4 shimmer-bg" />
                  <Skeleton className="h-16 w-full shimmer-bg" />
                </div>
              ) : !topPost ? (
                <p className="text-sm text-muted-foreground text-center py-4">No posts yet</p>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <Badge variant="outline" className="mb-2 text-xs bg-primary/5 border-primary/20 text-primary capitalize">
                    {topPost.type}
                  </Badge>
                  <h4 className="font-bold text-white mb-1">{topPost.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{topPost.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400" /> {topPost.stats?.likes || 0} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-blue-400" /> {topPost.stats?.comments || 0} comments
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Posts Performance */}
        <Card className="glass-card border-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">All Posts Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full shimmer-bg" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No posts yet. Start sharing ideas!</p>
            ) : (
              <div className="space-y-2">
                {[...posts].sort((a, b) => (b.stats?.likes || 0) - (a.stats?.likes || 0)).map((post) => (
                  <div key={post.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{post.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{post.type}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-400" /> {post.stats?.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-blue-400" /> {post.stats?.comments || 0}
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
