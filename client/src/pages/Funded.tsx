import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Rocket, ArrowLeft, CheckCircle, DollarSign } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { getMyInvestments, type Investment } from "@/lib/firestoreService";

export default function Funded() {
  const [, setLocation] = useLocation();
  const { user } = useFirebaseAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMyInvestments(user.uid).then((data) => {
      setInvestments(data.filter((i) => i.status === "completed"));
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
                <Rocket className="w-6 h-6 text-purple-400" />
                Funded Projects
              </h1>
              <p className="text-muted-foreground text-sm">Projects and ideas you've fully funded</p>
            </div>
          </div>
          <Link href="/my-investments">
            <Button variant="outline" size="sm">All Investments</Button>
          </Link>
        </div>

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
              <Rocket className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-muted-foreground font-medium">No completed investments yet</p>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Mark investments as "completed" in My Investments to see them here.
              </p>
              <Link href="/my-investments">
                <Button variant="outline" size="sm">View My Investments</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {investments.map((inv) => (
              <Card key={inv.id} className="glass-card border-white/5 hover:border-white/10 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <h3 className="text-lg font-bold text-white">{inv.postTitle}</h3>
                      </div>
                      {inv.amount && (
                        <p className="text-sm text-green-400 flex items-center gap-1 mb-2">
                          <DollarSign className="w-3.5 h-3.5" />
                          {inv.amount} invested
                        </p>
                      )}
                      {inv.note && (
                        <p className="text-sm text-muted-foreground mb-3">"{inv.note}"</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Funded {inv.investedAt?.toDate ? new Date(inv.investedAt.toDate()).toLocaleDateString() : "Recently"}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-green-400 bg-green-400/10 border-green-400/20">
                      Funded
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
