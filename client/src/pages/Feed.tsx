import { memo, useMemo, useState, useEffect, useRef } from "react";
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
  CheckCircle2,
  Send,
  X
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

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

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
  comments?: Comment[];
}

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    type: "idea",
    author: { name: "Alice Visionary", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", role: "Idea Holder" },
    title: "AI-Powered Sustainable Farming",
    content: "We are developing an revolutionary automated sensor network specifically designed for small-scale urban farmers. Our goal is to democratize precision agriculture by making it affordable and accessible to everyone, from balcony gardeners to community farm managers. By utilizing advanced low-energy IoT sensors and machine learning algorithms, our system optimizes water usage based on real-time soil moisture and weather forecasts, significantly increasing crop yields while reducing environmental impact. We're currently looking for early-stage feedback from the agricultural community and potential technical co-founders who are passionate about food security and sustainable living. Our vision is to create a global network of hyper-local, high-efficiency urban farms that can feed cities from within their own boundaries, reducing the carbon footprint of food transportation and ensuring fresh produce is always available. Join us in building the future of decentralized, data-driven agriculture that respects the planet.",
    timestamp: "2h ago",
    stats: { likes: 124, comments: 2 },
    comments: [
      {
        id: "c1",
        author: { name: "Bob Builder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", role: "Developer" },
        content: "This sounds amazing! What kind of sensors are you planning to use for soil moisture?",
        timestamp: "1h ago",
        likes: 5,
        replies: [
          {
            id: "r1",
            author: { name: "Alice Visionary", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", role: "Idea Holder" },
            content: "We are currently testing capacitive sensors for better durability.",
            timestamp: "45m ago",
            likes: 2
          }
        ]
      },
      {
        id: "c2",
        author: { name: "Charlie Capital", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie", role: "Investor" },
        content: "Interested in the scalability of this. Let's connect.",
        timestamp: "30m ago",
        likes: 2
      }
    ]
  },
  {
    id: "2",
    type: "project",
    author: { name: "Bob Builder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", role: "Developer" },
    title: "Open Source CRM for Non-Profits",
    content: "Our team has just reached a major milestone in the DevConnect UI library project. We've officially released version 1.0 of our high-performance, accessible component library built on top of Radix UI and Tailwind CSS. This isn't just another component library; it's a meticulously crafted design system specifically tailored for the needs of the DevConnect ecosystem. Every component has been tested for WCAG 2.1 compliance and optimized for lightning-fast rendering even on low-end devices. We've included over 50+ pre-built patterns for common startup needs, from complex data tables to high-conversion landing page sections. The library is fully themeable and supports automatic dark mode switching out of the box. We are inviting the developer community to contribute, report bugs, and suggest new features as we scale this into a comprehensive framework for building professional, visionary-focused applications. Let's build a better web together, one pixel-perfect component at a time.",
    timestamp: "4h ago",
    stats: { likes: 85, comments: 0 },
    comments: []
  },
  {
    id: "3",
    type: "fund",
    author: { name: "Charlie Capital", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie", role: "Investor" },
    title: "Seed Fund for GreenTech",
    content: "Mike Money Capital is officially opening applications for our early-stage CleanTech Seed Fund for the 2026 cohort. We are actively seeking brilliant founders who are tackling the most pressing environmental challenges through software and deep-tech innovations. Our investment focus is broad but deep, covering areas such as decentralized energy grid management, next-generation carbon capture technologies, circular economy platforms, and sustainable supply chain transparency tools. We don't just provide capital; we offer a comprehensive support ecosystem including mentorship from industry veterans, access to a global network of corporate partners for pilot programs, and dedicated technical resources to help you scale your MVP. If you're building a solution that can realistically mitigate climate change or improve global resource efficiency, we want to hear from you. We are looking for mission-driven teams with high technical competency and a clear path to commercial viability. Let's invest in a future that our children will be proud of.",
    timestamp: "6h ago",
    stats: { likes: 210, comments: 45 },
    comments: []
  }
];

const CommentItem = ({ comment, isReply = false, onReply }: { comment: Comment; isReply?: boolean; onReply: (username: string) => void }) => {
  const [liked, setLiked] = useState(false);
  const [clikes, setClikes] = useState(comment.likes);
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className={cn("flex gap-3 group/comment", isReply && "ml-10 mt-2")}>
      <Avatar className={cn("shrink-0 border border-white/5", isReply ? "h-6 w-6" : "h-8 w-8")}>
        <AvatarImage src={comment.author.avatar} />
        <AvatarFallback className="text-[8px]">{comment.author.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className="text-[11px] font-bold text-white/90 mr-2">{comment.author.name}</span>
            <span className="text-[11px] text-white/80 leading-relaxed">{comment.content}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 ml-0.5">
          <span className="text-[10px] text-muted-foreground/60">{comment.timestamp}</span>
          <button 
            onClick={() => {
              onReply(comment.author.name);
              setShowReplies(true);
            }}
            className="text-[10px] font-bold text-muted-foreground/60 hover:text-white transition-colors"
          >
            Reply
          </button>
          <div className="flex flex-col items-center ml-auto">
            <button 
              onClick={() => { setLiked(!liked); setClikes(prev => liked ? prev - 1 : prev + 1); }}
              className={cn("shrink-0 transition-all hover:scale-110 active:scale-90", liked ? "text-primary" : "text-muted-foreground/40 hover:text-muted-foreground")}
            >
              <Heart className={cn("w-3 h-3", liked && "fill-current")} />
            </button>
            {clikes > 0 && <span className="text-[10px] font-bold text-muted-foreground/60 mt-0.5">{clikes}</span>}
          </div>
        </div>

        {comment.replies && comment.replies.length > 0 && !showReplies && (
          <button 
            onClick={() => setShowReplies(true)}
            className="flex items-center gap-2 mt-2 group/view-replies"
          >
            <div className="w-6 h-[1px] bg-muted-foreground/20 group-hover/view-replies:bg-muted-foreground/40 transition-colors" />
            <span className="text-[10px] font-bold text-muted-foreground/60 group-hover/view-replies:text-white transition-colors">View replies ({comment.replies.length})</span>
          </button>
        )}

        {showReplies && comment.replies?.map(reply => (
          <CommentItem key={reply.id} comment={reply} isReply onReply={onReply} />
        ))}
      </div>
    </div>
  );
};

const FeedCard = memo(({ post }: { post: Post }) => {
  const userRole = localStorage.getItem("userRole") as string;
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowDialog, setShowFollowDialog] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.stats.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [commentInput, setCommentInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleReply = (username: string) => {
    setCommentInput(`@${username.replace(/\s+/g, '').toLowerCase()} `);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        name: "Visionary Builder",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Me`,
        role: userRole || "Member"
      },
      content: commentInput,
      timestamp: "Just now",
      likes: 0
    };

    setComments(prev => [...prev, newComment]);
    setCommentInput("");
  };

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
        <CardHeader className="p-4 flex flex-row items-center justify-between gap-1 space-y-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-primary/10">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold leading-none">{post.author.name}</h4>
                {isFollowing ? (
                  <div className="flex items-center gap-1.5 text-[10px] text-primary/80 font-medium bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                    <CheckCircle2 className="w-3 h-3" />
                    Following
                  </div>
                ) : (
                  <Button 
                    variant="default"
                    size="sm"
                    onClick={handleFollowClick}
                    className="hover-elevate active-elevate-2 inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-primary-border min-h-8 h-5 text-[9px] px-3 transition-all rounded-full min-w-[50px] relative group overflow-hidden bg-primary text-white hover:bg-primary/90 shadow-sm pt-0 pb-0 font-black"
                  >
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                      <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                    </div>
                    <span className="relative z-20 flex items-center gap-1 text-[12px]">
                      Follow
                    </span>
                  </Button>
                )}
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

        <CardContent className="px-4 pb-4 pt-0 space-y-3 h-[320px] relative overflow-hidden">
          <div className={cn(
            "absolute inset-0 z-20 bg-background/98 backdrop-blur-md p-4 flex flex-col h-full transition-all duration-300 ease-in-out",
            showComments ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
          )}>
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Discussions</h4>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full hover:bg-primary/10 transition-colors" 
                onClick={() => setShowComments(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar transition-colors py-2">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
              ))}
              {comments.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary/20" />
                  </div>
                  <p className="text-xs text-muted-foreground italic">No connections have shared their thoughts yet.</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-white/10 shrink-0">
                  <AvatarFallback className="text-[10px] font-bold">ME</AvatarFallback>
                </Avatar>
                <div className="flex-1 relative group/input">
                  <input 
                    ref={inputRef}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Contribute to the vision..." 
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-4 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/30"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleAddComment}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 text-primary/60 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            "space-y-3 transition-all duration-300 h-full flex flex-col justify-center",
            showComments ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
          )}>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1 text-[10px] h-5 px-2">
                {typeIcon}
                <span className="capitalize">{post.type}</span>
              </Badge>
            </div>
            <h3 className="text-lg font-bold font-display leading-tight">{post.title}</h3>
            <div className="relative group/content overflow-hidden flex flex-col items-center flex-1 justify-center">
              <div className="relative w-full">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-[8]">
                  {post.content}
                </p>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none" />
              </div>
              <Button 
                variant="ghost" 
                className="h-auto p-0 text-xs text-primary font-bold hover:no-underline mt-2 bg-transparent border-0 hover:bg-transparent shadow-none relative z-10 mx-auto"
                onClick={() => {
                  // In a real app, this would navigate to a detailed view
                  console.log("View full details for:", post.id);
                }}
              >
                View full {String(post.type) === "investment" ? "investment" : String(post.type) === "project" ? "project" : "idea"}
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex flex-col border-t border-white/5 mt-2 pt-4">
          <div className="flex items-center justify-between w-full gap-2 flex-wrap">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1.5 text-xs transition-all duration-300 active:scale-90",
                  isLiked ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Heart className={cn("w-4 h-4 transition-transform duration-300", isLiked && "fill-current scale-125")} />
                <span className="tabular-nums">{likesCount}</span>
              </button>
              <button 
                onClick={() => setShowComments(!showComments)}
                className={cn(
                  "flex items-center gap-1.5 text-xs transition-colors active:scale-95",
                  showComments ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
                )}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{post.stats.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors active:scale-95">
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
          </div>
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
