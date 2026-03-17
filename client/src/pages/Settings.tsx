import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Settings as SettingsIcon, ArrowLeft, User, Bell, Shield, LogOut, Save, Mail, Lock
} from "lucide-react";
import { useLocation } from "wouter";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { useUserProfile } from "@/hooks/use-profile";
import { updateUserProfile } from "@/lib/firestoreService";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user, logout } = useFirebaseAuth();
  const { profile, loading } = useUserProfile();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [notifications, setNotifications] = useState({
    messages: true,
    likes: true,
    comments: true,
    applications: true,
    investments: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.fullName || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, { fullName: displayName });
      toast({ title: "Settings saved", description: "Your settings have been updated." });
    } catch {
      toast({ title: "Error", description: "Could not save settings.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  const roleDisplay = (profile?.role || "idea-holder")
    .split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/profile")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground text-sm">Manage your account preferences</p>
          </div>
        </div>

        {/* Account Info */}
        <Card className="glass-card border-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" /> Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full shimmer-bg" />
                <Skeleton className="h-10 w-full shimmer-bg" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-xs font-medium text-muted-foreground">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-white/5 border-white/10"
                    data-testid="input-display-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{user?.email || "—"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">Role</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {roleDisplay}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Role is set during registration</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  data-testid="button-save-settings"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass-card border-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Bell className="w-4 h-4" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries({
              messages: "New messages",
              likes: "Likes on your posts",
              comments: "Comments on your posts",
              applications: "New applications received",
              investments: "Investment updates",
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={`notif-${key}`} className="text-sm font-medium cursor-pointer">
                  {label}
                </Label>
                <Switch
                  id={`notif-${key}`}
                  checked={notifications[key as keyof typeof notifications]}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, [key]: checked }))
                  }
                  data-testid={`switch-notif-${key}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="glass-card border-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" /> Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Profile Visibility</p>
                <p className="text-xs text-muted-foreground">Allow others to find and view your profile</p>
              </div>
              <Switch defaultChecked data-testid="switch-profile-visibility" />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Show Activity Status</p>
                <p className="text-xs text-muted-foreground">Show when you were last active</p>
              </div>
              <Switch defaultChecked data-testid="switch-activity-status" />
            </div>
            <Separator className="bg-white/5" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-muted-foreground">To change your password, use the reset link sent to your email.</p>
              <Button variant="outline" size="sm" className="gap-2">
                <Lock className="w-3 h-3" />
                Request Password Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="glass-card border-destructive/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-destructive/80">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sign out of your account</p>
                <p className="text-xs text-muted-foreground">You can always sign back in</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/30 text-destructive hover:bg-destructive/10 gap-2"
                onClick={handleLogout}
                data-testid="button-logout-settings"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
