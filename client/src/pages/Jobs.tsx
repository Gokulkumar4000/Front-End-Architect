import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Briefcase, DollarSign, Heart, Bookmark, Clock, ExternalLink } from "lucide-react";
import { getPostsByType, type FirestorePost } from "@/lib/firestoreService";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { useUserActivity } from "@/hooks/use-user-activity";
import { cn } from "@/lib/utils";
import { FeedCard } from "@/pages/Feed";

const JOB_TYPE_COLORS: Record<string, string> = {
  "Full-time": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Part-time": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Contract": "text-purple-400 bg-purple-400/10 border-purple-400/20",
  "Co-founder": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  default: "text-muted-foreground bg-white/5 border-white/10",
};

function getJobTypeColor(jt?: string) {
  if (!jt) return JOB_TYPE_COLORS.default;
  for (const key of Object.keys(JOB_TYPE_COLORS)) {
    if (jt.includes(key)) return JOB_TYPE_COLORS[key];
  }
  return JOB_TYPE_COLORS.default;
}

export default function Jobs() {
  const { user } = useFirebaseAuth();
  const activity = useUserActivity();
  const [posts, setPosts] = useState<FirestorePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<FirestorePost | null>(null);

  useEffect(() => {
    getPostsByType("recruitment").then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const allDomains = Array.from(new Set(posts.flatMap((p) => p.domains || [])));

  const filtered = posts.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
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
            <Briefcase className="w-6 h-6 text-purple-400" /> Jobs
          </h1>
          <p className="text-sm text-muted-foreground">Find roles, co-founder opportunities, and developer positions in innovative startups.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search jobs..." className="pl-9 bg-white/5 border-white/10 focus:border-primary/40" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-jobs" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant={!selectedDomain ? "default" : "outline"} className="h-9 text-xs border-white/10" onClick={() => setSelectedDomain(null)}>All</Button>
            {allDomains.slice(0, 5).map((d) => (
              <Button key={d} size="sm" variant={selectedDomain === d ? "default" : "outline"} className="h-9 text-xs border-white/10" onClick={() => setSelectedDomain(d === selectedDomain ? null : d)}>{d}</Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="glass-card h-40 animate-pulse rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <Briefcase className="w-12 h-12 text-muted-foreground/20" />
            <p className="text-muted-foreground">No jobs found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((post) => {
              const liked = activity.isLiked(post.id);
              const saved = activity.isSaved(post.id);
              const jtColor = getJobTypeColor(post.jobType);
              return (
                <div key={post.id} className="glass-card border-white/5 hover:border-purple-400/20 p-5 rounded-2xl transition-all group cursor-pointer" data-testid={`card-job-${post.id}`} onClick={() => setSelectedPost(post)}>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 shrink-0 ring-1 ring-white/10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback className="bg-purple-400/10 text-purple-400 font-bold">{post.author.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{post.title}</h3>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{post.author.name} • {post.timestamp}</p>
                        </div>
                        {post.jobType && (
                          <Badge variant="outline" className={cn("text-[10px] shrink-0", jtColor)}>{post.jobType}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{post.content}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {post.compensation && (
                          <div className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-emerald-400" />{post.compensation}</div>
                        )}
                        {post.requirements && (
                          <div className="flex items-center gap-1 truncate max-w-[250px]"><Clock className="w-3 h-3" /><span className="truncate">{post.requirements.split(',')[0]}</span></div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex flex-wrap gap-1 flex-1">
                          {(post.domains || []).map((d) => (
                            <Badge key={d} variant="outline" className="text-[10px] border-purple-400/20 text-purple-400/80 bg-purple-400/5 px-2 py-0.5">{d}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          <button onClick={(e) => handleLike(post, e)} className={cn("flex items-center gap-1 text-xs transition-colors", liked ? "text-rose-400" : "text-muted-foreground hover:text-rose-400")}>
                            <Heart className={cn("w-3.5 h-3.5", liked && "fill-current")} /> {post.stats.likes}
                          </button>
                          <button onClick={(e) => handleSave(post, e)} className={cn("flex items-center gap-1 text-xs transition-colors", saved ? "text-primary" : "text-muted-foreground hover:text-primary")}>
                            <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-current")} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedPost(post); }}
                            className="flex items-center gap-1 text-xs text-purple-400/70 hover:text-purple-400 transition-colors"
                            data-testid={`button-view-post-${post.id}`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> View Full Post
                          </button>
                        </div>
                      </div>
                    </div>
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
