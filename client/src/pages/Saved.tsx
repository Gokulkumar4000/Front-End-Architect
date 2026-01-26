import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SavedPostCard, SavedPost } from "@/components/saved/SavedPostCard";
import { SavedAnalytics } from "@/components/saved/SavedAnalytics";
import { SavedFilters } from "@/components/saved/SavedFilters";
import { NoteModal } from "@/components/saved/NoteModal";
import { FeedCard } from "@/components/feed/FeedCard";

const MOCK_SAVED_POSTS: SavedPost[] = [
  {
    id: "1",
    type: "idea",
    title: "AI-Powered Climate Prediction",
    description: "A decentralized network for real-time climate monitoring and predictive modeling using edge computing.",
    author: { name: "Sarah Tech" },
    domains: ["AI/ML", "Sustainability"],
    likes: 124,
    note: "Potential investment for Q3."
  },
  {
    id: "2",
    type: "project",
    title: "EcoSwap DEX",
    description: "A carbon-neutral decentralized exchange protocol with automated carbon credit offsetting.",
    author: { name: "Alex Builder" },
    domains: ["Web3", "FinTech"],
    likes: 89
  },
  {
    id: "3",
    type: "funding",
    title: "Seed Series: HealthGen",
    description: "Raising $2M for personalized genomics platform targeting rare metabolic disorders.",
    author: { name: "Emma Vision" },
    domains: ["HealthTech", "AI/ML"],
    likes: 256
  }
];

export default function Saved() {
  const [posts, setPosts] = useState<SavedPost[]>(MOCK_SAVED_POSTS);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [domain, setDomain] = useState("all");
  const [withNotes, setWithNotes] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SavedPost | null>(null);
  const [detailedPost, setDetailedPost] = useState<any>(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.author.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = type === "all" || post.type === type;
      const matchesDomain = domain === "all" || post.domains.includes(domain);
      const matchesNotes = !withNotes || !!post.note;
      return matchesSearch && matchesType && matchesDomain && matchesNotes;
    });
  }, [posts, search, type, domain, withNotes]);

  const analyticsData = useMemo(() => [
    { name: "Ideas", value: posts.filter(p => p.type === "idea").length },
    { name: "Projects", value: posts.filter(p => p.type === "project").length },
    { name: "Funding", value: posts.filter(p => p.type === "funding").length }
  ], [posts]);

  const domainData = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(p => p.domains.forEach(d => counts[d] = (counts[d] || 0) + 1));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [posts]);

  const handleUpdateNote = (postId: string, note: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, note } : p));
  };

  const handleDeleteNote = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, note: undefined } : p));
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-24">
        <header className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gradient-primary mb-2">Saved Posts</h1>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-medium">
            <span>Total: {posts.length}</span>
            <span>Ideas: {posts.filter(p => p.type === "idea").length}</span>
            <span>Projects: {posts.filter(p => p.type === "project").length}</span>
            <span>Funding: {posts.filter(p => p.type === "funding").length}</span>
          </div>
        </header>

        <SavedAnalytics data={analyticsData} domainData={domainData} />
        
        <SavedFilters
          search={search}
          onSearchChange={setSearch}
          type={type}
          onTypeChange={setType}
          domain={domain}
          onDomainChange={setDomain}
          withNotes={withNotes}
          onWithNotesChange={setWithNotes}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <SavedPostCard 
              key={post.id} 
              post={post} 
              onOpenNote={(p) => {
                setSelectedPost(p);
                setIsNoteOpen(true);
              }}
              onClick={(p) => {
                setDetailedPost({
                  ...p,
                  id: Number(p.id),
                  content: p.description,
                  timestamp: "Saved",
                  comments: 12
                });
              }}
            />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 glass-card border-white/5 bg-white/[0.02] rounded-2xl">
            <p className="text-muted-foreground font-medium">No saved posts match your filters.</p>
          </div>
        )}

        {detailedPost && (
          <FeedCard 
            post={detailedPost} 
            forceShowDetails={true} 
            onClose={() => setDetailedPost(null)} 
          />
        )}

        <NoteModal
          post={selectedPost}
          isOpen={isNoteOpen}
          onClose={() => setIsNoteOpen(false)}
          onSave={handleUpdateNote}
          onDelete={handleDeleteNote}
        />
      </div>
    </AppLayout>
  );
}
