import { useState, useMemo, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SavedPostCard, SavedPost } from "@/components/saved/SavedPostCard";
import { SavedAnalytics } from "@/components/saved/SavedAnalytics";
import { SavedFilters } from "@/components/saved/SavedFilters";
import { NoteModal } from "@/components/saved/NoteModal";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Feed, { FeedCard } from "./Feed";

import { MOCK_POSTS } from "@/mocks/posts";
import { MOCK_USERS } from "@/mocks/users";

export default function Saved() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [domain, setDomain] = useState("all");
  const [withNotes, setWithNotes] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SavedPost | null>(null);
  const [detailedPost, setDetailedPost] = useState<any>(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  const [posts, setPosts] = useState<SavedPost[]>(() => {
    const saved = localStorage.getItem('saved_posts');
    if (saved) return JSON.parse(saved);
    return MOCK_POSTS.map(p => ({
      id: p.id,
      type: (p.type === "fund" ? "funding" : p.type) as any,
      title: p.title,
      description: p.content,
      author: p.author,
      domains: p.domains || ["General"],
      likes: p.stats.likes
    }));
  });

  useEffect(() => {
    localStorage.setItem('saved_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    const handleSavedChange = (e: any) => {
      const { post, isSaved } = e.detail;
      if (isSaved) {
        setPosts(prev => {
          const exists = prev.find(p => String(p.id) === String(post.id));
          if (exists) return prev;
          const newPost: SavedPost = {
            id: String(post.id),
            type: (post.type === "fund" ? "funding" : post.type) || "idea",
            title: post.title,
            description: post.content || post.description,
            author: typeof post.author === 'string' ? { name: post.author } : post.author,
            domains: post.domains || ["General"],
            likes: post.stats?.likes || post.likes || 0
          };
          const newPosts = [...prev, newPost];
          localStorage.setItem('saved_posts', JSON.stringify(newPosts));
          return newPosts;
        });
      } else {
        setPosts(prev => {
          const newPosts = prev.filter(p => String(p.id) !== String(post.id));
          localStorage.setItem('saved_posts', JSON.stringify(newPosts));
          return newPosts;
        });
      }
    };

    window.addEventListener('post-saved-change', handleSavedChange);
    return () => window.removeEventListener('post-saved-change', handleSavedChange);
  }, []);

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
    { name: "Ideas", value: filteredPosts.filter(p => p.type === "idea").length },
    { name: "Projects", value: filteredPosts.filter(p => p.type === "project").length },
    { name: "Funding", value: filteredPosts.filter(p => p.type === "funding").length }
  ], [filteredPosts]);

  const domainData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredPosts.forEach(p => p.domains.forEach(d => counts[d] = (counts[d] || 0) + 1));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredPosts]);

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
                const feedPost = {
                  id: p.id,
                  title: p.title,
                  content: p.description,
                  type: (p.type === "funding" ? "fund" : p.type) as any,
                  author: {
                    name: p.author.name,
                    avatar: p.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.author.name}`,
                    role: "Visionary"
                  },
                  timestamp: "Saved",
                  stats: { likes: p.likes, comments: 0 },
                  comments: []
                };
                setDetailedPost(feedPost);
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-[95vw] h-[90vh] glass-card border-white/10 relative shadow-2xl overflow-hidden rounded-2xl">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 z-[110] hover:bg-white/10 text-white"
                onClick={() => setDetailedPost(null)}
              >
                <X className="w-5 h-5" />
              </Button>
              <div className="h-full w-full">
                <FeedCard 
                  post={detailedPost} 
                  forceShowDetails={true} 
                  onClose={() => setDetailedPost(null)}
                />
              </div>
            </div>
          </div>
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
