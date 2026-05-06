import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SavedPostCard } from "@/components/saved/SavedPostCard";
import type { SavedPost } from "@/components/saved/SavedPostCard";
import { SavedAnalytics } from "@/components/saved/SavedAnalytics";
import { SavedFilters } from "@/components/saved/SavedFilters";
import { NoteModal } from "@/components/saved/NoteModal";
import { FeedCard } from "./Feed";
import { useUserActivity } from "@/hooks/use-user-activity";

export default function Saved() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [domain, setDomain] = useState("all");
  const [withNotes, setWithNotes] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SavedPost | null>(null);
  const [detailedPost, setDetailedPost] = useState<any>(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  const { savedPosts, updateNote, deleteNote } = useUserActivity();

  const posts: SavedPost[] = useMemo(
    () =>
      savedPosts.map((p) => ({
        id: p.id,
        type: (p.type as SavedPost["type"]) || "idea",
        title: p.title || "",
        description: p.description || "",
        author: p.author || { name: "Unknown" },
        domains: p.domains || [],
        likes: p.likes || 0,
        note: p.note,
      })),
    [savedPosts]
  );

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.author.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = type === "all" || post.type === type;
      const matchesDomain = domain === "all" || post.domains.includes(domain);
      const matchesNotes = !withNotes || !!post.note;
      return matchesSearch && matchesType && matchesDomain && matchesNotes;
    });
  }, [posts, search, type, domain, withNotes]);

  const analyticsData = useMemo(
    () => [
      { name: "Ideas", value: filteredPosts.filter((p) => p.type === "idea").length },
      { name: "Projects", value: filteredPosts.filter((p) => p.type === "project").length },
      { name: "Funding", value: filteredPosts.filter((p) => p.type === "funding").length },
    ],
    [filteredPosts]
  );

  const domainData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredPosts.forEach((p) => p.domains.forEach((d) => (counts[d] = (counts[d] || 0) + 1)));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredPosts]);

  const handleUpdateNote = async (postId: string, note: string) => {
    await updateNote(postId, note);
  };

  const handleDeleteNote = async (postId: string) => {
    await deleteNote(postId);
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-24">
        <header className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gradient-primary mb-2">Saved Posts</h1>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-medium">
            <span>Total: {posts.length}</span>
            <span>Ideas: {posts.filter((p) => p.type === "idea").length}</span>
            <span>Projects: {posts.filter((p) => p.type === "project").length}</span>
            <span>Funding: {posts.filter((p) => p.type === "funding").length}</span>
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
          {filteredPosts.map((post) => (
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
                    avatar:
                      p.author.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.author.name}`,
                    role: "Visionary",
                  },
                  timestamp: "Saved",
                  stats: { likes: p.likes, comments: 0 },
                  comments: [],
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
