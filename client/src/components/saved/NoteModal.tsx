import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { SavedPost } from "./SavedPostCard";

interface NoteModalProps {
  post: SavedPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (postId: string, note: string) => void;
  onDelete: (postId: string) => void;
}

export function NoteModal({ post, isOpen, onClose, onSave, onDelete }: NoteModalProps) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (post) {
      setNote(post.note || "");
    }
  }, [post]);

  const handleSave = () => {
    if (post) {
      onSave(post.id, note);
      onClose();
    }
  };

  const handleDelete = () => {
    if (post) {
      onDelete(post.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 bg-background/95 backdrop-blur-2xl max-w-md border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-gradient-primary">Your note</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 250))}
            placeholder="Add your private note here..."
            className="min-h-[120px] bg-white/[0.03] border-white/10 resize-none focus-visible:ring-primary/20"
          />
          <div className="flex justify-end">
            <span className="text-[10px] text-muted-foreground font-medium">
              {note.length}/250 characters
            </span>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          {post?.note && (
            <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
              Delete note
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
