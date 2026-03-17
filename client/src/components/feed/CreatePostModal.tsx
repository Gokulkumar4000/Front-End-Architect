import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Coins, Code2, Briefcase, X, Plus, Loader2 } from "lucide-react";
import { createPost, type FirestorePost } from "@/lib/firestoreService";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { useUserProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export type CreatePostType = "idea" | "fund" | "project" | "recruitment";

const POST_TYPE_CONFIG = {
  idea: { icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", label: "Post Idea", title: "Share Your Idea" },
  fund: { icon: Coins, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", label: "Raise Fund", title: "Create Fundraising Post" },
  project: { icon: Code2, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", label: "Post Project", title: "Post a Project" },
  recruitment: { icon: Briefcase, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20", label: "Post Job", title: "Post a Job" },
};

const DOMAIN_SUGGESTIONS = [
  "AI/ML", "Web3", "FinTech", "HealthTech", "EdTech", "SaaS",
  "Mobile", "Open Source", "DevTools", "Sustainability", "Agriculture",
  "React Native", "Blockchain", "IoT",
];

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  postType: CreatePostType;
  onCreated?: (post: FirestorePost) => void;
}

export function CreatePostModal({ open, onClose, postType, onCreated }: CreatePostModalProps) {
  const { user } = useFirebaseAuth();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const cfg = POST_TYPE_CONFIG[postType];
  const Icon = cfg.icon;

  const [submitting, setSubmitting] = useState(false);
  const [domainInput, setDomainInput] = useState("");
  const [domains, setDomains] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    content: "",
    // idea
    problem: "",
    solution: "",
    collaborationNeeds: "",
    // project
    rolesNeeded: "",
    skillsRequired: "",
    timeline: "",
    benefits: "",
    // fund
    fundingGoal: "",
    minContribution: "",
    deadline: "",
    fundUsage: "",
    roadmap: "",
    // recruitment
    jobType: "",
    compensation: "",
    requirements: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const addDomain = (d: string) => {
    const trimmed = d.trim();
    if (trimmed && !domains.includes(trimmed)) setDomains((prev) => [...prev, trimmed]);
    setDomainInput("");
  };

  const removeDomain = (d: string) => setDomains((prev) => prev.filter((x) => x !== d));

  const handleSubmit = async () => {
    if (!user) return;
    if (!form.title.trim() || !form.content.trim()) {
      toast({ title: "Missing fields", description: "Title and description are required.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const authorName = profile?.fullName || user.displayName || "Anonymous";
      const authorAvatar = profile?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`;
      const authorRole = profile?.role || "Member";

      const postData: Omit<FirestorePost, "id" | "createdAt" | "collectionName"> = {
        type: postType,
        author: { name: authorName, avatar: authorAvatar, role: authorRole, uid: user.uid },
        title: form.title.trim(),
        content: form.content.trim(),
        timestamp: "Just now",
        stats: { likes: 0, comments: 0 },
        domains,
        authorUid: user.uid,
        ...(postType === "idea" && {
          problem: form.problem.trim(),
          solution: form.solution.trim(),
          collaborationNeeds: form.collaborationNeeds.trim(),
        }),
        ...(postType === "project" && {
          rolesNeeded: form.rolesNeeded.trim(),
          skillsRequired: form.skillsRequired.trim(),
          timeline: form.timeline.trim(),
          benefits: form.benefits.trim(),
        }),
        ...(postType === "fund" && {
          fundingGoal: form.fundingGoal ? parseFloat(form.fundingGoal) : undefined,
          minContribution: form.minContribution ? parseFloat(form.minContribution) : undefined,
          deadline: form.deadline,
          fundUsage: form.fundUsage.trim(),
          roadmap: form.roadmap.trim(),
          currentAmount: 0,
          currentSupporters: 0,
        }),
        ...(postType === "recruitment" && {
          jobType: form.jobType.trim(),
          compensation: form.compensation.trim(),
          requirements: form.requirements.trim(),
        }),
      };

      const created = await createPost(user.uid, postData);
      toast({ title: "Posted!", description: "Your post is now live on DevConnect." });
      if (onCreated) onCreated(created);
      onClose();
      setForm({ title: "", content: "", problem: "", solution: "", collaborationNeeds: "", rolesNeeded: "", skillsRequired: "", timeline: "", benefits: "", fundingGoal: "", minContribution: "", deadline: "", fundUsage: "", roadmap: "", jobType: "", compensation: "", requirements: "" });
      setDomains([]);
    } catch {
      toast({ title: "Error", description: "Failed to create post. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glass-card border-white/10 bg-background/95 backdrop-blur-2xl max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto custom-scrollbar p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/5">
          <DialogTitle className="flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", cfg.bg)}>
              <Icon className={cn("w-4 h-4", cfg.color)} />
            </div>
            <span className="text-lg font-bold text-white">{cfg.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Common Fields */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Title *</Label>
            <Input
              placeholder={postType === "idea" ? "e.g. AI-Powered Sustainable Farming" : postType === "fund" ? "e.g. Seed Fund for GreenTech" : postType === "project" ? "e.g. Open Source CRM" : "e.g. Looking for a React Developer"}
              value={form.title}
              onChange={set("title")}
              className="bg-white/5 border-white/10 focus:border-primary/40"
              data-testid="input-post-title"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {postType === "idea" ? "Brief Overview *" : postType === "fund" ? "Description *" : postType === "project" ? "Project Summary *" : "Job Description *"}
            </Label>
            <Textarea
              placeholder="Provide a clear, compelling overview..."
              value={form.content}
              onChange={set("content")}
              className="bg-white/5 border-white/10 focus:border-primary/40 min-h-[80px] resize-none"
              data-testid="textarea-post-content"
            />
          </div>

          {/* Domains */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Domains / Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a domain..."
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addDomain(domainInput); } }}
                className="bg-white/5 border-white/10 focus:border-primary/40 flex-1"
              />
              <Button variant="outline" size="icon" className="border-white/10 shrink-0" onClick={() => addDomain(domainInput)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DOMAIN_SUGGESTIONS.map((d) => (
                <button key={d} onClick={() => addDomain(d)} disabled={domains.includes(d)}
                  className={cn("text-[10px] px-2.5 py-1 rounded-full border transition-all", domains.includes(d) ? "bg-primary/20 border-primary/40 text-primary" : "border-white/10 text-muted-foreground hover:border-primary/30 hover:text-white")}>
                  {d}
                </button>
              ))}
            </div>
            {domains.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {domains.map((d) => (
                  <Badge key={d} variant="outline" className="border-primary/30 text-primary bg-primary/10 gap-1 pr-1">
                    {d}
                    <button onClick={() => removeDomain(d)} className="hover:text-destructive transition-colors"><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* ── Idea-specific fields ── */}
          {postType === "idea" && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Problem Statement</Label>
                <Textarea placeholder="What problem does this solve? Who is affected and how severely?" value={form.problem} onChange={set("problem")} className="bg-white/5 border-white/10 focus:border-primary/40 min-h-[70px] resize-none" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Solution Snapshot</Label>
                <Textarea placeholder="How does your idea solve the problem? What's your unique approach?" value={form.solution} onChange={set("solution")} className="bg-white/5 border-white/10 focus:border-primary/40 min-h-[70px] resize-none" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Collaboration Needs</Label>
                <Textarea placeholder="What kind of collaborators are you looking for? Developers, investors, domain experts?" value={form.collaborationNeeds} onChange={set("collaborationNeeds")} className="bg-white/5 border-white/10 focus:border-primary/40 min-h-[60px] resize-none" />
              </div>
            </>
          )}

          {/* ── Project-specific fields ── */}
          {postType === "project" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Roles Needed</Label>
                  <Input placeholder="e.g. Backend Dev, UX Designer" value={form.rolesNeeded} onChange={set("rolesNeeded")} className="bg-white/5 border-white/10 focus:border-primary/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Skills Required</Label>
                  <Input placeholder="e.g. React, Node.js, Docker" value={form.skillsRequired} onChange={set("skillsRequired")} className="bg-white/5 border-white/10 focus:border-primary/40" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Timeline</Label>
                  <Input placeholder="e.g. MVP in 3 months" value={form.timeline} onChange={set("timeline")} className="bg-white/5 border-white/10 focus:border-primary/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Benefits / Compensation</Label>
                  <Input placeholder="e.g. Equity, mentorship, remote" value={form.benefits} onChange={set("benefits")} className="bg-white/5 border-white/10 focus:border-primary/40" />
                </div>
              </div>
            </>
          )}

          {/* ── Fund-specific fields ── */}
          {postType === "fund" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Funding Goal ($)</Label>
                  <Input type="number" placeholder="e.g. 50000" value={form.fundingGoal} onChange={set("fundingGoal")} className="bg-white/5 border-white/10 focus:border-primary/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Min Contribution ($)</Label>
                  <Input type="number" placeholder="e.g. 100" value={form.minContribution} onChange={set("minContribution")} className="bg-white/5 border-white/10 focus:border-primary/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Deadline</Label>
                  <Input type="date" value={form.deadline} onChange={set("deadline")} className="bg-white/5 border-white/10 focus:border-primary/40" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Fund Usage Plan</Label>
                <Textarea placeholder="e.g. 40% product, 30% marketing, 20% ops, 10% legal" value={form.fundUsage} onChange={set("fundUsage")} className="bg-white/5 border-white/10 focus:border-primary/40 min-h-[60px] resize-none" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Roadmap</Label>
                <Textarea placeholder="e.g. Q1: MVP, Q2: Launch, Q3: Revenue..." value={form.roadmap} onChange={set("roadmap")} className="bg-white/5 border-white/10 focus:border-primary/40 min-h-[60px] resize-none" />
              </div>
            </>
          )}

          {/* ── Recruitment-specific fields ── */}
          {postType === "recruitment" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Job Type</Label>
                  <Input placeholder="e.g. Full-time, Contract, Co-founder" value={form.jobType} onChange={set("jobType")} className="bg-white/5 border-white/10 focus:border-primary/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Compensation</Label>
                  <Input placeholder="e.g. $100k/yr, Equity-based, Remote" value={form.compensation} onChange={set("compensation")} className="bg-white/5 border-white/10 focus:border-primary/40" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Requirements</Label>
                <Textarea placeholder="List key skills, experience, and qualifications..." value={form.requirements} onChange={set("requirements")} className="bg-white/5 border-white/10 focus:border-primary/40 min-h-[70px] resize-none" />
              </div>
            </>
          )}
        </div>

        <div className="px-6 pb-6 flex justify-end gap-3 border-t border-white/5 pt-4">
          <Button variant="outline" onClick={onClose} className="border-white/10">Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting} className="min-w-[100px] relative group overflow-hidden" data-testid="button-submit-post">
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
            </div>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin relative z-20" /> : <span className="relative z-20">Publish</span>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
