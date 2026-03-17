import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ArrowLeft, CheckCircle, XCircle, Clock, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { getApplicationsForMyPosts, updateApplicationStatus, type Application } from "@/lib/firestoreService";
import { useToast } from "@/hooks/use-toast";

const statusConfig = {
  pending: { label: "Pending", className: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  accepted: { label: "Accepted", className: "text-green-400 bg-green-400/10 border-green-400/20" },
  rejected: { label: "Rejected", className: "text-red-400 bg-red-400/10 border-red-400/20" },
};

export default function ApplicationsReceived() {
  const [, setLocation] = useLocation();
  const { user } = useFirebaseAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getApplicationsForMyPosts(user.uid).then((data) => {
      setApplications(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const handleStatus = async (appId: string, status: "accepted" | "rejected") => {
    setUpdating(appId);
    try {
      await updateApplicationStatus(appId, status);
      setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));
      toast({ title: `Application ${status}`, description: `You've ${status} this application.` });
    } catch {
      toast({ title: "Error", description: "Could not update status.", variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-400" />
              Applications Received
            </h1>
            <p className="text-muted-foreground text-sm">People who applied to your recruitment posts</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="glass-card border-white/5">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4 shimmer-bg" />
                  <Skeleton className="h-4 w-full shimmer-bg" />
                  <Skeleton className="h-8 w-1/3 shimmer-bg" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <Card className="glass-card border-white/5">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <FileText className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-muted-foreground font-medium">No applications received yet</p>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Post a recruitment or job listing on the feed to start receiving applications.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const status = statusConfig[app.status] || statusConfig.pending;
              return (
                <Card key={app.id} className="glass-card border-white/5 hover:border-white/10 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 border border-white/10 shrink-0">
                        <AvatarImage src={app.applicantAvatar} />
                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="text-sm font-bold text-white">{app.applicantName}</h3>
                          <Badge variant="outline" className={`shrink-0 text-xs ${status.className}`}>
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-primary mb-2">Applied for: {app.postTitle}</p>
                        {app.message && (
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                            "{app.message}"
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mb-3">
                          {app.appliedAt?.toDate ? new Date(app.appliedAt.toDate()).toLocaleDateString() : "Recently"}
                        </p>
                        {app.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="gap-1 bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30"
                              variant="outline"
                              disabled={updating === app.id}
                              onClick={() => handleStatus(app.id, "accepted")}
                              data-testid={`button-accept-application-${app.id}`}
                            >
                              <CheckCircle className="w-3 h-3" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              className="gap-1 bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                              variant="outline"
                              disabled={updating === app.id}
                              onClick={() => handleStatus(app.id, "rejected")}
                              data-testid={`button-reject-application-${app.id}`}
                            >
                              <XCircle className="w-3 h-3" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
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
