import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Edit2
} from "lucide-react";
import { useLocation } from "wouter";

const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
    <div className="h-8 w-32 bg-muted/20 rounded relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer -translate-x-full" />
    </div>
    <Card className="glass-card border-white/5 overflow-hidden">
      <div className="h-32 bg-muted/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer -translate-x-full" />
      </div>
      <CardContent className="relative px-6 pb-6">
        <div className="flex flex-col md:flex-row items-end gap-6 -mt-12">
          <div className="h-32 w-32 rounded-full bg-muted/20 border-4 border-background relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer -translate-x-full" />
          </div>
          <div className="flex-1 space-y-2 pb-2">
            <div className="h-8 w-48 bg-muted/20 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer -translate-x-full" />
            </div>
            <div className="h-4 w-32 bg-muted/20 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer -translate-x-full" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2 space-y-4">
            <div className="h-24 w-full bg-muted/20 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer -translate-x-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-muted/10 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer -translate-x-full" />
              </div>
              <div className="h-16 bg-muted/10 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer -translate-x-full" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-32 w-full bg-muted/20 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer -translate-x-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function Profile() {
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const userRole = (localStorage.getItem("userRole") as any) || "Idea Holder";
  
  // Mock User Data
  const [profile, setProfile] = useState({
    name: "John Doe",
    role: userRole.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    email: "john@example.com",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    bio: "Visionary entrepreneur focused on AI and sustainable urban farming. Currently building automated sensor networks for small-scale urban farmers to optimize water usage and crop yield.",
    focus: "AI & Sustainability",
    teamSize: "1-5",
    socials: {
      github: "johndoe",
      linkedin: "johndoe",
      twitter: "johndoe"
    }
  });

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
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 mb-2" 
          onClick={() => setLocation("/feed")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Button>

        {/* Profile Header Card */}
        <Card className="glass-card border-white/5 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row items-end gap-6 -mt-12">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-4xl bg-primary/5 text-primary font-bold">JD</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </button>
                )}
              </div>
              
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    {isEditing ? (
                      <Input 
                        value={profile.name} 
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="text-2xl font-bold font-display h-auto p-0 border-none focus-visible:ring-0 bg-transparent"
                      />
                    ) : (
                      <h1 className="text-3xl font-display font-bold">{profile.name}</h1>
                    )}
                    <p className="text-primary font-medium">{profile.role}</p>
                  </div>
                  
                  <Button 
                    variant={isEditing ? "default" : "outline"} 
                    size="sm" 
                    className="gap-2 font-bold"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="md:col-span-2 space-y-6">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">About</h3>
                  {isEditing ? (
                    <Textarea 
                      value={profile.bio} 
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="min-h-[120px] bg-muted/50 border-white/10"
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      {profile.bio}
                    </p>
                  )}
                </section>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Focus</p>
                    {isEditing ? (
                      <Input 
                        value={profile.focus} 
                        onChange={(e) => setProfile({...profile, focus: e.target.value})}
                        className="h-7 text-sm p-0 border-none bg-transparent"
                      />
                    ) : (
                      <p className="text-sm font-bold">{profile.focus}</p>
                    )}
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Team Size</p>
                    <p className="text-sm font-bold">{profile.teamSize}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {isEditing ? (
                        <Input 
                          value={profile.email} 
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="h-6 p-0 border-none bg-transparent"
                        />
                      ) : (
                        <span>{profile.email}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {isEditing ? (
                        <Input 
                          value={profile.location} 
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          className="h-6 p-0 border-none bg-transparent"
                        />
                      ) : (
                        <span>{profile.location}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Globe className="w-4 h-4" />
                      {isEditing ? (
                        <Input 
                          value={profile.website} 
                          onChange={(e) => setProfile({...profile, website: e.target.value})}
                          className="h-6 p-0 border-none bg-transparent"
                        />
                      ) : (
                        <a href={profile.website} target="_blank" className="hover:text-primary transition-colors">{profile.website.replace("https://", "")}</a>
                      )}
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Socials</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Github className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Twitter className="w-4 h-4" />
                    </Button>
                  </div>
                </section>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Stats / Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card border-white/5 p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Account Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-[10px] text-muted-foreground uppercase">Ideas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">850</p>
                <p className="text-[10px] text-muted-foreground uppercase">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">42</p>
                <p className="text-[10px] text-muted-foreground uppercase">Projects</p>
              </div>
            </div>
          </Card>
          
          <Card className="glass-card border-white/5 p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Early Adopter</Badge>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Visionary</Badge>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Top 100 Builders</Badge>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
