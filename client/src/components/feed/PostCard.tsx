import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, MessageSquare, Lightbulb, Code2, Coins, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserActivity } from "@/hooks/use-user-activity";
import { type FirestorePost } from "@/lib/firestoreService";

const TYPE_CONFIG = {
  idea: { label: "Idea", icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  project: { label: "Project", icon: Code2, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  fund: { label: "Fund", icon: Coins, color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
  recruitment: { label: "Job", icon: Briefcase, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
};

interface PostCardProps {
  post: FirestorePost;
}

export function PostCard({ post }: PostCardProps) {
  const activity = useUserActivity();
  const liked = activity.isLiked(post.id);
  const saved = activity.isSaved(post.id);
  const [localLikes, setLocalLikes] = useState(post.stats.likes);

  const cfg = TYPE_CONFIG[post.type] || TYPE_CONFIG.idea;
  const TypeIcon = cfg.icon;

  const handleLike = async () => {
    setLocalLikes((p) => (liked ? p - 1 : p + 1));
    await activity.toggleLike(post.id, post.collectionName || "ideas", localLikes);
  };

  const handleSave = async () => {
    await activity.toggleSave(post.id, saved ? null : {
      id: post.id,
      type: post.type,
      collectionName: post.collectionName,
      title: post.title,
      description: post.content,
      author: post.author,
      domains: post.domains || [],
      likes: localLikes,
    });
  };

  return (
    <Card className="glass-card border-white/5 hover:border-primary/20 transition-all duration-300 group/card">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 shrink-0 ring-2 ring-white/5">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
              {post.author.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-bold text-white">{post.author.name}</span>
              <span className="text-xs text-muted-foreground">{post.author.role}</span>
              <span className="text-xs text-muted-foreground ml-auto shrink-0">{post.timestamp}</span>
            </div>

            <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border mb-2", cfg.bg)}>
              <TypeIcon className={cn("w-3 h-3", cfg.color)} />
              <span className={cfg.color}>{cfg.label}</span>
            </div>

            <h3 className="text-base font-bold text-white mb-2 leading-snug line-clamp-1 group-hover/card:text-primary transition-colors">
              {post.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
              {post.content}
            </p>

            {post.domains && post.domains.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.domains.map((d) => (
                  <Badge key={d} variant="outline" className="text-[10px] border-white/10 text-muted-foreground bg-white/2 px-2 py-0.5">
                    {d}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 pt-1 border-t border-white/5">
              <button
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1.5 text-xs transition-colors",
                  liked ? "text-rose-400" : "text-muted-foreground hover:text-rose-400"
                )}
                data-testid={`button-like-${post.id}`}
              >
                <Heart className={cn("w-3.5 h-3.5", liked && "fill-current")} />
                <span>{localLikes}</span>
              </button>

              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.stats.comments}</span>
              </button>

              <button
                onClick={handleSave}
                className={cn(
                  "ml-auto flex items-center gap-1.5 text-xs transition-colors",
                  saved ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
                data-testid={`button-save-${post.id}`}
              >
                <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-current")} />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
