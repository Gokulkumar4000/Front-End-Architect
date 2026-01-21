import { memo, useMemo, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  MoreHorizontal,
  TrendingUp,
  Users,
  Lightbulb,
  Briefcase,
  Coins
} from "lucide-react";

type PostType = "idea" | "project" | "fund" | "recruitment";

interface Post {
  id: string;
  type: PostType;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  title: string;
  timestamp: string;
  stats: {
    likes: number;
    comments: number;
  };
}

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    type: "idea",
    author: { name: "Alice Visionary", avatar: "", role: "Idea Holder" },
    title: "AI-Powered Sustainable Farming",
    content: "Building an automated sensor network for small-scale urban farmers to optimize water usage and crop yield.",
    timestamp: "2h ago",
    stats: { likes: 124, comments: 18 }
  },
  {
    id: "2",
    type: "project",
    author: { name: "Bob Builder", avatar: "", role: "Developer" },
    title: "Open Source CRM for Non-Profits",
    content: "A lightweight, privacy-focused CRM designed specifically for small volunteer organizations.",
    timestamp: "4h ago",
    stats: { likes: 85, comments: 12 }
  },
  {
    id: "3",
    type: "fund",
    author: { name: "Charlie Capital", avatar: "", role: "Investor" },
    title: "Seed Fund for GreenTech",
    content: "Looking for early-stage startups focused on carbon capture and storage solutions.",
    timestamp: "6h ago",
    stats: { likes: 210, comments: 45 }
  }
];

const FeedCard = memo(({ post }: { post: Post }) => {
  const actionText = useMemo(() => {
    switch (post.type) {
      case "idea": return "Buy Idea";
      case "fund": return "Invest";
      case "project":
      case "recruitment": return "Connect";
      default: return "Connect";
    }
  }, [post.type]);

  const typeIcon = useMemo(() => {
    switch (post.type) {
      case "idea": return <Lightbulb className="w-4 h-4 text-amber-500" />;
      case "fund": return <Coins className="w-4 h-4 text-emerald-500" />;
      case "project": return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "recruitment": return <Users className="w-4 h-4 text-purple-500" />;
    }
  }, [post.type]);

  return (
    <Card className="glass-card border-white/5 hover:border-primary/20 transition-all group/card overflow-hidden">
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-primary/10">
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-sm font-bold leading-none">{post.author.name}</h4>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-medium">
              {post.author.role} • {post.timestamp}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1 text-[10px] h-5 px-2">
            {typeIcon}
            <span className="capitalize">{post.type}</span>
          </Badge>
        </div>
        <h3 className="text-lg font-bold font-display leading-tight">{post.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {post.content}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-white/5 mt-2 pt-4">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
            <Heart className="w-4 h-4" />
            <span>{post.stats.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>{post.stats.comments}</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        
        <Button size="sm" className="font-bold relative group overflow-hidden">
           <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
          </div>
          <span className="relative z-20">{actionText}</span>
        </Button>
      </CardFooter>
    </Card>
  );
});

FeedCard.displayName = "FeedCard";

const FeedSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="glass-card border-white/5 overflow-hidden">
        <CardHeader className="p-4 flex flex-row items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 space-y-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function Feed() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-display font-bold text-gradient-primary">Activity Feed</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs font-bold">Latest</Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-muted-foreground">Trending</Button>
            </div>
          </div>
          
          {loading ? (
            <FeedSkeleton />
          ) : (
            MOCK_POSTS.map(post => (
              <FeedCard key={post.id} post={post} />
            ))
          )}
        </div>

        {/* Right Panel */}
        <div className="hidden lg:block space-y-6">
          <Card className="glass-card border-white/5 p-6">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Platform Stats</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-muted-foreground">Active Ideas</span>
                </div>
                <span className="text-sm font-bold">1,248</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Total Builders</span>
                </div>
                <span className="text-sm font-bold">45.2k</span>
              </div>
            </div>
          </Card>

          <Card className="glass-card border-white/5 p-6">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Trending Posts</h4>
            <div className="space-y-3">
              {[
                "The Future of Web3 in 2026",
                "Sustainable Tech: More than a trend",
                "Why MVPs Fail: A post-mortem"
              ].map((topic, i) => (
                <div key={topic} className="group cursor-pointer">
                  <p className="text-[10px] text-muted-foreground mb-0.5">#{i+1} Trending</p>
                  <h5 className="text-xs font-bold group-hover:text-primary transition-colors line-clamp-1">{topic}</h5>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass-card border-white/5 p-6">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Suggested Connections</h4>
            <div className="space-y-4">
              {[
                { name: "Sarah Tech", role: "CTO" },
                { name: "Mike Money", role: "Angel Investor" }
              ].map(person => (
                <div key={person.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{person.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <h5 className="text-xs font-bold truncate">{person.name}</h5>
                      <p className="text-[10px] text-muted-foreground truncate">{person.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2">Follow</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
