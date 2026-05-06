import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, ArrowLeft, TrendingUp, CheckCircle, DollarSign } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { getMyInvestments, updateInvestmentStatus, type Investment } from "@/lib/firestoreService";
import { useToast } from "@/hooks/use-toast";

const statusConfig = {
  interested: { label: "Interested", className: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  committed: { label: "Committed", className: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  completed: { label: "Completed", className: "text-green-400 bg-green-400/10 border-green-400/20" },
};

export default function MyInvestments() {
  const [, setLocation] = useLocation();
  const { user } = useFirebaseAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getMyInvestments(user.uid).then((data) => {
      setInvestments(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const handleStatusChange = async (id: string, status: "interested" | "committed" | "completed") => {
    setUpdating(id);
    try {
      await updateInvestmentStatus(id, status);
      setInvestments((prev) => prev.map((inv) => inv.id === id ? { ...inv, status } : inv));
      toast({ title: "Status updated", description: `Investment marked as ${status}.` });
    } catch {
      toast({ title: "Error", description: "Could not update status.", variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  const totalCommitted = investments.filter((i) => i.status !== "interested").length;

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
                <Target className="w-6 h-6 text-green-400" />
                My Investments
              </h1>
              <p className="text-muted-foreground text-sm">Track your investment interests</p>
            </div>
          </div>
          <Link href="/feed">
            <Button variant="outline" size="sm">Browse Opportunities</Button>
          </Link>
        </div>

        {/* Summary */}
        {!loading && investments.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="glass-card border-white/5">
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{investments.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/5">
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-yellow-400">{investments.filter((i) => i.status === "committed").length}</p>
                <p className="text-xs text-muted-foreground">Committed</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/5">
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-green-400">{investments.filter((i) => i.status === "completed").length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="glass-card border-white/5">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4 shimmer-bg" />
                  <Skeleton className="h-4 w-full shimmer-bg" />
                  <Skeleton className="h-4 w-1/3 shimmer-bg" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : investments.length === 0 ? (
          <Card className="glass-card border-white/5">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <Target className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-muted-foreground font-medium">No investments tracked yet</p>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Click "Invest" on fund posts in the feed to track them here.
              </p>
              <Link href="/feed">
                <Button variant="outline" size="sm">Browse Opportunities</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {investments.map((inv) => {
              const status = statusConfig[inv.status as keyof typeof statusConfig] || statusConfig.interested;
              return (
                <Card key={inv.id} className="glass-card border-white/5 hover:border-white/10 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white mb-1">{inv.postTitle}</h3>
                        {inv.amount && (
                          <p className="text-sm text-green-400 flex items-center gap-1 mb-2">
                            <DollarSign className="w-3.5 h-3.5" />
                            {inv.amount}
                          </p>
                        )}
                        {inv.note && (
                          <p className="text-sm text-muted-foreground mb-3">"{inv.note}"</p>
                        )}
                        <p className="text-xs text-muted-foreground mb-3">
                          {inv.investedAt?.toDate ? new Date(inv.investedAt.toDate()).toLocaleDateString() : "Recently"}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {(["interested", "committed", "completed"] as const).map((s) => (
                            <Button
                              key={s}
                              size="sm"
                              variant="outline"
                              disabled={inv.status === s || updating === inv.id}
                              className={`text-xs capitalize ${inv.status === s ? statusConfig[s].className : "border-white/10 text-muted-foreground"}`}
                              onClick={() => handleStatusChange(inv.id, s)}
                            >
                              {s}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <Badge variant="outline" className={`shrink-0 ${status.className}`}>
                        {status.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
