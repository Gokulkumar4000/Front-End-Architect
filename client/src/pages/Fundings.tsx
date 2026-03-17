import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Coins, Users, Heart, Bookmark, Target, ExternalLink } from "lucide-react";
import { getPostsByType, type FirestorePost } from "@/lib/firestoreService";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { useUserActivity } from "@/hooks/use-user-activity";
import { cn } from "@/lib/utils";
import { FeedCard } from "@/pages/Feed";

export default function Fundings() {
  const { user } = useFirebaseAuth();
  const activity = useUserActivity();
  const [posts, setPosts] = useState<FirestorePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<FirestorePost | null>(null);

  useEffect(() => {
    getPostsByType("fund").then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const allDomains = Array.from(new Set(posts.flatMap((p) => p.domains || [])));

  const filtered = posts.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());
    const matchDomain = !selectedDomain || (p.domains || []).includes(selectedDomain);
    return matchSearch && matchDomain;
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
            <Coins className="w-6 h-6 text-emerald-400" /> Fundings
          </h1>
          <p className="text-sm text-muted-foreground">Explore active funding rounds and investment opportunities from the community.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search fundings..."
              className="pl-9 bg-white/5 border-white/10 focus:border-primary/40"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-fundings"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant={!selectedDomain ? "default" : "outline"} className="h-9 text-xs border-white/10" onClick={() => setSelectedDomain(null)}>All</Button>
            {allDomains.slice(0, 5).map((d) => (
              <Button key={d} size="sm" variant={selectedDomain === d ? "default" : "outline"} className="h-9 text-xs border-white/10" onClick={() => setSelectedDomain(d === selectedDomain ? null : d)}>{d}</Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="glass-card h-52 animate-pulse rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <Coins className="w-12 h-12 text-muted-foreground/20" />
            <p className="text-muted-foreground">No funding posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((post) => {
              const liked = activity.isLiked(post.id);
              const saved = activity.isSaved(post.id);
              const goal = post.fundingGoal || 0;
              const current = post.currentAmount || 0;
              const percent = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
              return (
                <div key={post.id} className="glass-card border-white/5 hover:border-emerald-400/20 p-5 rounded-2xl space-y-3 transition-all group cursor-pointer" data-testid={`card-funding-${post.id}`} onClick={() => setSelectedPost(post)}>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 shrink-0 ring-1 ring-white/10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback className="bg-emerald-400/10 text-emerald-400 text-xs font-bold">{post.author.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{post.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{post.author.name} • {post.timestamp}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{post.content}</p>

                  {goal > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-emerald-400 font-bold">${current.toLocaleString()} raised</span>
                        <span className="text-muted-foreground">of ${goal.toLocaleString()} goal</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    {post.currentSupporters != null && (
                      <div className="flex items-center gap-1"><Users className="w-3 h-3" />{post.currentSupporters} supporters</div>
                    )}
                    {post.deadline && (
                      <div className="flex items-center gap-1"><Target className="w-3 h-3" />Deadline: {post.deadline}</div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(post.domains || []).map((d) => (
                      <Badge key={d} variant="outline" className="text-[10px] border-emerald-400/20 text-emerald-400/80 bg-emerald-400/5 px-2 py-0.5">{d}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                    <button onClick={(e) => handleLike(post, e)} className={cn("flex items-center gap-1 text-xs transition-colors", liked ? "text-rose-400" : "text-muted-foreground hover:text-rose-400")}>
                      <Heart className={cn("w-3.5 h-3.5", liked && "fill-current")} /> {post.stats.likes}
                    </button>
                    <button onClick={(e) => handleSave(post, e)} className={cn("flex items-center gap-1 text-xs transition-colors", saved ? "text-primary" : "text-muted-foreground hover:text-primary")}>
                      <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-current")} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedPost(post); }}
                      className="ml-auto flex items-center gap-1 text-xs text-emerald-400/70 hover:text-emerald-400 transition-colors"
                      data-testid={`button-view-post-${post.id}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View Full Post
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedPost && (
        <FeedCard
          post={selectedPost as any}
          forceShowDetails={true}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </AppLayout>
  );
}
