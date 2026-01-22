import { memo, useMemo, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  MoreHorizontal,
  TrendingUp,
  Users,
  Lightbulb,
  Briefcase,
  Coins,
  CheckCircle2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const userRole = localStorage.getItem("userRole") as string;
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowDialog, setShowFollowDialog] = useState(false);

  const actionText = useMemo(() => {
    switch (post.type) {
      case "idea": return userRole === "idea-holder" ? null : "Buy Idea";
      case "fund": return "Invest";
      case "project":
      case "recruitment": return "Connect";
      default: return "Connect";
    }
  }, [post.type, userRole]);

  const typeIcon = useMemo(() => {
    switch (post.type) {
      case "idea": return <Lightbulb className="w-4 h-4 text-amber-500" />;
      case "fund": return <Coins className="w-4 h-4 text-emerald-500" />;
      case "project": return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "recruitment": return <Users className="w-4 h-4 text-purple-500" />;
    }
  }, [post.type]);

  const getFollowBenefits = (role: string) => {
    return [
      "Receive real-time notifications for new insights and posts",
      "Get priority response in collaboration requests",
      "Access exclusive community networking events"
    ];
  };

  const handleFollowClick = () => {
    if (isFollowing) {
      setIsFollowing(false);
    } else {
      setShowFollowDialog(true);
    }
  };

  const confirmFollow = () => {
    setIsFollowing(true);
    setShowFollowDialog(false);
  };

  return (
    <>
      <Card className="glass-card border-white/5 hover:border-primary/20 transition-all group/card overflow-hidden">
        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-primary/10">
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold leading-none">{post.author.name}</h4>
                <Button 
                  variant={isFollowing ? "ghost" : "default"}
                  size="sm"
                  onClick={handleFollowClick}
                  className="hover-elevate active-elevate-2 inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-primary-border min-h-8 h-5 text-[9px] px-3 transition-all rounded-full min-w-[50px] relative group overflow-hidden bg-primary text-white hover:bg-primary/90 shadow-sm pl-[10px] pr-[10px] pt-[0px] pb-[0px] font-black"
                >
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                  </div>
                  <span className="relative z-20 flex items-center gap-1 text-[12px]">
                    {isFollowing ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Following
                      </>
                    ) : "Follow"}
                  </span>
                </Button>
              </div>
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
          
          {actionText && (
            <Button size="sm" className="font-bold relative group overflow-hidden">
               <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
              </div>
              <span className="relative z-20">{actionText}</span>
            </Button>
          )}
        </CardFooter>
      </Card>
      <AlertDialog open={showFollowDialog} onOpenChange={setShowFollowDialog}>
        <AlertDialogContent className="glass-card border-white/10 bg-background/90 backdrop-blur-xl max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-primary/20">
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gradient-primary">Follow {post.author.name}?</span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{post.author.role}</span>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-4 space-y-4">
              <p className="text-sm text-white/70">
                By following this <span className="text-primary font-bold">{post.author.role}</span>, you will:
              </p>
              <ul className="space-y-3">
                {getFollowBenefits(post.author.role).map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 mt-6">
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white transition-all h-10">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmFollow}
              className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 h-10 font-bold"
            >
              Follow Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

FeedCard.displayName = "FeedCard";

const FeedSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="glass-card border-white/5 overflow-hidden">
        <CardHeader className="p-4 flex flex-row items-center gap-3">
          <div className="h-10 w-10 rounded-full shimmer-bg" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-24 rounded shimmer-bg" />
            <div className="h-3 w-32 rounded shimmer-bg" />
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 space-y-3">
          <div className="h-5 w-20 rounded shimmer-bg" />
          <div className="h-6 w-3/4 rounded shimmer-bg" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded shimmer-bg" />
            <div className="h-4 w-5/6 rounded shimmer-bg" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function Feed() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
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
