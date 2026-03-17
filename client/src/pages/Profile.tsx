import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Camera,
  Mail,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Save,
  Edit2,
  Briefcase,
  Clock,
  Tag,
} from "lucide-react";
import { useLocation } from "wouter";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { getUserProfile, updateUserProfile, type UserProfile } from "@/lib/firestoreService";
import { useToast } from "@/hooks/use-toast";

const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
    <div className="h-8 w-32 rounded shimmer-bg" />
    <Card className="glass-card border-white/5 overflow-hidden">
      <div className="h-32 shimmer-bg opacity-50" />
      <CardContent className="relative px-6 pb-6">
        <div className="flex flex-col md:flex-row items-end gap-6 -mt-12">
          <div className="h-32 w-32 rounded-full border-4 border-background shimmer-bg" />
          <div className="flex-1 space-y-2 pb-2">
            <div className="h-8 w-48 rounded shimmer-bg" />
            <div className="h-4 w-32 rounded shimmer-bg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2 space-y-4">
            <div className="h-24 w-full rounded shimmer-bg" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 rounded shimmer-bg" />
              <div className="h-16 rounded shimmer-bg" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-32 w-full rounded shimmer-bg" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user } = useFirebaseAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editProfile, setEditProfile] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then((data) => {
      if (data) {
        setProfile(data);
        setEditProfile(data);
      } else {
        const fallback: Partial<UserProfile> = {
          fullName: user.displayName || "User",
          email: user.email || "",
          role: "idea-holder",
          bio: "",
          location: "",
          focus: "",
          teamSize: "",
          skills: [],
          interests: [],
          githubLink: "",
          portfolioLink: "",
        };
        setProfile(fallback as UserProfile);
        setEditProfile(fallback);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, editProfile);
      setProfile({ ...profile, ...editProfile } as UserProfile);
      setIsEditing(false);
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
    } catch {
      toast({ title: "Save failed", description: "Could not save your profile. Try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditProfile(profile || {});
    setIsEditing(false);
  };

  const initials = (profile?.fullName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleDisplay = (profile?.role || "idea-holder")
    .split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  if (loading) {
    return (
      <AppLayout>
        <ProfileSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 mb-2"
          onClick={() => setLocation("/feed")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Button>

        <Card className="glass-card border-white/5 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row items-end gap-6 -mt-12">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage
                    src={profile?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile?.fullName || "user")}`}
                    alt={profile?.fullName}
                  />
                  <AvatarFallback className="text-4xl bg-primary/5 text-primary font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </button>
                )}
              </div>

              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={editProfile.fullName || ""}
                        onChange={(e) => setEditProfile({ ...editProfile, fullName: e.target.value })}
                        className="text-2xl font-bold font-display h-auto p-1 border-white/20 bg-white/5 mb-1"
                        data-testid="input-profile-name"
                      />
                    ) : (
                      <h1 className="text-3xl font-display font-bold">{profile?.fullName || "Your Name"}</h1>
                    )}
                    <p className="text-primary font-medium">{roleDisplay}</p>
                    {profile?.tagline && (
                      <p className="text-sm text-muted-foreground mt-1 italic">"{profile.tagline}"</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 font-bold text-muted-foreground"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="gap-2 font-bold"
                          onClick={handleSave}
                          disabled={saving}
                          data-testid="button-save-profile"
                        >
                          <Save className="w-4 h-4" />
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 font-bold"
                        onClick={() => setIsEditing(true)}
                        data-testid="button-edit-profile"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="md:col-span-2 space-y-6">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">About</h3>
                  {isEditing ? (
                    <Textarea
                      value={editProfile.bio || ""}
                      onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                      className="min-h-[120px] bg-muted/50 border-white/10"
                      placeholder="Tell the community about yourself..."
                      data-testid="textarea-profile-bio"
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      {profile?.bio || "No bio added yet."}
                    </p>
                  )}
                </section>

                {(profile?.skills?.length || isEditing) && (
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {(profile?.skills || []).map((skill, i) => (
                        <Badge key={i} variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {skill}
                        </Badge>
                      ))}
                      {(!profile?.skills?.length) && <p className="text-sm text-muted-foreground">No skills listed.</p>}
                    </div>
                  </section>
                )}

                {(profile?.interests?.length || isEditing) && (
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {(profile?.interests || []).map((interest, i) => (
                        <Badge key={i} variant="outline" className="bg-white/5 border-white/10">
                          {interest}
                        </Badge>
                      ))}
                      {(!profile?.interests?.length) && <p className="text-sm text-muted-foreground">No interests listed.</p>}
                    </div>
                  </section>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {profile?.focus && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="w-3.5 h-3.5 text-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Focus</p>
                      </div>
                      {isEditing ? (
                        <Input
                          value={editProfile.focus || ""}
                          onChange={(e) => setEditProfile({ ...editProfile, focus: e.target.value })}
                          className="h-7 text-sm p-0 border-none bg-transparent focus-visible:ring-0"
                        />
                      ) : (
                        <p className="text-sm font-bold">{profile.focus}</p>
                      )}
                    </div>
                  )}
                  {profile?.teamSize && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Tag className="w-3.5 h-3.5 text-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Team Size</p>
                      </div>
                      <p className="text-sm font-bold">{profile.teamSize}</p>
                    </div>
                  )}
                  {profile?.workPref && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Work Preference</p>
                      </div>
                      <p className="text-sm font-bold capitalize">{profile.workPref}</p>
                    </div>
                  )}
                  {profile?.availability && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Availability</p>
                      <p className="text-sm font-bold">{profile.availability} hrs/week</p>
                    </div>
                  )}
                </div>

                {profile?.objectives && (
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Objectives</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{profile.objectives}</p>
                  </section>
                )}
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 shrink-0" />
                      <span className="break-all">{profile?.email || user?.email || "—"}</span>
                    </div>
                    {(profile?.location || isEditing) && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0" />
                        {isEditing ? (
                          <Input
                            value={editProfile.location || ""}
                            onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
                            className="h-6 p-0 border-none bg-transparent focus-visible:ring-0 text-sm"
                            placeholder="Your location"
                          />
                        ) : (
                          <span>{profile?.location || "—"}</span>
                        )}
                      </div>
                    )}
                    {(profile?.portfolioLink || isEditing) && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Globe className="w-4 h-4 shrink-0" />
                        {isEditing ? (
                          <Input
                            value={editProfile.portfolioLink || ""}
                            onChange={(e) => setEditProfile({ ...editProfile, portfolioLink: e.target.value })}
                            className="h-6 p-0 border-none bg-transparent focus-visible:ring-0 text-sm"
                            placeholder="Portfolio URL"
                          />
                        ) : profile?.portfolioLink ? (
                          <a href={profile.portfolioLink} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors truncate">
                            {profile.portfolioLink.replace(/^https?:\/\//, "")}
                          </a>
                        ) : null}
                      </div>
                    )}
                  </div>
                </section>

                {(profile?.githubLink || isEditing) && (
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Links</h3>
                    <div className="space-y-2">
                      {profile?.githubLink && (
                        <a href={profile.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
                          <Github className="w-4 h-4" />
                          <span className="truncate">{profile.githubLink.replace(/^https?:\/\//, "")}</span>
                        </a>
                      )}
                    </div>
                  </section>
                )}

                {profile?.isOrg === "yes" && profile?.orgName && (
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Organization</h3>
                    <p className="text-sm font-bold">{profile.orgName}</p>
                    {profile.orgRole && <p className="text-xs text-muted-foreground">{profile.orgRole}</p>}
                    {profile.orgType && <p className="text-xs text-muted-foreground">{profile.orgType}</p>}
                  </section>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card border-white/5 p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Account</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Role</span>
                <span className="text-white font-medium">{roleDisplay}</span>
              </div>
              {profile?.timezone && (
                <div className="flex justify-between">
                  <span>Timezone</span>
                  <span className="text-white font-medium">{profile.timezone.toUpperCase()}</span>
                </div>
              )}
              {profile?.experience && (
                <div className="flex justify-between">
                  <span>Experience</span>
                  <span className="text-white font-medium">{profile.experience} years</span>
                </div>
              )}
              {profile?.equityInterest && (
                <div className="flex justify-between">
                  <span>Open to Equity</span>
                  <span className="text-white font-medium capitalize">{profile.equityInterest}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="glass-card border-white/5 p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Early Adopter</Badge>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{roleDisplay}</Badge>
              {profile?.skills?.length ? (
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Builder</Badge>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
