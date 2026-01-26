import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, MessageSquare, ExternalLink, StickyNote } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
}

export function SavedPostCard({ post, onOpenNote }: SavedPostCardProps) {
  return (
    <Card className="glass-card border-white/5 p-6 hover-elevate transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback className="bg-primary/5 text-primary">
              {post.author.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h5 className="text-sm font-bold group-hover:text-primary transition-colors">
              {post.author.name}
            </h5>
            <Badge variant="secondary" className="text-[10px] font-bold h-4">
              {post.type.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <h4 className="text-lg font-bold mb-2 line-clamp-1">{post.title}</h4>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {post.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {post.domains.map((domain) => (
          <Badge key={domain} variant="outline" className="text-[10px] border-white/10">
            {domain}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-red-400">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-bold">{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-2 text-primary">
            <Bookmark className="w-4 h-4 fill-primary" />
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={post.note ? "default" : "outline"} 
                  size="sm" 
                  className={cn(
                    "h-8 gap-2",
                    post.note && "bg-primary/20 text-primary hover:bg-primary/30 border-primary/30"
                  )}
                  onClick={() => onOpenNote(post)}
                >
                  <StickyNote className={cn("w-4 h-4", post.note && "fill-primary/20")} />
                  <span className="text-xs font-bold">
                    {post.note ? "View note" : "Add note"}
                  </span>
                  {post.note && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
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
        <Button variant="ghost" size="sm" className="h-8 gap-2">
          <ExternalLink className="w-4 h-4" />
          <span className="text-xs font-bold">Full Post</span>
        </Button>
      </div>
    </Card>
  );
}
