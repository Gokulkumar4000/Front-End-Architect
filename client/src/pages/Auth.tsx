import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogIn, 
  UserPlus, 
  Lightbulb, 
  Code2, 
  Briefcase,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  Users,
  Rocket,
  TrendingUp,
  MapPin,
  Check,
  Globe,
  Clock,
  Github,
  Link as LinkIcon,
  Building2,
  Target,
  Trophy,
  User,
  Info,
  Plus,
  Search,
  DollarSign,
  X
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";
type UserRole = "idea-holder" | "developer" | "investor";
type OnboardingStep = "role-selection" | "role-overview" | "registration";

// Categories for the new multi-step flow
type SignupStep = 
  | "basic-profile" 
  | "professional-identity" 
  | "working-preferences" 
  | "org-affiliation" 
  | "interests-goals" 
  | "about-you" 
  | "summary";

const roles = [
  {
    id: "idea-holder" as UserRole,
    title: "IDEA HOLDER",
    icon: Lightbulb,
    bullets: [
      "Post ideas or problem statements securely",
      "Measure real-world necessity",
      "Attract investors and developers",
      "Collaborate to build solutions",
      "Sell, fundraise, or build ideas"
    ],
    overviewSteps: [
      { 
        title: "Post ideas or problem statements securely", 
        desc: "Share ideas without exposing sensitive details.",
        bullets: [
          "Encrypted project descriptions",
          "Selective visibility controls",
          "IP protection mechanisms",
          "Secure document attachments"
        ]
      },
      { 
        title: "Measure real-world necessity and interest", 
        desc: "Measure real-world demand and interest.",
        bullets: [
          "Community validation voting",
          "Interest level analytics",
          "Market demand heatmaps",
          "Target audience feedback"
        ]
      },
      { 
        title: "Attract developers and collaborators", 
        desc: "Allow developers to collaborate on your idea.",
        bullets: [
          "Role-specific recruitment",
          "Skills matching engine",
          "Automated outreach tools",
          "Collaboration request tracking"
        ]
      },
      { 
        title: "Pitch ideas to investors", 
        desc: "Pitch ideas to investors or raise funds.",
        bullets: [
          "Investor networking portal",
          "Pitch deck hosting",
          "Fundraising campaign tools",
          "Investor interaction logs"
        ]
      },
      { 
        title: "Raise funds or sell ideas", 
        desc: "Build yourself or sell the idea.",
        bullets: [
          "Secure transaction escrow",
          "IP transfer workflows",
          "Equity distribution tools",
          "Capital management portal"
        ]
      },
      { 
        title: "Build or transfer ownership", 
        desc: "Monitor interest, funding, and traction.",
        bullets: [
          "Project handoff workflows",
          "Ongoing traction monitoring",
          "Post-transfer support tools",
          "Ownership history logs"
        ]
      }
    ],
    journeyContext: {
      "basic-profile": "Idea holders start by introducing themselves so others know who's behind the vision.",
      "professional-identity": "Defining your background helps establish credibility when presenting new concepts.",
      "working-preferences": "Setting your needs early helps attract the right kind of technical or financial support.",
      "org-affiliation": "Mentioning groups you're part of can provide additional validation for your ideas.",
      "interests-goals": "Sharing your vision helps potential partners align with your long-term success.",
      "about-you": "A personal touch makes your profile more approachable for future collaborators.",
      "summary": "Review your vision and details before launching your journey."
    }
  },
  {
    id: "developer" as UserRole,
    title: "DEVELOPER",
    icon: Code2,
    bullets: [
      "Explore ideas and startup projects",
      "Collaborate with other developers",
      "Apply for full-time or part-time roles",
      "Build MVPs and real products",
      "Raise funds for your own ideas"
    ],
    overviewSteps: [
      { 
        title: "Discover startup ideas and open projects", 
        desc: "Explore startup ideas and open projects posted on DevConnect.",
        bullets: [
          "Advanced project filtering",
          "Tech stack compatibility matching",
          "Trending project discovery",
          "Saved search notifications"
        ]
      },
      { 
        title: "Collaborate with developers and founders", 
        desc: "Collaborate with other developers to build products.",
        bullets: [
          "Team formation tools",
          "In-app collaboration chat",
          "Skill-based team matching",
          "Project management sync"
        ]
      },
      { 
        title: "Apply for full-time or part-time roles", 
        desc: "Apply for full-time, part-time, or contract roles.",
        bullets: [
          "One-click job applications",
          "Application status tracking",
          "Direct founder messaging",
          "Contract management tools"
        ]
      },
      { 
        title: "Build MVPs and real products", 
        desc: "Develop real-world MVPs and production-ready products.",
        bullets: [
          "MVP roadmap tracking",
          "Milestone-based delivery",
          "Technical support network",
          "Build progress analytics"
        ]
      },
      { 
        title: "Raise funds for your own ideas", 
        desc: "Create fundraising campaigns for your own ideas.",
        bullets: [
          "Founder funding portal",
          "Grant discovery engine",
          "Crowdfunding integration",
          "Investor matching tools"
        ]
      },
      { 
        title: "Grow your developer portfolio", 
        desc: "Build reputation, experience, and career visibility.",
        bullets: [
          "Professional skill badges",
          "Verified project history",
          "Community endorsements",
          "Career path analytics"
        ]
      }
    ],
    journeyContext: {
      "basic-profile": "Developers provide basic details to build a professional identity within the ecosystem.",
      "professional-identity": "Investors and founders look at technical domains to match skills with project needs.",
      "working-preferences": "Specifying how you work ensures you're only matched with relevant opportunities.",
      "org-affiliation": "Showcasing your history and portfolio builds immediate trust with potential partners.",
      "interests-goals": "Knowing what you want to achieve helps find projects that offer the right growth.",
      "about-you": "Your bio is your chance to highlight the person behind the code to the community.",
      "summary": "Final check of your professional profile before you start building."
    }
  },
  {
    id: "investor" as UserRole,
    title: "INVESTOR",
    icon: Briefcase,
    bullets: [
      "Discover innovative ideas",
      "Analyze necessity and demand",
      "Fund promising projects",
      "Recruit skilled developers",
      "Build an investment portfolio"
    ],
    overviewSteps: [
      { 
        title: "Explore startup ideas and projects", 
        desc: "Browse startup ideas and problem statements.",
        bullets: [
          "Sector-based deal flow",
          "Proprietary project sourcing",
          "Pre-vetted startup ideas",
          "Trending innovation alerts"
        ]
      },
      { 
        title: "Evaluate feasibility and demand", 
        desc: "Check necessity and traction.",
        bullets: [
          "Market demand analytics",
          "Technical feasibility audits",
          "Community traction metrics",
          "Risk assessment reports"
        ]
      },
      { 
        title: "Invest in promising ideas", 
        desc: "Fund promising ideas.",
        bullets: [
          "Direct investment tools",
          "Portfolio diversification",
          "Deal syndication options",
          "Investment tracking portal"
        ]
      },
      { 
        title: "Recruit developers and teams", 
        desc: "Hire developers for execution.",
        bullets: [
          "Talent acquisition portal",
          "Verified developer profiles",
          "Team building services",
          "Recruitment analytics"
        ]
      },
      { 
        title: "Track portfolio growth", 
        desc: "Track investments and progress.",
        bullets: [
          "Real-time ROI tracking",
          "Project milestone alerts",
          "Performance dashboards",
          "Exit strategy planning"
        ]
      },
      { 
        title: "Scale funded projects", 
        desc: "Support long-term growth.",
        bullets: [
          "Scale-up advisory network",
          "Follow-on funding access",
          "Strategic partner matching",
          "Expansion support tools"
        ]
      }
    ],
    journeyContext: {
      "basic-profile": "Investors introduce themselves to start building relationships with innovative founders.",
      "professional-identity": "Sharing your experience helps founders understand the strategic value you bring.",
      "working-preferences": "Setting investment preferences helps filter for projects at your preferred stage.",
      "org-affiliation": "Affiliations provide transparency about the resources and network you represent.",
      "interests-goals": "Defining your sectors of interest ensures you see the most relevant deal flow.",
      "about-you": "A clear introduction helps you stand out as a mentor and strategic partner.",
      "summary": "Review your investment profile and goals before exploring opportunities."
    }
  }
];

const DOMAINS = [
  "AI / ML",
  "Web Development",
  "Mobile App Development",
  "FinTech",
  "HealthTech",
  "EdTech",
  "Blockchain / Web3",
  "Cloud & DevOps",
  "Cyber Security",
  "Data Science"
];

const TECH_STACK = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "Firebase",
  "MongoDB",
  "PostgreSQL",
  "Python",
  "Java",
  "Spring Boot",
  "Flutter",
  "React Native",
  "AWS",
  "Docker",
  "Kubernetes"
];

const STATUS_OPTIONS = [
  "Student",
  "Working Professional",
  "Freelancer",
  "Founder",
  "Looking for Opportunities"
];

interface SearchableInputProps {
  label: string;
  placeholder: string;
  options: string[];
  onSelect: (val: string) => void;
  onClose: () => void;
}

function SearchableInputOverlay({ placeholder, options, onSelect, onClose }: SearchableInputProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById('search-input-focus')?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options.slice(0, 5);
    return options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options, searchTerm]);

  return (
    <div className="absolute left-0 right-0 top-full mt-2 z-[100] bg-background/95 backdrop-blur-md p-4 rounded-xl border border-primary/20 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Select {placeholder}</h4>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 rounded-full">
          <X className="w-3 h-3" />
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          id="search-input-focus"
          className="pl-10 bg-white/5 border-white/10 h-11 focus-visible:ring-primary/20"
          placeholder={`Search ${placeholder}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="max-h-[200px] overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-1">
        {filteredOptions.length > 0 ? (
          filteredOptions.map(opt => (
            <Button 
              key={opt} 
              variant="ghost" 
              size="sm"
              onClick={() => {
                onSelect(opt);
                onClose();
              }}
              className="justify-start hover:bg-primary/10 hover:text-primary text-xs h-9 transition-all"
            >
              {opt}
            </Button>
          ))
        ) : (
          <div className="text-[10px] text-muted-foreground w-full text-center py-4">No results found for "{searchTerm}"</div>
        )}
      </div>
    </div>
  );
}

interface TagInputProps {
  label: string;
  placeholder: string;
  options: string[];
  values: string[];
  onChange: (vals: string[]) => void;
  id: string;
  activeSearchId: string | null;
  onToggleSearch: (id: string | null) => void;
}

function TagInput({ label, placeholder, options, values, onChange, id, activeSearchId, onToggleSearch }: TagInputProps) {
  const isSearching = activeSearchId === id;

  const removeTag = (tag: string) => {
    onChange(values.filter(v => v !== tag));
  };

  const addTag = (tag: string) => {
    if (!values.includes(tag)) {
      onChange([...values, tag]);
    }
  };

  return (
    <div className="space-y-2 relative">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2 items-center min-h-11 p-2 rounded-xl bg-white/5 border border-white/10">
        {values.filter(v => v).map(tag => (
          <Badge 
            key={tag} 
            className="bg-primary/20 text-primary border-primary/20 flex items-center gap-1 h-7 px-2"
          >
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
              <X className="w-2.5 h-2.5" />
            </button>
          </Badge>
        ))}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onToggleSearch(isSearching ? null : id)}
          className={cn(
            "h-7 w-7 rounded-full transition-colors",
            isSearching ? "bg-primary text-white" : "bg-white/10 hover:bg-primary/20 hover:text-primary"
          )}
        >
          <Plus className={cn("w-3 h-3 transition-transform", isSearching && "rotate-45")} />
        </Button>
      </div>
      {isSearching && (
        <SearchableInputOverlay 
          placeholder={placeholder}
          options={options}
          onSelect={addTag}
          onClose={() => onToggleSearch(null)}
          label={label}
        />
      )}
    </div>
  );
}

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ElementType;
}

function GlassInput({ icon: Icon, className, ...props }: GlassInputProps) {
  return (
    <div className="relative group w-full">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      )}
      <Input 
        className={cn(
          "w-full bg-white/5 border-white/10 h-11 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all backdrop-blur-sm",
          Icon && "pl-10",
          className
        )} 
        {...props}
      />
    </div>
  );
}

interface GlassSelectProps {
  label: string;
  placeholder: string;
  icon?: React.ElementType;
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
}

function GlassSelect({ label, placeholder, icon: Icon, options, value, onChange }: GlassSelectProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="bg-white/5 border-white/10 h-11 focus:ring-primary/20 focus:border-primary/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent className="z-[70] bg-background/95 backdrop-blur-md border-white/10">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const SummaryField = ({ label, value }: { label: string, value: any }) => {
  if (value === undefined || value === null || (typeof value === "string" && value.trim() === "") || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="space-y-1 overflow-hidden">
      <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">{label}</p>
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-1">
          {value.map((v, i) => <Badge key={i} variant="outline" className="text-[9px] md:text-[10px] border-white/10 h-4 md:h-5 px-1.5 max-w-full truncate">{v}</Badge>)}
        </div>
      ) : (
        <p className="text-xs md:text-sm font-medium leading-tight break-words">{value}</p>
      )}
    </div>
  );
};

export default function Auth() {
  const [location] = useLocation();
  const initialMode: AuthMode = location.includes("register") ? "signup" : "login";
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("role-selection");
  const [signupStep, setSignupStep] = useState<SignupStep>("basic-profile");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [journeyStepIndex, setJourneyStepIndex] = useState(0);
  const [formData, setFormData] = useState<any>({
    interests: [],
    problemDomains: [],
    skills: [],
    fullName: "",
    email: "",
    profileImage: "",
    location: "",
    timezone: "",
    prevIdeas: "",
    techDomain: "",
    status: "",
    collegeName: "",
    collegePlace: "",
    currentYear: "",
    degree: "",
    resumeLink: "",
    portfolioLink: "",
    githubLink: "",
    experience: "",
    investorCat: "",
    workPref: "",
    availability: "",
    equityInterest: "",
    involvement: "",
    investmentStage: [],
    orgName: "",
    orgRole: "",
    orgType: "",
    isOrg: "no",
    bio: "",
    tagline: "",
    objectives: "",
    successDefinition: "",
    currentProject: "",
    annualSalary: "",
    focus: "",
    teamSize: ""
  });
  const [loading, setLoading] = useState(true);
  const [isRoleCardExpanded, setIsRoleCardExpanded] = useState(false);
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Initialize correct step based on mode
  useEffect(() => {
    if (mode === "login") {
      setOnboardingStep("registration");
    } else if (mode === "signup" && !selectedRole) {
      setOnboardingStep("role-selection");
    }
  }, [mode, selectedRole]);

  const stepsList = useMemo(() => {
    const baseSteps: SignupStep[] = [
      "basic-profile",
      "professional-identity",
      "working-preferences",
      "org-affiliation",
      "interests-goals",
      "about-you",
      "summary"
    ];
    
    if (selectedRole === "idea-holder") {
      return baseSteps.filter(s => s !== "org-affiliation");
    }
    
    return baseSteps;
  }, [selectedRole]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-primary/10 relative overflow-hidden border border-primary/20 flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer -translate-x-full" />
             <Lightbulb className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-8 w-48 bg-muted/20 rounded mx-auto relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer -translate-x-full" />
            </div>
            <div className="h-4 w-64 bg-muted/10 rounded mx-auto relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer -translate-x-full" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-xl bg-muted/5 border border-white/5 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer -translate-x-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleModeToggle = (newMode: AuthMode) => {
    setMode(newMode);
    if (newMode === "login") {
      setOnboardingStep("registration");
      setSelectedRole(null);
    } else {
      setOnboardingStep("role-selection");
      setSelectedRole(null);
    }
  };

  const handleRoleSelect = (roleId: UserRole) => {
    setSelectedRole(roleId);
    setJourneyStepIndex(0);
    setOnboardingStep("role-overview");
  };

  const handleStartRegistration = () => {
    if (selectedRole) {
      localStorage.setItem("userRole", selectedRole);
    }
    setOnboardingStep("registration");
    setSignupStep("basic-profile");
  };

  const nextStep = () => {
    const currentIndex = stepsList.indexOf(signupStep);
    if (currentIndex < stepsList.length - 1) {
      setSignupStep(stepsList[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = stepsList.indexOf(signupStep);
    if (currentIndex > 0) {
      setSignupStep(stepsList[currentIndex - 1]);
    } else {
      setOnboardingStep("role-overview");
    }
  };

  const renderSummary = () => {
    const role = roles.find(r => r.id === selectedRole)!;
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <h3 className="text-lg font-bold mb-4">Registration Summary</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            <SummaryField label="Role" value={role.title} />
            <SummaryField label="Full Name" value={formData.fullName} />
            <SummaryField label="Email" value={formData.email} />
            {selectedRole === "idea-holder" && (
              <>
                <SummaryField label="Current Project" value={formData.currentProject} />
                <SummaryField label="Annual Salary" value={formData.annualSalary ? `$${formData.annualSalary}` : ""} />
                <SummaryField label="Focus" value={formData.focus} />
                <SummaryField label="Team Size" value={formData.teamSize} />
              </>
            )}
            <SummaryField label="Location" value={formData.location} />
            <SummaryField label="Timezone" value={formData.timezone} />
            <SummaryField label="Bio" value={formData.bio} />
            <SummaryField label="Tagline" value={formData.tagline} />
            <SummaryField label="Experience" value={formData.experience} />
            <SummaryField label="Skills" value={formData.skills} />
            <SummaryField label="Interests" value={formData.interests} />
            <SummaryField label="Problem Domains" value={formData.problemDomains} />
            <SummaryField label="Work Preference" value={formData.workPref} />
            <SummaryField label="Availability" value={formData.availability} />
            {formData.isOrg === "yes" && (
              <>
                <SummaryField label="Organization" value={formData.orgName} />
                <SummaryField label="Org Role" value={formData.orgRole} />
                <SummaryField label="Org Type" value={formData.orgType} />
              </>
            )}
            <SummaryField label="Objectives" value={formData.objectives} />
            <SummaryField label="Success Definition" value={formData.successDefinition} />
          </div>
        </div>
      </div>
    );
  };

  const renderRoleCard = (isFixed: boolean = false) => {
    if (!selectedRole) return null;
    const role = roles.find(r => r.id === selectedRole)!;

    return (
      <Card className={cn(
        "glass-card border-primary/20 bg-primary/5 group relative overflow-hidden",
        isFixed && "sticky top-4"
      )}>
        {/* Glass Reflection Animation Overlay */}
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
        </div>
        <CardContent className="p-6 space-y-4 relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <role.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Selected Role</p>
              <h3 className="text-lg font-display font-bold">{role.title}</h3>
            </div>
          </div>
          
          <ul className="space-y-3 pt-2">
            {role.bullets.map((bullet, idx) => (
              <li key={idx} className="flex gap-3 text-xs text-muted-foreground leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setOnboardingStep("role-selection")} 
            className="w-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary mt-2"
          >
            Change Role
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderStepHeader = (title: string, description: string) => (
    <div className="text-center space-y-1 mb-6 px-4">
      <h2 className="text-xl md:text-2xl font-display font-bold text-gradient-primary leading-tight">{title}</h2>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* DevConnect Header - Always Fixed */}
      <div className="w-full max-w-6xl mb-8 text-center shrink-0">
        <Link href="/">
          <div className="inline-flex items-center gap-2 cursor-pointer group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <ChevronLeft className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-display font-bold text-gradient-primary">DevConnect</span>
          </div>
        </Link>
      </div>

      <div className="w-full max-w-6xl shrink-0">
        {/* Login/Signup Tabs - Always Fixed */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 p-1 rounded-full border border-white/10 flex">
            <button 
              onClick={() => handleModeToggle("login")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === "login" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
            >
              Login
            </button>
            <button 
              onClick={() => handleModeToggle("signup")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === "signup" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.div key="login" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="max-w-md mx-auto w-full">
              <Card className="glass-card border-white/5 overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center space-y-2 mb-4">
                    <h2 className="text-2xl font-display font-bold">Welcome Back</h2>
                    <p className="text-muted-foreground">Access your workspace and projects.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pass">Password</Label>
                      <Input id="pass" type="password" placeholder="••••••••" className="bg-white/5 border-white/10" />
                    </div>
                  </div>
                  <Button className="w-full py-6 font-bold text-lg mt-4 shadow-lg shadow-primary/20">Login to DevConnect</Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key={onboardingStep + (selectedRole || "")} variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              {onboardingStep === "role-selection" && (
                <div className="space-y-8 max-w-5xl mx-auto">
                  {renderStepHeader("Choose Your Path", "Select your role to start your journey on DevConnect.")}
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role) => (
                      <Card key={role.id} className="glass-card hover-elevate border-white/5 flex flex-col h-full overflow-hidden transition-all hover:border-primary/30 group relative">
                        {/* Glass Reflection Animation Overlay */}
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                        </div>
                        <CardContent className="p-6 md:p-8 flex-1 flex flex-col relative z-20">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                            <role.icon className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-bold mb-4">{role.title}</h3>
                          <ul className="space-y-3 mb-6 flex-1">
                            {role.bullets.map((bullet, idx) => (
                              <li key={idx} className="flex gap-3 text-xs md:text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                          <Button onClick={() => handleRoleSelect(role.id)} className="w-full font-bold">Continue as {role.title}</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {onboardingStep === "role-overview" && selectedRole && (
                <div className="grid lg:grid-cols-[300px_1fr] gap-8 max-w-5xl mx-auto items-start">
                  <div className="hidden lg:block">
                    {renderRoleCard()}
                  </div>
                  <Card className="glass-card border-white/5 overflow-hidden h-fit lg:min-h-[480px] flex flex-col">
                    <CardContent className="p-8 relative flex-1 overflow-hidden flex flex-col">
                      {(() => {
                        const role = roles.find(r => r.id === selectedRole)!;
                        const currentStep = role.overviewSteps[journeyStepIndex];
                        return (
                          <>
                            <div className="space-y-2 mb-6 shrink-0">
                              <div className="flex justify-between items-center">
                                <h2 className="text-xl font-display font-bold text-gradient-primary">Journey Step {journeyStepIndex + 1}</h2>
                                <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">
                                  {journeyStepIndex + 1} / {role.overviewSteps.length}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex-1 flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 font-bold text-primary text-xl shadow-lg shadow-primary/5">
                                  {journeyStepIndex + 1}
                                </div>
                                <h4 className="text-lg font-bold tracking-tight">{currentStep.title}</h4>
                              </div>
                              
                              <p className="text-sm text-muted-foreground leading-relaxed italic">{currentStep.desc}</p>
                              
                              <ul className="space-y-2 pt-2">
                                {currentStep.bullets?.map((bullet, bIdx) => (
                                  <li key={bIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                              
                              {/* Visual Progress Dots */}
                              <div className="flex gap-2 pt-4 justify-center">
                                {role.overviewSteps.map((_, idx) => (
                                  <div 
                                    key={idx} 
                                    className={cn(
                                      "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                      idx === journeyStepIndex ? "w-4 bg-primary" : "bg-white/10"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between shrink-0">
                              <Button 
                                variant="ghost" 
                                onClick={() => {
                                  if (journeyStepIndex > 0) {
                                    setJourneyStepIndex(journeyStepIndex - 1);
                                  } else {
                                    setOnboardingStep("role-selection");
                                  }
                                }} 
                                className="text-muted-foreground hover:text-white h-11 px-6"
                              >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back
                              </Button>
                              
                              {journeyStepIndex < role.overviewSteps.length - 1 ? (
                                <Button 
                                  onClick={() => setJourneyStepIndex(journeyStepIndex + 1)} 
                                  className="font-bold h-11 px-8 shadow-lg shadow-primary/20 group relative overflow-hidden"
                                >
                                  {/* Glass Reflection Animation Overlay */}
                                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                                  </div>
                                  <span className="relative z-20 flex items-center">
                                    Next Step
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </span>
                                </Button>
                              ) : (
                                <Button 
                                  onClick={handleStartRegistration} 
                                  className="font-bold h-11 px-8 shadow-lg shadow-primary/20 bg-primary group relative overflow-hidden"
                                >
                                  {/* Glass Reflection Animation Overlay */}
                                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                                  </div>
                                  <span className="relative z-20 flex items-center">
                                    Start Registration
                                    <Rocket className="w-4 h-4 ml-2" />
                                  </span>
                                </Button>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </div>
              )}

              {onboardingStep === "registration" && selectedRole && (
                <div className="grid lg:grid-cols-[300px_1fr] gap-8 max-w-6xl mx-auto items-start">
                  {/* Progress Sidebar - Desktop only */}
                  <div className="hidden lg:block space-y-4 sticky top-4">
                    {renderRoleCard(true)}
                    <Card className="glass-card border-white/5 p-6">
                      <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-6">Your Journey</h3>
                      <div className="space-y-6 relative">
                        {/* Connection Line */}
                        <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-white/5" />
                        
                        {stepsList.map((step, idx) => {
                          const isCompleted = stepsList.indexOf(signupStep) > idx;
                          const isActive = signupStep === step;
                          return (
                            <div key={step} className="flex gap-4 relative">
                              <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300",
                                isCompleted ? "bg-primary text-white" : isActive ? "bg-primary/20 text-primary border border-primary/40 ring-4 ring-primary/5" : "bg-white/5 text-muted-foreground border border-white/10"
                              )}>
                                {isCompleted ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                              </div>
                              <div className="overflow-hidden">
                                <p className={cn(
                                  "text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
                                  isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                                )}>
                                  {step.replace("-", " ")}
                                </p>
                                {isActive && (
                                  <p className="text-[9px] text-muted-foreground leading-tight animate-in fade-in slide-in-from-left-2 duration-300 mt-0.5">
                                    {roles.find(r => r.id === selectedRole)?.journeyContext?.[step as keyof (typeof roles[0]['journeyContext'])]}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </div>

                  {/* Main Form Area */}
                  <div className="flex-1 space-y-6">
                    <Card className="glass-card border-white/5 overflow-hidden">
                      <CardContent className="p-8">
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={signupStep} 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                          >
                            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                              <div>
                                <h2 className="text-2xl font-display font-bold text-gradient-primary capitalize">
                                  {signupStep.replace("-", " ")}
                                </h2>
                                <p className="text-sm text-muted-foreground">Step {stepsList.indexOf(signupStep) + 1} of {stepsList.length}</p>
                              </div>
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                {(() => {
                                  const icons: any = {
                                    "basic-profile": User,
                                    "professional-identity": Target,
                                    "working-preferences": Clock,
                                    "org-affiliation": Building2,
                                    "interests-goals": Trophy,
                                    "about-you": Info,
                                    "summary": Rocket
                                  };
                                  const IconComp = icons[signupStep];
                                  return <IconComp className="w-6 h-6 text-primary" />;
                                })()}
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 items-start">
                              {signupStep === "basic-profile" && (
                                <>
                                  <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <GlassInput 
                                      icon={User} 
                                      placeholder="John Doe" 
                                      value={formData.fullName}
                                      onChange={(e) => updateFormData("fullName", e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <GlassInput 
                                      icon={Mail} 
                                      placeholder="john@example.com" 
                                      value={formData.email}
                                      onChange={(e) => updateFormData("email", e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Location</Label>
                                    <GlassInput 
                                      icon={MapPin} 
                                      placeholder="San Francisco, CA" 
                                      value={formData.location}
                                      onChange={(e) => updateFormData("location", e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Timezone</Label>
                                    <GlassInput 
                                      icon={Clock} 
                                      placeholder="UTC-8" 
                                      value={formData.timezone}
                                      onChange={(e) => updateFormData("timezone", e.target.value)}
                                    />
                                  </div>
                                </>
                              )}

                              {signupStep === "professional-identity" && (
                                <>
                                  {selectedRole === "developer" ? (
                                    <>
                                      <div className="md:col-span-2">
                                        <GlassSelect 
                                          label="Current Status"
                                          placeholder="Select status..."
                                          icon={Users}
                                          options={STATUS_OPTIONS.map(s => ({ label: s, value: s }))}
                                          value={formData.status}
                                          onChange={(v) => updateFormData("status", v)}
                                        />
                                      </div>
                                      <div className="md:col-span-2">
                                        <TagInput 
                                          id="skills"
                                          label="Technical Skills"
                                          placeholder="Skill"
                                          options={TECH_STACK}
                                          values={formData.skills}
                                          onChange={(v) => updateFormData("skills", v)}
                                          activeSearchId={activeSearchId}
                                          onToggleSearch={setActiveSearchId}
                                        />
                                      </div>
                                    </>
                                  ) : selectedRole === "investor" ? (
                                    <div className="md:col-span-2">
                                      <GlassSelect 
                                        label="Investor Category"
                                        placeholder="Select category..."
                                        icon={DollarSign}
                                        options={[
                                          { label: "Angel Investor", value: "angel" },
                                          { label: "Venture Capital", value: "vc" },
                                          { label: "Family Office", value: "family" },
                                          { label: "Private Equity", value: "pe" }
                                        ]}
                                        value={formData.investorCat}
                                        onChange={(v) => updateFormData("investorCat", v)}
                                      />
                                    </div>
                                  ) : (
                                    <div className="md:col-span-2">
                                      <Label>Tell us about your background</Label>
                                      <Textarea 
                                        className="bg-white/5 border-white/10 min-h-[120px]" 
                                        placeholder="Share your professional journey..."
                                        value={formData.experience}
                                        onChange={(e) => updateFormData("experience", e.target.value)}
                                      />
                                    </div>
                                  )}
                                </>
                              )}

                              {signupStep === "working-preferences" && (
                                <>
                                  <div className="md:col-span-2">
                                    <GlassSelect 
                                      label="Work Preference"
                                      placeholder="Select preference..."
                                      icon={Globe}
                                      options={[
                                        { label: "Remote", value: "remote" },
                                        { label: "On-site", value: "onsite" },
                                        { label: "Hybrid", value: "hybrid" }
                                      ]}
                                      value={formData.workPref}
                                      onChange={(v) => updateFormData("workPref", v)}
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <Label>Weekly Availability</Label>
                                    <RadioGroup 
                                      onValueChange={(v) => updateFormData("availability", v)} 
                                      value={formData.availability}
                                      className="grid grid-cols-2 gap-4 mt-2"
                                    >
                                      {["< 10 hrs", "10-20 hrs", "20-40 hrs", "Full-time"].map(v => (
                                        <div key={v} className="relative group">
                                          <RadioGroupItem value={v} id={v} className="peer sr-only" />
                                          <Label 
                                            htmlFor={v} 
                                            className="flex items-center justify-center p-4 border border-white/10 rounded-xl bg-white/5 cursor-pointer peer-data-[state=checked]:bg-primary/20 peer-data-[state=checked]:border-primary transition-all hover:bg-white/10"
                                          >
                                            <span className="text-sm font-medium">{v}</span>
                                          </Label>
                                        </div>
                                      ))}
                                    </RadioGroup>
                                  </div>
                                </>
                              )}

                              {signupStep === "org-affiliation" && (
                                <>
                                  <div className="md:col-span-2 space-y-4">
                                    <Label>Are you affiliated with an organization?</Label>
                                    <RadioGroup 
                                      onValueChange={(v) => updateFormData("isOrg", v)} 
                                      value={formData.isOrg}
                                      className="flex gap-4"
                                    >
                                      {["yes", "no"].map(v => (
                                        <div key={v} className="flex items-center gap-2">
                                          <RadioGroupItem value={v} id={`org-${v}`} />
                                          <Label htmlFor={`org-${v}`} className="capitalize">{v}</Label>
                                        </div>
                                      ))}
                                    </RadioGroup>
                                  </div>
                                  {formData.isOrg === "yes" && (
                                    <>
                                      <div className="space-y-2">
                                        <Label>Organization Name</Label>
                                        <GlassInput icon={Building2} placeholder="Acme Corp" value={formData.orgName} onChange={(e) => updateFormData("orgName", e.target.value)} />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Your Role</Label>
                                        <GlassInput icon={User} placeholder="Partner" value={formData.orgRole} onChange={(e) => updateFormData("orgRole", e.target.value)} />
                                      </div>
                                    </>
                                  )}
                                </>
                              )}

                              {signupStep === "interests-goals" && (
                                <div className="md:col-span-2 space-y-6">
                                  <TagInput 
                                    id="interests"
                                    label="Sectors of Interest"
                                    placeholder="Sector"
                                    options={DOMAINS}
                                    values={formData.interests}
                                    onChange={(v) => updateFormData("interests", v)}
                                    activeSearchId={activeSearchId}
                                    onToggleSearch={setActiveSearchId}
                                  />
                                  <div className="space-y-2">
                                    <Label>Key Objectives</Label>
                                    <Textarea 
                                      placeholder="What do you want to achieve on DevConnect?" 
                                      className="bg-white/5 border-white/10 min-h-[100px]"
                                      value={formData.objectives}
                                      onChange={(e) => updateFormData("objectives", e.target.value)}
                                    />
                                  </div>
                                </div>
                              )}

                              {signupStep === "about-you" && (
                                <div className="md:col-span-2 space-y-6">
                                  <div className="space-y-2">
                                    <Label>Professional Tagline</Label>
                                    <GlassInput icon={Target} placeholder="Building the future of..." value={formData.tagline} onChange={(e) => updateFormData("tagline", e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Full Bio</Label>
                                    <Textarea 
                                      placeholder="Tell the community who you are..." 
                                      className="bg-white/5 border-white/10 min-h-[150px]"
                                      value={formData.bio}
                                      onChange={(e) => updateFormData("bio", e.target.value)}
                                    />
                                  </div>
                                </div>
                              )}

                              {signupStep === "summary" && (
                                <div className="md:col-span-2">
                                  {renderSummary()}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                              <Button 
                                variant="ghost" 
                                onClick={prevStep} 
                                className="h-11 px-6 text-muted-foreground hover:text-white transition-colors"
                              >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back
                              </Button>
                              <Button 
                                onClick={() => {
                                  if (signupStep === "summary") {
                                    window.location.href = "/feed";
                                  } else {
                                    nextStep();
                                  }
                                }}
                                className="h-11 px-8 font-bold shadow-lg shadow-primary/20 group relative overflow-hidden"
                              >
                                 {/* Glass Reflection Animation Overlay */}
                                 <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10">
                                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                                </div>
                                <span className="relative z-20 flex items-center">
                                  {signupStep === "summary" ? "Launch Profile" : "Continue"}
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </span>
                              </Button>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
