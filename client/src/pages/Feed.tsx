import { memo, useMemo, useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  X,
  Bookmark,
  Eye,
  Flag,
  Slash,
  UserX,
  Copy,
  Check,
  Lock,
  ChevronRight,
  Info,
  Target,
  BarChart3,
  Rocket,
  ShieldCheck,
  Zap,
  HelpCircle,
  FileText,
  Star,
  Calendar,
  GraduationCap,
  Bell,
  PieChart,
  Map
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface DetailsSidebarProps {
  post: Post;
  isOwner: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
  isLiked: boolean;
  isSaved: boolean;
  handleLike: () => void;
  handleSave: () => void;
  setShowShareDialog: (show: boolean) => void;
  typeIcon: React.ReactNode;
}

const DetailsSidebar = ({ 
  post, 
  isOwner, 
  activeSection, 
  setActiveSection, 
  isLiked, 
  isSaved, 
  handleLike, 
  handleSave, 
  setShowShareDialog,
  typeIcon 
}: DetailsSidebarProps) => {
  const navItems = useMemo(() => {
    const isIdea = post.type === "idea";
    if (isIdea) {
      return [
        { id: "overview", label: "Overview", icon: Info, locked: false },
        { id: "problem", label: "Problem Statement", icon: Target, locked: false },
        { id: "solution", label: "Solution Snapshot", icon: Zap, locked: !isOwner },
        { id: "traction", label: "Validation & Traction", icon: BarChart3, locked: !isOwner },
        { id: "market", label: "Market & Business", icon: Coins, locked: !isOwner },
        { id: "needs", label: "Collaboration Needs", icon: Users, locked: false },
        { id: "owner", label: "Owner Panel", icon: ShieldCheck, locked: !isOwner, ownerOnly: true },
      ];
    }
    
    if (post.type === "project") {
      return [
        { id: "overview", label: "Overview", icon: Info },
        { id: "problem", label: "Problem Statement", icon: HelpCircle },
        { id: "description", label: "Project Description", icon: FileText },
        { id: "roles", label: "Roles Needed", icon: Users },
        { id: "skills", icon: Star, label: "Skills Required" },
        { id: "timeline", label: "Timeline & Milestones", icon: Calendar },
        { id: "benefits", label: "Benefits & Learning", icon: GraduationCap },
        { id: "team", label: "Team & Owner", icon: ShieldCheck },
        { id: "updates", label: "Updates", icon: Bell },
      ];
    }

    if (post.type === "fund") {
      return [
        { id: "overview", label: "Overview", icon: Info },
        { id: "goal", label: "Funding Goal", icon: Target },
        { id: "status", label: "Current Status", icon: BarChart3 },
        { id: "usage", label: "Fund Usage", icon: PieChart },
        { id: "progress", label: "Progress & Trends", icon: TrendingUp },
        { id: "roadmap", label: "Roadmap", icon: Map },
        { id: "updates", label: "Updates", icon: Bell },
        { id: "supporters", label: "Supporters & Activity", icon: Users },
        { id: "team", label: "Team / Founder", icon: ShieldCheck },
      ];
    }

    return [{ id: "overview", label: "Overview", icon: Info }];
  }, [post.type, isOwner]);

  return (
    <div className="w-full md:w-64 bg-white/[0.02] border-r border-white/5 p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          {typeIcon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white leading-none capitalize">{post.type}</h3>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">Navigation</p>
        </div>
      </div>

      <div className="space-y-1">
        {navItems.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-300 group/nav relative overflow-hidden",
              activeSection === section.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-white/5 hover:text-white active-elevate-2"
            )}
          >
            {activeSection === section.id && (
              <div className="absolute inset-0 translate-x-[-100%] animate-[shimmer_2s_infinite] pointer-events-none z-10">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-purple-400/20 to-transparent skew-x-[-20deg]" />
              </div>
            )}
            <div className="flex items-center gap-3 relative z-20">
              <section.icon className={cn("w-4 h-4", activeSection === section.id ? "text-white" : "text-muted-foreground group-hover/nav:text-primary")} />
              <span className="font-medium">{section.label}</span>
            </div>
            <div className="relative z-20">
              {('locked' in section && section.locked && !('ownerOnly' in section)) && <Lock className="w-3 h-3 text-muted-foreground/50" />}
              {('ownerOnly' in section && section.ownerOnly) && <Lock className="w-3 h-3 text-primary/80" />}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto p-4 rounded-xl bg-primary/5 border border-primary/10">
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Engagement</p>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10 rounded-full" onClick={handleLike}>
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10 rounded-full" onClick={handleSave}>
            <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10 rounded-full" onClick={() => setShowShareDialog(true)}>
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const CommentItem = ({ comment, isReply = false, onReply, parentId }: { comment: Comment; isReply?: boolean; onReply: (username: string, commentId: string) => void; parentId?: string }) => {
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
              onReply(comment.author.name, parentId || comment.id);
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

        {(comment.replies && comment.replies.length > 0) && (
          <button 
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-2 mt-2 group/view-replies"
          >
            <div className="w-6 h-[1px] bg-muted-foreground/20 group-hover/view-replies:bg-muted-foreground/40 transition-colors" />
            <span className="text-[10px] font-bold text-muted-foreground/60 group-hover/view-replies:text-white transition-colors">
              {showReplies ? "Hide replies" : `View replies (${comment.replies.length})`}
            </span>
          </button>
        )}

        {showReplies && comment.replies?.map(reply => (
          <CommentItem key={reply.id} comment={reply} isReply onReply={onReply} parentId={parentId || comment.id} />
        ))}
      </div>
    </div>
  );
};

const FeedCard = memo(({ post }: { post: Post }) => {
  const userRole = localStorage.getItem("userRole") as string;
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowDialog, setShowFollowDialog] = useState(false);
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.stats.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [commentInput, setCommentInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const postUrl = `${window.location.origin}/post/${post.id}`;

  const isIdea = post.type === "idea";
  const isOwner = false; // Mock owner check

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Post URL has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try manually copying the link.",
        variant: "destructive",
      });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleReply = (username: string, commentId: string) => {
    setReplyTo({ id: commentId, name: username });
    const mention = `@${username.replace(/\s+/g, '').toLowerCase()} `;
    setCommentInput(mention);
    
    // Use requestAnimationFrame to ensure the cursor is placed after the state update
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const length = mention.length;
        inputRef.current.setSelectionRange(length, length);
      }
    });
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

    if (replyTo) {
      setComments(prev => prev.map(c => {
        if (c.id === replyTo.id) {
          return { ...c, replies: [...(c.replies || []), newComment] };
        }
        // Also check nested replies to allow replying to a reply
        if (c.replies?.some(r => r.id === replyTo.id)) {
          return { ...c, replies: [...(c.replies || []), newComment] };
        }
        return c;
      }));
      setReplyTo(null);
    } else {
      setComments(prev => [...prev, newComment]);
    }
    setCommentInput("");
  };

  const totalComments = useMemo(() => {
    const countNested = (cms: Comment[]): number => {
      return cms.reduce((acc, curr) => acc + 1 + (curr.replies ? countNested(curr.replies) : 0), 0);
    };
    return countNested(comments);
  }, [comments]);

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
    setShowFollowDialog(true);
  };

  const handleUnfollowClick = () => {
    setIsFollowing(false);
    setShowUnfollowDialog(false);
    toast({
      title: "Unfollowed",
      description: `You are no longer following ${post.author.name}.`,
    });
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
                  <button 
                    onClick={() => setShowUnfollowDialog(true)}
                    className="flex items-center gap-1.5 text-[10px] text-primary/80 font-medium bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10 hover:bg-primary/10 transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Following
                  </button>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 rounded-full transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-white/10 bg-background/80 backdrop-blur-xl w-48 p-1 animate-in fade-in zoom-in-95 duration-200">
              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 cursor-pointer focus:bg-primary/10 rounded-md group/menu-item transition-colors">
                <Eye className="w-4 h-4 text-muted-foreground group-hover/menu-item:text-primary transition-colors" />
                <span className="text-xs font-medium group-hover/menu-item:text-primary transition-colors">View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowShareDialog(true)}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer focus:bg-primary/10 rounded-md group/menu-item transition-colors"
              >
                <Share2 className="w-4 h-4 text-muted-foreground group-hover/menu-item:text-primary transition-colors" />
                <span className="text-xs font-medium group-hover/menu-item:text-primary transition-colors">Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5 my-1" />
              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 cursor-pointer focus:bg-primary/10 rounded-md group/menu-item transition-colors">
                <Slash className="w-4 h-4 text-muted-foreground group-hover/menu-item:text-primary transition-colors" />
                <span className="text-xs font-medium group-hover/menu-item:text-primary transition-colors">Not Interested</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 cursor-pointer focus:bg-destructive/10 text-destructive rounded-md group/menu-item transition-colors">
                <UserX className="w-4 h-4" />
                <span className="text-xs font-medium">Block User</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 cursor-pointer focus:bg-destructive/10 text-destructive rounded-md group/menu-item transition-colors">
                <Flag className="w-4 h-4" />
                <span className="text-xs font-medium">Report Post</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                onClick={() => setShowDetailsDialog(true)}
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
                <span className="tabular-nums">{totalComments}</span>
              </button>
              <button 
                onClick={handleSave}
                className={cn(
                  "flex items-center gap-1.5 text-xs transition-colors active:scale-95",
                  isSaved ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
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

      <AlertDialog open={showUnfollowDialog} onOpenChange={setShowUnfollowDialog}>
        <AlertDialogContent className="glass-card border-white/10 bg-background/90 backdrop-blur-xl max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-primary/20">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gradient-primary">Unfollow {post.author.name}?</span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{post.author.role}</span>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-4">
              <p className="text-sm text-white/70">
                Are you sure you want to unfollow <span className="text-primary font-bold">{post.author.name}</span>? You will stop receiving updates from this visionary.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 mt-6">
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white transition-all h-10">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleUnfollowClick}
              className="bg-destructive text-white hover:bg-destructive/90 shadow-lg shadow-destructive/20 h-10 font-bold"
            >
              Unfollow
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="glass-card border-white/10 bg-background/90 backdrop-blur-xl max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-gradient-primary">Share Post</DialogTitle>
            <DialogDescription className="text-white/70">
              Copy the link below to share this vision with your network.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-md p-2 text-[11px] text-white/60 break-all">
              {postUrl}
            </div>
            <Button 
              size="sm" 
              onClick={handleCopyLink}
              className="shrink-0 font-bold h-9"
            >
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="glass-card border-white/10 bg-background/95 backdrop-blur-2xl max-w-[900px] w-[95vw] h-[80vh] p-0 overflow-hidden flex flex-col md:flex-row border-0 shadow-2xl">
          {/* Sidebar Navigation */}
          <DetailsSidebar 
            post={post} 
            isOwner={isOwner} 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            isLiked={isLiked}
            isSaved={isSaved}
            handleLike={handleLike}
            handleSave={handleSave}
            setShowShareDialog={setShowShareDialog}
            typeIcon={typeIcon}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-background/40">
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-bold text-white leading-none">{post.title}</h2>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">{post.author.name} • {post.author.role}</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="max-w-2xl mx-auto space-y-8">
                {activeSection === "overview" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Info className="w-4 h-4" /> {post.type === "idea" ? "Project Overview" : post.type === "project" ? "Project Overview" : "Funding Overview"}
                    </h3>
                    <div className="prose prose-invert prose-sm">
                      <p className="text-white/80 leading-relaxed text-base italic border-l-2 border-primary/30 pl-4 py-2 bg-primary/[0.02] rounded-r-lg">
                        {post.type === "idea" 
                          ? "\"Bridging the gap between initial concept and real-world implementation through data-driven innovation.\""
                          : post.type === "project"
                          ? `\"${post.title}: ${post.content.substring(0, 100)}...\"`
                          : `\"Trust-based funding for ${post.title}. Full transparency on goals and usage.\"`}
                      </p>
                      <div className="flex items-center gap-3 mt-6 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                         <div className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                           {post.type === "project" ? "Status: In Progress" : post.type === "fund" ? "Stage: Growth" : "Stage: Concept"}
                         </div>
                         <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                           Category: {post.type === "idea" ? "SaaS / AI" : post.type === "project" ? "Open Source" : "FinTech"}
                         </div>
                      </div>
                      {post.type === "fund" && (
                        <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                          <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
                            <span>Duration</span>
                            <span className="text-white font-bold">Jan 2026 - June 2026</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
                            <span>Creator</span>
                            <span className="text-white font-bold">GreenTech Solutions Org</span>
                          </div>
                        </div>
                      )}
                      <p className="text-white/70 leading-relaxed text-sm mt-6">
                        {post.content}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                      {[
                        { label: post.type === "fund" ? "Supporters" : "Team Size", value: post.type === "fund" ? "124" : "3-5 People", icon: Users },
                        { label: post.type === "fund" ? "Goal" : "Timeline", value: post.type === "fund" ? "$50,000" : "6 Months", icon: post.type === "fund" ? Coins : Calendar },
                        { label: "Domain", value: "Global", icon: Map },
                      ].map((stat) => (
                        <div key={stat.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-colors group">
                          <stat.icon className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors mb-2" />
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">{stat.label}</p>
                          <p className="text-xs font-bold text-white mt-1">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === "goal" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <Target className="w-4 h-4" /> Funding Goal
                    </h3>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Target Amount</p>
                          <p className="text-3xl font-bold text-white">$50,000</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Min. Contribution</p>
                          <p className="text-xl font-bold text-white">$100</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Deadline</p>
                          <p className="text-xs font-bold text-white">June 30, 2026</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Currency</p>
                          <p className="text-xs font-bold text-white">USD (Digital Assets)</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-primary">Progress</span>
                          <span className="text-muted-foreground">Target Reach</span>
                        </div>
                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-[65%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "status" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" /> Current Status
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Amount Raised</p>
                        <p className="text-4xl font-bold text-primary">$32,500</p>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">65% Completed</Badge>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: "Raised", value: "$32,500", icon: TrendingUp },
                          { label: "Remaining", value: "$17,500", icon: Coins },
                          { label: "Supporters", value: "124", icon: Users },
                          { label: "Days Left", value: "42 Days", icon: Calendar },
                        ].map((stat) => (
                          <div key={stat.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <stat.icon className="w-4 h-4 text-primary/40" />
                              <span className="text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                            </div>
                            <span className="text-xs font-bold text-white">{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                        <span className="text-primary">Live Funding Progress</span>
                        <span className="text-muted-foreground">65%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[65%]" />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "usage" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <PieChart className="w-4 h-4" /> Fund Usage Breakdown
                    </h3>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-8">
                      <div className="flex items-center justify-center py-6">
                         {/* CSS-only Donut Chart approximation */}
                         <div className="relative w-48 h-48 rounded-full border-[16px] border-white/5 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[16px] border-blue-500 border-t-transparent border-r-transparent rotate-45" />
                            <div className="absolute inset-0 rounded-full border-[16px] border-purple-500 border-b-transparent border-l-transparent -rotate-12" />
                            <div className="text-center">
                              <p className="text-2xl font-bold text-white">100%</p>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Allocation</p>
                            </div>
                         </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { label: "Product Development", value: "40%", amount: "$20,000", color: "bg-blue-500", desc: "Core engineering & infra" },
                          { label: "Marketing", value: "25%", amount: "$12,500", color: "bg-purple-500", desc: "Growth & community" },
                          { label: "Operations", value: "20%", amount: "$10,000", color: "bg-emerald-500", desc: "Legal & administration" },
                          { label: "Miscellaneous", value: "15%", amount: "$7,500", color: "bg-amber-500", desc: "Contingency funds" }
                        ].map((item) => (
                          <div key={item.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-primary/20 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className={cn("w-2 h-2 rounded-full", item.color)} />
                                <span className="text-xs font-bold text-white/90">{item.label}</span>
                              </div>
                              <span className="text-xs font-bold text-primary">{item.value}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mb-2">{item.desc}</p>
                            <p className="text-xs font-bold text-white/60">{item.amount}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "progress" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Progress & Trends
                    </h3>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-8">
                       <div className="h-64 flex flex-col justify-end gap-1 relative pt-10">
                          <div className="absolute top-0 left-0 space-y-1">
                             <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Funding Growth</p>
                             <p className="text-lg font-bold text-white">Steady Upward Trend</p>
                          </div>
                          {/* Visual representation of a line chart using simple divs */}
                          <div className="flex items-end justify-between h-40 px-2">
                             {[20, 35, 30, 45, 60, 55, 75, 80, 70, 90, 100].map((h, i) => (
                               <div key={i} className="w-full mx-0.5 group relative">
                                  <div 
                                    className="w-full bg-primary/20 group-hover:bg-primary/40 transition-colors rounded-t-sm" 
                                    style={{ height: `${h}%` }}
                                  />
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background border border-white/10 rounded text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    Week {i+1}: {h}%
                                  </div>
                               </div>
                             ))}
                          </div>
                          <div className="flex justify-between border-t border-white/5 pt-2">
                             <span className="text-[9px] text-muted-foreground">Week 1</span>
                             <span className="text-[9px] text-muted-foreground">Week 6</span>
                             <span className="text-[9px] text-muted-foreground">Week 12</span>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                             <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Growth Rate</p>
                             <p className="text-xl font-bold text-emerald-500">+12% WoW</p>
                          </div>
                          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                             <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Total Supporters</p>
                             <p className="text-xl font-bold text-white">124 Members</p>
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {activeSection === "roadmap" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <Map className="w-4 h-4" /> Funding Roadmap
                    </h3>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="space-y-0 relative before:absolute before:inset-0 before:left-[11px] before:w-[2px] before:bg-white/5">
                        {[
                          { level: "25%", title: "Core Infrastructure", outcome: "MVP development and initial cloud deployment", timeline: "Q1 2026", status: "completed" },
                          { level: "50%", title: "Beta Launch", outcome: "Limited release to first 500 waitlist users", timeline: "Q2 2026", status: "current" },
                          { level: "75%", title: "Marketing Expansion", outcome: "Global outreach and community scaling programs", timeline: "Q3 2026", status: "upcoming" },
                          { level: "100%", title: "Full Public Launch", outcome: "V1.0 release with full feature set and support", timeline: "Q4 2026", status: "upcoming" }
                        ].map((milestone, idx) => (
                          <div key={milestone.level} className="relative pl-10 pb-10 last:pb-0">
                            <div className={cn(
                              "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 z-10",
                              milestone.status === "completed" ? "bg-primary border-primary" : 
                              milestone.status === "current" ? "bg-background border-primary animate-pulse" : "bg-background border-white/10"
                            )}>
                              {milestone.status === "completed" && <Check className="w-3 h-3 text-white" />}
                              {milestone.status === "current" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{milestone.level}</span>
                                <span className="text-xs font-bold text-white">{milestone.title}</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{milestone.outcome}</p>
                              <p className="text-[10px] text-white/40 font-medium uppercase tracking-tighter">{milestone.timeline}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "updates" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <Bell className="w-4 h-4" /> Updates & Announcements
                    </h3>
                    <div className="space-y-4">
                      {[
                        { title: "Reached 65% of our goal!", date: "2 days ago", content: "Huge thanks to our new community supporters. We've officially unlocked the infrastructure milestone.", type: "milestone" },
                        { title: "Technical Architecture Reveal", date: "1 week ago", content: "We're sharing a deep dive into our decentralized energy management system tonight at 6 PM EST.", type: "update" },
                        { title: "Seed Round Opening", date: "2 weeks ago", content: "Applications for the first cohort are now live. Founders, check your dashboards for the intake form.", type: "announcement" }
                      ].map((update, i) => (
                        <div key={update.title} className={cn(
                          "p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group",
                          i === 0 && "border-primary/20 bg-primary/[0.02]"
                        )}>
                          {i === 0 && <div className="absolute top-0 right-0 px-3 py-1 bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-widest rounded-bl-xl">New</div>}
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{update.date}</p>
                          <h4 className="text-sm font-bold text-white mb-2 group-hover:text-primary transition-colors">{update.title}</h4>
                          <p className="text-xs text-white/60 leading-relaxed">{update.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === "team" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Team & Founder
                    </h3>
                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-6">
                        <Avatar className="h-20 w-20 border-2 border-primary/20">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-xl font-bold text-white leading-none">{post.author.name}</h4>
                            <p className="text-xs text-primary font-medium mt-1">{post.author.role}</p>
                          </div>
                          <p className="text-xs text-white/60 leading-relaxed">
                            Visionary founder with 10+ years in sustainable tech and decentralized systems. Previously built and scaled two successful climate-focused startups.
                          </p>
                          <div className="flex gap-2">
                             <Badge variant="outline" className="text-[9px] border-white/10">Founder</Badge>
                             <Badge variant="outline" className="text-[9px] border-white/10">10x Builder</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { name: "Sarah Chen", role: "CTO / Engineering", bio: "Ex-Google engineer, distributed systems expert." },
                          { name: "Marcus Miller", role: "Head of Operations", bio: "Specialist in supply chain transparency & logistics." }
                        ].map(member => (
                          <div key={member.name} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <h5 className="text-sm font-bold text-white">{member.name}</h5>
                            <p className="text-[10px] text-primary mb-2">{member.role}</p>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">{member.bio}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "supporters" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <Users className="w-4 h-4" /> Community Supporters
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: "John Builder", type: "Platinum", range: "$5k - $10k" },
                        { name: "Anonymous", type: "Gold", range: "$2k - $5k" },
                        { name: "Elena Vision", type: "Silver", range: "$500 - $2k" },
                        { name: "Marcus Capital", type: "Gold", range: "$2k - $5k" }
                      ].map((supporter, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{supporter.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h5 className="text-xs font-bold text-white">{supporter.name}</h5>
                              <p className="text-[10px] text-muted-foreground">{supporter.type} Supporter</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-[9px] bg-primary/5 text-primary">{supporter.range}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(post.type !== "fund" && isIdea && !isOwner && ["solution", "traction", "market"].includes(activeSection)) ? (
                  <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full" />
                      <Lock className="w-8 h-8 text-primary relative z-10" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                      <h3 className="text-xl font-bold text-white">Restricted Access</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        To protect the integrity of this vision, {activeSection} details are only visible to verified collaborators and investors.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                      <Button className="flex-1 font-bold shadow-lg shadow-primary/20">Request Access</Button>
                      <Button variant="outline" className="flex-1 font-bold border-white/10 hover:bg-white/5">Connect</Button>
                    </div>
                  </div>
                ) : (
                  activeSection !== "overview" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                       <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                        {activeSection === "solution" && <Zap className="w-4 h-4" />}
                        {activeSection === "market" && <Target className="w-4 h-4" />}
                        {activeSection === "traction" && <BarChart3 className="w-4 h-4" />}
                        {activeSection === "needs" && <Users className="w-4 h-4" />}
                        {activeSection === "owner" && <ShieldCheck className="w-4 h-4" />}
                        {activeSection}
                      </h3>
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                        <p className="text-sm text-white/70 leading-relaxed">
                          Detailed implementation strategies, market analysis reports, and validation metrics for the {post.title} initiative.
                        </p>
                        <div className="h-32 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-white/5 flex items-center justify-center italic text-muted-foreground text-xs">
                          Extended content for {activeSection} section...
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-white/5 bg-white/[0.02] shrink-0">
              <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <Avatar key={i} className="h-7 w-7 border-2 border-background">
                        <AvatarFallback className="text-[8px]">U{i}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">12 others are interested</span>
                </div>
                <Button size="sm" className="font-bold px-6 h-9 shadow-lg shadow-primary/20">
                  {actionText || "Get Involved"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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

const TRENDING_POSTS_DATA = [
  { id: 1, title: "The Future of Web3 in 2026", author: "Alice Visionary", likes: 2847, comments: 342 },
  { id: 2, title: "Sustainable Tech: More than a trend", author: "Bob Builder", likes: 2534, comments: 289 },
  { id: 3, title: "Why MVPs Fail: A post-mortem", author: "Charlie Dev", likes: 2156, comments: 267 },
  { id: 4, title: "AI-Powered Development: The New Normal", author: "Diana Code", likes: 1892, comments: 198 },
  { id: 5, title: "Building in Public: Lessons Learned", author: "Evan Startup", likes: 1756, comments: 187 },
  { id: 6, title: "From Zero to Series A in 18 Months", author: "Fiona Founder", likes: 1654, comments: 176 },
  { id: 7, title: "The Rise of No-Code Platforms", author: "George Tech", likes: 1543, comments: 165 },
  { id: 8, title: "Remote Team Management Best Practices", author: "Hannah HR", likes: 1432, comments: 154 },
  { id: 9, title: "Scaling Your Startup: Common Pitfalls", author: "Ian Investor", likes: 1321, comments: 143 },
  { id: 10, title: "UX Design for SaaS Products", author: "Julia Design", likes: 1210, comments: 132 },
  { id: 11, title: "Customer Discovery: Finding Product-Market Fit", author: "Kevin PM", likes: 1198, comments: 128 },
  { id: 12, title: "The Art of Pitching to VCs", author: "Lisa Pitch", likes: 1087, comments: 117 },
  { id: 13, title: "Bootstrapping vs Raising Capital", author: "Mike Money", likes: 976, comments: 106 },
  { id: 14, title: "Technical Debt: When to Pay It Off", author: "Nancy CTO", likes: 965, comments: 95 },
  { id: 15, title: "Building a Developer Community", author: "Oscar DevRel", likes: 854, comments: 84 },
  { id: 16, title: "The Future of Remote Work", author: "Paula Remote", likes: 843, comments: 73 },
  { id: 17, title: "Hiring Your First 10 Engineers", author: "Quinn Hire", likes: 732, comments: 62 },
  { id: 18, title: "Growth Hacking for Early-Stage Startups", author: "Rachel Growth", likes: 721, comments: 51 },
  { id: 19, title: "API Design Best Practices", author: "Sam Backend", likes: 610, comments: 40 },
  { id: 20, title: "Mobile-First Development Strategy", author: "Tina Mobile", likes: 599, comments: 39 },
  { id: 21, title: "Security Considerations for Startups", author: "Uma Security", likes: 588, comments: 38 },
  { id: 22, title: "Data-Driven Decision Making", author: "Victor Data", likes: 577, comments: 37 },
  { id: 23, title: "Building Inclusive Products", author: "Wendy DEI", likes: 566, comments: 36 },
  { id: 24, title: "The Psychology of User Engagement", author: "Xavier UX", likes: 555, comments: 35 },
  { id: 25, title: "Microservices vs Monolith", author: "Yara Arch", likes: 544, comments: 34 },
  { id: 26, title: "Effective Sprint Planning", author: "Zach Agile", likes: 533, comments: 33 },
  { id: 27, title: "Cloud Cost Optimization Tips", author: "Amy Cloud", likes: 522, comments: 32 },
  { id: 28, title: "Building Real-Time Applications", author: "Ben Real", likes: 511, comments: 31 },
  { id: 29, title: "The Impact of AI on Jobs", author: "Carol AI", likes: 500, comments: 30 },
  { id: 30, title: "Creating Viral Content", author: "Dan Viral", likes: 489, comments: 29 },
  { id: 31, title: "Edge Computing Explained", author: "Emma Edge", likes: 478, comments: 28 },
  { id: 32, title: "Building Trust with Users", author: "Frank Trust", likes: 467, comments: 27 },
  { id: 33, title: "The Art of Delegation", author: "Grace Lead", likes: 456, comments: 26 },
  { id: 34, title: "Open Source Business Models", author: "Henry Open", likes: 445, comments: 25 },
  { id: 35, title: "Monitoring and Observability", author: "Ivy Ops", likes: 434, comments: 24 },
  { id: 36, title: "Cross-Platform Development", author: "Jack Cross", likes: 423, comments: 23 },
  { id: 37, title: "Building Accessible Interfaces", author: "Kate A11y", likes: 412, comments: 22 },
  { id: 38, title: "The Future of Payments", author: "Leo Fintech", likes: 401, comments: 21 },
  { id: 39, title: "Machine Learning for Beginners", author: "Mia ML", likes: 390, comments: 20 },
  { id: 40, title: "Sustainable Software Engineering", author: "Noah Green", likes: 379, comments: 19 },
  { id: 41, title: "Building APIs That Scale", author: "Olivia Scale", likes: 368, comments: 18 },
  { id: 42, title: "The Power of User Feedback", author: "Pete Feedback", likes: 357, comments: 17 },
  { id: 43, title: "Effective Documentation Practices", author: "Quinn Docs", likes: 346, comments: 16 },
  { id: 44, title: "Testing Strategies for Startups", author: "Rose Test", likes: 335, comments: 15 },
  { id: 45, title: "Building a Strong Brand", author: "Steve Brand", likes: 324, comments: 14 },
  { id: 46, title: "Understanding Your Competition", author: "Tara Compete", likes: 313, comments: 13 },
  { id: 47, title: "The Value of Side Projects", author: "Uri Side", likes: 302, comments: 12 },
  { id: 48, title: "Building Resilient Systems", author: "Val Resilient", likes: 291, comments: 11 },
  { id: 49, title: "The Art of Code Reviews", author: "Will Review", likes: 280, comments: 10 },
  { id: 50, title: "Planning for Scale from Day One", author: "Xena Scale", likes: 269, comments: 9 }
];

export default function Feed() {
  const [loading, setLoading] = useState(true);
  const [showTrendingDialog, setShowTrendingDialog] = useState(false);
  const [trendingPage, setTrendingPage] = useState(1);
  const postsPerPage = 10;
  const totalPages = 5;

  const paginatedTrendingPosts = TRENDING_POSTS_DATA.slice(
    (trendingPage - 1) * postsPerPage,
    trendingPage * postsPerPage
  );

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
              {TRENDING_POSTS_DATA.slice(0, 3).map((post, i) => (
                <div 
                  key={post.id} 
                  className={cn(
                    "group cursor-pointer p-2 rounded-lg transition-all",
                    i === 0 && "bg-gradient-to-r from-primary/20 to-primary/5 shadow-[0_0_20px_rgba(168,85,247,0.4)]",
                    i === 1 && "bg-gradient-to-r from-primary/15 to-primary/5 shadow-[0_0_12px_rgba(168,85,247,0.25)]",
                    i === 2 && "bg-gradient-to-r from-primary/10 to-transparent shadow-[0_0_6px_rgba(168,85,247,0.15)]"
                  )}
                >
                  <p className="text-[10px] text-muted-foreground mb-0.5">#{i+1} Trending</p>
                  <h5 className="text-xs font-bold group-hover:text-primary transition-colors line-clamp-1">{post.title}</h5>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {post.likes.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> {post.comments}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 text-xs" 
              onClick={() => setShowTrendingDialog(true)}
              data-testid="button-view-more-trending"
            >
              View More
            </Button>
          </Card>

          <Dialog open={showTrendingDialog} onOpenChange={setShowTrendingDialog}>
            <DialogContent className="glass-card border-white/10 bg-background/95 backdrop-blur-xl max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-gradient-primary flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Posts
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  The most popular posts this week
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto space-y-2 py-4">
                {paginatedTrendingPosts.map((post, idx) => {
                  const globalIndex = (trendingPage - 1) * postsPerPage + idx;
                  return (
                    <div 
                      key={post.id} 
                      className={cn(
                        "p-3 rounded-lg cursor-pointer hover-elevate transition-all",
                        globalIndex === 0 && "bg-gradient-to-r from-primary/25 to-primary/10 shadow-[0_0_24px_rgba(168,85,247,0.5)] border border-primary/30",
                        globalIndex === 1 && "bg-gradient-to-r from-primary/18 to-primary/8 shadow-[0_0_16px_rgba(168,85,247,0.35)] border border-primary/20",
                        globalIndex === 2 && "bg-gradient-to-r from-primary/12 to-primary/5 shadow-[0_0_10px_rgba(168,85,247,0.2)] border border-primary/15",
                        globalIndex > 2 && "bg-white/5 border border-white/5"
                      )}
                      data-testid={`trending-post-${post.id}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className={cn(
                              "text-[9px]",
                              globalIndex === 0 && "bg-primary/30 text-primary",
                              globalIndex === 1 && "bg-primary/25 text-primary",
                              globalIndex === 2 && "bg-primary/20 text-primary"
                            )}>
                              #{globalIndex + 1}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">{post.author}</span>
                          </div>
                          <h5 className="text-sm font-bold line-clamp-1">{post.title}</h5>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Heart className="w-3.5 h-3.5 text-red-400" /> {post.likes.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> {post.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setTrendingPage(p => Math.max(1, p - 1))}
                  disabled={trendingPage === 1}
                  data-testid="button-trending-prev"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={trendingPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setTrendingPage(page)}
                      data-testid={`button-trending-page-${page}`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setTrendingPage(p => Math.min(totalPages, p + 1))}
                  disabled={trendingPage === totalPages}
                  data-testid="button-trending-next"
                >
                  Next
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Card className="glass-card border-white/5 p-6">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Suggested Connections</h4>
            <div className="space-y-4">
              {[
                { name: "Sarah Tech", role: "CTO" },
                { name: "Mike Money", role: "Angel Investor" },
                { name: "Alex Builder", role: "Full Stack Developer" },
                { name: "Emma Vision", role: "Product Designer" },
                { name: "James Capital", role: "VC Partner" }
              ].map(person => (
                <div key={person.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback>{person.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <h5 className="text-xs font-bold truncate">{person.name}</h5>
                      <p className="text-[10px] text-muted-foreground truncate">{person.role}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" data-testid={`button-follow-${person.name.replace(/\s+/g, '-').toLowerCase()}`}>Follow</Button>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs text-muted-foreground" data-testid="button-view-more-connections">
              View More
            </Button>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
