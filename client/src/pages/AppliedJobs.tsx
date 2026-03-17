import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { getMyApplications, type Application } from "@/lib/firestoreService";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  accepted: { label: "Accepted", icon: CheckCircle, className: "text-green-400 bg-green-400/10 border-green-400/20" },
  rejected: { label: "Rejected", icon: XCircle, className: "text-red-400 bg-red-400/10 border-red-400/20" },
};

export default function AppliedJobs() {
  const [, setLocation] = useLocation();
  const { user } = useFirebaseAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMyApplications(user.uid).then((data) => {
      setApplications(data);
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
                <Briefcase className="w-6 h-6 text-blue-400" />
                Applied Jobs
              </h1>
              <p className="text-muted-foreground text-sm">Jobs and projects you've applied to</p>
            </div>
          </div>
          <Link href="/feed">
            <Button variant="outline" size="sm">Browse Jobs</Button>
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
        ) : applications.length === 0 ? (
          <Card className="glass-card border-white/5">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <Briefcase className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-muted-foreground font-medium">No applications yet</p>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Browse the feed and apply to recruitment posts to track them here.
              </p>
              <Link href="/feed">
                <Button variant="outline" size="sm">Browse Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const status = statusConfig[app.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <Card key={app.id} className="glass-card border-white/5 hover:border-white/10 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white mb-1">{app.postTitle}</h3>
                        {app.message && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            "{app.message}"
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Applied {app.appliedAt?.toDate ? new Date(app.appliedAt.toDate()).toLocaleDateString() : "Recently"}
                        </p>
                      </div>
                      <Badge variant="outline" className={`shrink-0 flex items-center gap-1 ${status.className}`}>
                        <StatusIcon className="w-3 h-3" />
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
