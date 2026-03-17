import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Zap, Lightbulb, Coins, TrendingUp, Heart, Bookmark, Target, BarChart3 } from "lucide-react";
import { getPosts, type FirestorePost } from "@/lib/firestoreService";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { useUserActivity } from "@/hooks/use-user-activity";
import { cn } from "@/lib/utils";

export default function Opportunities() {
  const { user } = useFirebaseAuth();
  const activity = useUserActivity();
  const [posts, setPosts] = useState<FirestorePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "idea" | "fund">("all");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data.filter((p) => p.type === "idea" || p.type === "fund"));
      setLoading(false);
    });
  }, []);

  const allDomains = Array.from(new Set(posts.flatMap((p) => p.domains || [])));

  const filtered = posts.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.type === typeFilter;
    const matchDomain = !selectedDomain || (p.domains || []).includes(selectedDomain);
    return matchSearch && matchType && matchDomain;
  });

  const handleLike = async (post: FirestorePost, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    await activity.toggleLike(post.id, post.collectionName, post.stats.likes);
  };

  const handleSave = async (post: FirestorePost, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const saved = activity.isSaved(post.id);
    await activity.toggleSave(post.id, saved ? null : {
      id: post.id, type: post.type, collectionName: post.collectionName,
      title: post.title, description: post.content, author: post.author,
      domains: post.domains || [], likes: post.stats.likes,
    });
  };

  return (
    <AppLayout>
      <div className="flex-1 p-6 space-y-6 max-w-5xl mx-auto w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" /> Opportunities
          </h1>
          <p className="text-sm text-muted-foreground">Curated investment opportunities — ideas to back and funds to join.</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Opportunities", value: posts.length, icon: Zap },
            { label: "Ideas to Back", value: posts.filter((p) => p.type === "idea").length, icon: Lightbulb },
            { label: "Active Funds", value: posts.filter((p) => p.type === "fund").length, icon: Coins },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 rounded-xl text-center space-y-1">
              <stat.icon className="w-5 h-5 text-primary mx-auto" />
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search opportunities..." className="pl-9 bg-white/5 border-white/10 focus:border-primary/40" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-opportunities" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "idea", "fund"] as const).map((t) => (
              <Button key={t} size="sm" variant={typeFilter === t ? "default" : "outline"} className="h-9 text-xs border-white/10 capitalize" onClick={() => setTypeFilter(t)}>
                {t === "all" ? "All" : t === "idea" ? "Ideas" : "Funds"}
              </Button>
            ))}
          </div>
        </div>

        {allDomains.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {allDomains.slice(0, 8).map((d) => (
              <button key={d} onClick={() => setSelectedDomain(d === selectedDomain ? null : d)}
                className={cn("text-[10px] font-medium px-3 py-1 rounded-full border transition-all", selectedDomain === d ? "bg-primary text-white border-primary" : "border-white/10 text-muted-foreground hover:border-primary/30")}>
                {d}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="glass-card h-52 animate-pulse rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <Zap className="w-12 h-12 text-muted-foreground/20" />
            <p className="text-muted-foreground">No opportunities found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((post) => {
              const liked = activity.isLiked(post.id);
              const saved = activity.isSaved(post.id);
              const isIdea = post.type === "idea";
              const isFund = post.type === "fund";
              const goal = post.fundingGoal || 0;
              const current = post.currentAmount || 0;
              const percent = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
              return (
                <div key={post.id} className={cn("glass-card border-white/5 p-5 rounded-2xl space-y-3 transition-all group cursor-pointer", isIdea ? "hover:border-amber-400/20" : "hover:border-emerald-400/20")} data-testid={`card-opportunity-${post.id}`}>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 shrink-0 ring-1 ring-white/10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback className={cn("text-xs font-bold", isIdea ? "bg-amber-400/10 text-amber-400" : "bg-emerald-400/10 text-emerald-400")}>{post.author.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={cn("text-sm font-bold truncate transition-colors", isIdea ? "group-hover:text-amber-400" : "group-hover:text-emerald-400")}>{post.title}</p>
                        <Badge variant="outline" className={cn("text-[10px] shrink-0", isIdea ? "border-amber-400/20 text-amber-400 bg-amber-400/5" : "border-emerald-400/20 text-emerald-400 bg-emerald-400/5")}>
                          {isIdea ? <Lightbulb className="w-2.5 h-2.5 mr-1" /> : <Coins className="w-2.5 h-2.5 mr-1" />}
                          {isIdea ? "Idea" : "Fund"}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{post.author.name} • {post.timestamp}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{post.content}</p>

                  {isFund && goal > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-emerald-400 font-bold">${current.toLocaleString()} raised</span>
                        <span className="text-muted-foreground">Goal: ${goal.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  )}

                  {isIdea && post.market && (
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3 shrink-0 mt-0.5 text-amber-400" />
                      <span className="line-clamp-1">{post.market}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {(post.domains || []).map((d) => (
                      <Badge key={d} variant="outline" className={cn("text-[10px] px-2 py-0.5", isIdea ? "border-amber-400/20 text-amber-400/80 bg-amber-400/5" : "border-emerald-400/20 text-emerald-400/80 bg-emerald-400/5")}>{d}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                    <button onClick={(e) => handleLike(post, e)} className={cn("flex items-center gap-1 text-xs transition-colors", liked ? "text-rose-400" : "text-muted-foreground hover:text-rose-400")}>
                      <Heart className={cn("w-3.5 h-3.5", liked && "fill-current")} /> {post.stats.likes}
                    </button>
                    <button onClick={(e) => handleSave(post, e)} className={cn("ml-auto flex items-center gap-1 text-xs transition-colors", saved ? "text-primary" : "text-muted-foreground hover:text-primary")}>
                      <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-current")} />
                    </button>
                    <Button size="sm" className={cn("h-7 text-xs px-3", isFund ? "bg-emerald-500 hover:bg-emerald-400 text-white" : "")}>
                      {isFund ? "Invest" : "Back Idea"}
                    </Button>
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
