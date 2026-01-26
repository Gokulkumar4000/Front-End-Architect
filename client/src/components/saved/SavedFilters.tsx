import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface SavedFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  type: string;
  onTypeChange: (val: string) => void;
  domain: string;
  onDomainChange: (val: string) => void;
  withNotes: boolean;
  onWithNotesChange: (val: boolean) => void;
}

export function SavedFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  domain,
  onDomainChange,
  withNotes,
  onWithNotesChange,
}: SavedFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 glass-card border-white/5 bg-white/[0.02] rounded-xl items-end md:items-center">
      <div className="flex-1 w-full">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/[0.03] border-white/10 h-9"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[120px] h-9 bg-white/[0.03] border-white/10">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="glass-card border-white/10">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="idea">Ideas</SelectItem>
            <SelectItem value="project">Projects</SelectItem>
            <SelectItem value="funding">Funding</SelectItem>
          </SelectContent>
        </Select>

        <Select value={domain} onValueChange={onDomainChange}>
          <SelectTrigger className="w-[140px] h-9 bg-white/[0.03] border-white/10">
            <SelectValue placeholder="Domain" />
          </SelectTrigger>
          <SelectContent className="glass-card border-white/10">
            <SelectItem value="all">All Domains</SelectItem>
            <SelectItem value="AI/ML">AI/ML</SelectItem>
            <SelectItem value="FinTech">FinTech</SelectItem>
            <SelectItem value="HealthTech">HealthTech</SelectItem>
            <SelectItem value="Web3">Web3</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Switch id="with-notes" checked={withNotes} onCheckedChange={onWithNotesChange} />
          <Label htmlFor="with-notes" className="text-xs font-bold text-muted-foreground cursor-pointer">
            With notes
          </Label>
        </div>
      </div>
    </div>
  );
}
