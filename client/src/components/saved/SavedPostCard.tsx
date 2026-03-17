import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, StickyNote } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUserActivity } from "@/hooks/use-user-activity";

export interface SavedPost {
  id: string;
  type: "idea" | "project" | "funding";
  title: string;
  description: string;
  author: {
    name: string;
    avatar?: string;
  };
  domains: string[];
  note?: string;
  likes: number;
}

interface SavedPostCardProps {
  post: SavedPost;
  onOpenNote: (post: SavedPost) => void;
  onClick: (post: SavedPost) => void;
}

export function SavedPostCard({ post, onOpenNote, onClick }: SavedPostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const activity = useUserActivity();

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    activity.toggleSave(post.id, null);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);
    setLikesCount((prev: number) => newLikedStatus ? prev + 1 : prev - 1);
  };

  return (
    <Card 
      className="glass-card border-white/5 p-5 hover-elevate transition-all group flex flex-col h-full overflow-hidden cursor-pointer"
      onClick={() => onClick(post)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-9 w-9 border-2 border-primary/10 shrink-0">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback className="bg-primary/5 text-primary text-xs">
              {post.author.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h5 className="text-xs font-bold group-hover:text-primary transition-colors truncate">
              {post.author.name}
            </h5>
            <Badge variant="secondary" className="text-[9px] font-bold h-3.5 px-1.5">
              {post.type.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <h4 className="text-base font-bold mb-1.5 line-clamp-1 leading-tight">{post.title}</h4>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
        {post.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.domains.map((domain) => (
          <Badge key={domain} variant="outline" className="text-[9px] px-1.5 py-0 border-white/10 whitespace-nowrap">
            {domain}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "h-8 gap-1.5 px-2 transition-colors shrink-0",
              isLiked ? "text-red-400 font-bold" : "text-muted-foreground hover:text-red-400"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-current")} />
            <span className="text-[11px] font-bold tabular-nums">{likesCount}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-primary shrink-0"
            onClick={handleSaveToggle}
          >
            <Bookmark className="w-3.5 h-3.5 fill-primary" />
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={post.note ? "default" : "outline"} 
                  size="sm" 
                  className={cn(
                    "h-8 gap-1.5 px-2 shrink-0 relative",
                    post.note && "bg-primary/20 text-primary hover:bg-primary/30 border-primary/30"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenNote(post);
                  }}
                >
                  <StickyNote className={cn("w-3.5 h-3.5", post.note && "fill-primary/20")} />
                  <span className="text-[11px] font-bold">
                    {post.note ? "Note" : "Add note"}
                  </span>
                  {post.note && <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse" />}
                </Button>
              </TooltipTrigger>
              {post.note && (
                <TooltipContent className="max-w-[200px] glass-card border-white/10">
                  <p className="text-xs">{post.note.substring(0, 30)}...</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
}
