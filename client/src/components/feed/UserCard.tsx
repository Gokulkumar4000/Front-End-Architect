import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserActivity } from "@/hooks/use-user-activity";
import { type UserProfile } from "@/lib/firestoreService";
import { MapPin, Briefcase } from "lucide-react";

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  "idea-holder": { label: "Idea Holder", color: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20" },
  "developer": { label: "Developer", color: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  "investor": { label: "Investor", color: "bg-green-400/10 text-green-400 border-green-400/20" },
};

interface UserCardProps {
  user: UserProfile;
  currentUid?: string;
}

export function UserCard({ user, currentUid }: UserCardProps) {
  const activity = useUserActivity();
  const following = activity.isFollowing(user.fullName);
  const roleCfg = ROLE_CONFIG[user.role] || { label: user.role || "Member", color: "bg-white/5 text-muted-foreground border-white/10" };
  const isOwn = user.uid === currentUid;

  const avatarUrl = user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.fullName || user.uid)}`;

  return (
    <Card className="glass-card border-white/5 hover:border-primary/20 transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 shrink-0 ring-2 ring-white/5">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user.fullName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white leading-snug">{user.fullName}</h3>
                {user.tagline && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{user.tagline}</p>
                )}
              </div>
              {!isOwn && (
                <Button
                  size="sm"
                  variant={following ? "default" : "outline"}
                  className="h-7 text-xs px-3 shrink-0"
                  onClick={() => activity.toggleFollow(user.fullName)}
                  data-testid={`button-follow-${user.uid}`}
                >
                  {following ? "Following" : "Follow"}
                </Button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className={cn("text-[10px] border px-2 py-0.5 font-medium", roleCfg.color)}>
                {roleCfg.label}
              </Badge>
              {user.location && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {user.location}
                </span>
              )}
              {user.experience && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Briefcase className="w-3 h-3" />
                  {user.experience}
                </span>
              )}
            </div>

            {user.bio && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{user.bio}</p>
            )}

            {user.skills && user.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {user.skills.slice(0, 4).map((s) => (
                  <Badge key={s} variant="outline" className="text-[10px] border-white/10 text-muted-foreground bg-white/2 px-1.5 py-0">
                    {s}
                  </Badge>
                ))}
                {user.skills.length > 4 && (
                  <Badge variant="outline" className="text-[10px] border-white/10 text-muted-foreground bg-white/2 px-1.5 py-0">
                    +{user.skills.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
