import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, ArrowLeft, TrendingUp, Target, DollarSign } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { getMyInvestments, type Investment } from "@/lib/firestoreService";

export default function Portfolio() {
  const [, setLocation] = useLocation();
  const { user } = useFirebaseAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMyInvestments(user.uid).then((data) => {
      setInvestments(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const byCollection = investments.reduce<Record<string, number>>((acc, inv) => {
    const label = inv.postCollection === "funds" ? "Funds" : inv.postCollection === "ideas" ? "Ideas" : (inv.postCollection || "Other");
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const byStatus = {
    interested: investments.filter((i) => i.status === "interested").length,
    committed: investments.filter((i) => i.status === "committed").length,
    completed: investments.filter((i) => i.status === "completed").length,
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold flex items-center gap-2">
              <PieChart className="w-6 h-6 text-blue-400" />
              Portfolio
            </h1>
            <p className="text-muted-foreground text-sm">Overview of your investment portfolio</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="glass-card border-white/5">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-8 w-16 shimmer-bg" />
                  <Skeleton className="h-3 w-24 shimmer-bg" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : investments.length === 0 ? (
          <Card className="glass-card border-white/5">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <PieChart className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-muted-foreground font-medium">Your portfolio is empty</p>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Start investing in projects and ideas on the feed to build your portfolio.
              </p>
              <Link href="/feed">
                <Button variant="outline" size="sm">Explore Opportunities</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Status Overview */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="glass-card border-white/5">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-blue-400">{byStatus.interested}</p>
                  <p className="text-xs text-muted-foreground">Interested</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/5">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-yellow-400">{byStatus.committed}</p>
                  <p className="text-xs text-muted-foreground">Committed</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/5">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-green-400">{byStatus.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Breakdown by Category */}
              <Card className="glass-card border-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">By Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(byCollection).map(([label, count]) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{label}</span>
                            <span className="text-sm text-muted-foreground">{count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${(count / investments.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Investments */}
              <Card className="glass-card border-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {investments.slice(0, 5).map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/5">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{inv.postTitle}</p>
                          <p className="text-xs text-muted-foreground capitalize">{inv.status}</p>
                        </div>
                        {inv.amount && (
                          <span className="text-xs text-green-400 flex items-center gap-0.5 shrink-0">
                            <DollarSign className="w-3 h-3" />{inv.amount}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
