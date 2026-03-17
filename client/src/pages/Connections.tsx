import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users, Lightbulb, Code2, TrendingUp, CheckCircle2, MapPin } from "lucide-react";
import { getAllUsers, type UserProfile } from "@/lib/firestoreService";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { useUserActivity } from "@/hooks/use-user-activity";
import { cn } from "@/lib/utils";

const ROLE_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  "idea-holder": { icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", label: "Idea Holder" },
  developer: { icon: Code2, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", label: "Developer" },
  investor: { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", label: "Investor" },
};

function getRoleConfig(role: string) {
  return ROLE_CONFIG[role] || { icon: Users, color: "text-muted-foreground", bg: "bg-white/5 border-white/10", label: role };
}

export default function Connections() {
  const { user } = useFirebaseAuth();
  const activity = useUserActivity();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data.filter((u) => u.uid !== user?.uid));
      setLoading(false);
    });
  }, [user]);

  const filtered = users.filter((u) => {
    const name = u.fullName || "";
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || (u.bio || "").toLowerCase().includes(search.toLowerCase()) || (u.tagline || "").toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <AppLayout>
      <div className="flex-1 p-6 space-y-6 max-w-5xl mx-auto w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" /> Connections
          </h1>
          <p className="text-sm text-muted-foreground">Discover and connect with idea holders, developers, and investors on DevConnect.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search people..." className="pl-9 bg-white/5 border-white/10 focus:border-primary/40" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-connections" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant={!roleFilter ? "default" : "outline"} className="h-9 text-xs border-white/10" onClick={() => setRoleFilter(null)}>All</Button>
            {["idea-holder", "developer", "investor"].map((r) => {
              const cfg = getRoleConfig(r);
              return (
                <Button key={r} size="sm" variant={roleFilter === r ? "default" : "outline"} className="h-9 text-xs border-white/10" onClick={() => setRoleFilter(r === roleFilter ? null : r)}>
                  {cfg.label}
                </Button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="glass-card h-44 animate-pulse rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <Users className="w-12 h-12 text-muted-foreground/20" />
            <p className="text-muted-foreground">No connections found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((person) => {
              const cfg = getRoleConfig(person.role);
              const RoleIcon = cfg.icon;
              const isFollowing = activity.isFollowing(person.fullName);
              const avatar = person.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(person.fullName || person.uid)}`;
              return (
                <div key={person.uid} className="glass-card border-white/5 hover:border-primary/20 p-5 rounded-2xl space-y-3 transition-all group" data-testid={`card-connection-${person.uid}`}>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/10 shrink-0">
                      <AvatarImage src={avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">{(person.fullName || "U")[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{person.fullName}</h3>
                      <div className={cn("inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border", cfg.bg)}>
                        <RoleIcon className={cn("w-3 h-3", cfg.color)} />
                        <span className={cfg.color}>{cfg.label}</span>
                      </div>
                    </div>
                  </div>

                  {person.tagline && <p className="text-xs text-muted-foreground italic line-clamp-1">"{person.tagline}"</p>}
                  {person.bio && <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{person.bio}</p>}

                  {person.location && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />{person.location}
                    </div>
                  )}

                  {person.skills && person.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {person.skills.slice(0, 3).map((s) => (
                        <Badge key={s} variant="outline" className="text-[10px] border-white/10 text-muted-foreground px-1.5 py-0">{s}</Badge>
                      ))}
                      {person.skills.length > 3 && <span className="text-[10px] text-muted-foreground">+{person.skills.length - 3}</span>}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    {isFollowing ? (
                      <Button variant="outline" size="sm" className="flex-1 h-8 text-xs border-primary/20 text-primary" onClick={() => activity.toggleFollow(person.fullName)}>
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Following
                      </Button>
                    ) : (
                      <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => activity.toggleFollow(person.fullName)} data-testid={`button-follow-${person.uid}`}>
                        Follow
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="h-8 text-xs border-white/10">Message</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
