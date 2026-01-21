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
  const inputRef = useState<HTMLInputElement | null>(null);

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
}

function TagInput({ label, placeholder, options, values, onChange }: TagInputProps) {
  const [isSearching, setIsSearching] = useState(false);

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
          onClick={() => setIsSearching(true)}
          className="h-7 w-7 rounded-full bg-white/10 hover:bg-primary/20 hover:text-primary transition-colors"
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      {isSearching && (
        <SearchableInputOverlay 
          placeholder={placeholder}
          options={options}
          onSelect={addTag}
          onClose={() => setIsSearching(false)}
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
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-1">
          {value.map((v, i) => <Badge key={i} variant="outline" className="text-[10px] border-white/10 h-5">{v}</Badge>)}
        </div>
      ) : (
        <p className="text-sm font-medium">{value}</p>
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
    location: "",
    timezone: "",
    prevIdeas: "",
    techDomain: "",
    status: "",
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
    successDefinition: ""
  });
  const [isRoleCardExpanded, setIsRoleCardExpanded] = useState(false);

  // Initialize correct step based on mode
  useEffect(() => {
    if (mode === "login") {
      setOnboardingStep("registration");
    } else if (mode === "signup" && !selectedRole) {
      setOnboardingStep("role-selection");
    }
  }, [mode]);

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
    setOnboardingStep("registration");
    setSignupStep("basic-profile");
  };

  const steps: SignupStep[] = [
    "basic-profile",
    "professional-identity",
    "working-preferences",
    "org-affiliation",
    "interests-goals",
    "about-you",
    "summary"
  ];

  const nextStep = () => {
    const currentIndex = steps.indexOf(signupStep);
    if (currentIndex < steps.length - 1) {
      setSignupStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(signupStep);
    if (currentIndex > 0) {
      setSignupStep(steps[currentIndex - 1]);
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
        "glass-card border-primary/20 bg-primary/5",
        isFixed && "sticky top-4"
      )}>
        <CardContent className="p-6 space-y-4">
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
                      <Card key={role.id} className="glass-card hover-elevate border-white/5 flex flex-col h-full overflow-hidden transition-all hover:border-primary/30">
                        <CardContent className="p-6 md:p-8 flex-1 flex flex-col">
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
                                  className="font-bold h-11 px-8 shadow-lg shadow-primary/20"
                                >
                                  Next Step
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              ) : (
                                <Button 
                                  onClick={handleStartRegistration} 
                                  className="font-bold h-11 px-8 shadow-lg shadow-primary/20"
                                >
                                  Continue to Registration
                                  <Rocket className="w-4 h-4 ml-2" />
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
                <div className="grid lg:grid-cols-[300px_1fr] gap-8 max-w-5xl mx-auto items-start">
                  {/* Left Role Card - Always Fixed */}
                  <div className="hidden lg:block sticky top-8">
                    {renderRoleCard(true)}
                  </div>
                  
                  {/* Mobile Role Summary */}
                  <div className="lg:hidden w-full mb-4 px-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-between bg-primary/5 border-primary/20 h-auto py-3"
                      onClick={() => setIsRoleCardExpanded(!isRoleCardExpanded)}
                    >
                      <div className="flex items-center gap-2">
                        {(() => {
                          const role = roles.find(r => r.id === selectedRole)!;
                          return (
                            <>
                              <role.icon className="w-4 h-4 text-primary" />
                              <span className="text-sm font-bold">Registering as {role.title}</span>
                            </>
                          );
                        })()}
                      </div>
                      <ChevronDown className={cn("w-4 h-4 transition-transform", isRoleCardExpanded && "rotate-180")} />
                    </Button>
                    <AnimatePresence>
                      {isRoleCardExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2">
                            {renderRoleCard()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Main Registration Card - Stable Height */}
                  <div className="w-full relative z-0 px-2 md:px-0">
                    <Card className="glass-card border-white/5 overflow-hidden h-[500px] flex flex-col shadow-2xl">
                      <CardContent className="p-0 relative flex-1 overflow-hidden flex flex-col">
                        {/* Tooltip Fix: High z-index and explicit provider */}
                        <div className="absolute right-4 top-4 z-[50]">
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full bg-primary/10 hover:bg-primary/20 cursor-pointer transition-colors">
                                  <Info className="w-3.5 h-3.5 text-primary" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent 
                                side="left"
                                align="start"
                                className="glass-card border-primary/20 max-w-xs p-4 bg-background/95 backdrop-blur-md z-[200] shadow-2xl"
                              >
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Your journey as a {roles.find(r => r.id === selectedRole)?.title}</p>
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    {(roles.find(r => r.id === selectedRole)?.journeyContext as any)[signupStep]}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        {/* Internal Scroll - Styled scrollbar */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 overflow-x-hidden">
                          <AnimatePresence mode="wait">
                            <motion.div 
                              key={signupStep}
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="h-full flex flex-col items-center"
                            >
                              {signupStep === "basic-profile" && (
                                <>
                                  {renderStepHeader("Basic Profile Details", "Tell us who you are")}
                                  <div className="space-y-4 w-full max-w-2xl mx-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                      <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <GlassInput 
                                          icon={User}
                                          placeholder="Enter your full name" 
                                          value={formData.fullName || ""}
                                          onChange={(e) => updateFormData("fullName", e.target.value)}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <GlassInput 
                                          type="email"
                                          placeholder="john@example.com" 
                                          value={formData.email || ""}
                                          onChange={(e) => updateFormData("email", e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <GlassSelect 
                                        label="Country / Location"
                                        placeholder="Select location"
                                        icon={Globe}
                                        value={formData.location}
                                        onChange={(v) => updateFormData("location", v)}
                                        options={[
                                          { label: "United States", value: "us" },
                                          { label: "United Kingdom", value: "uk" },
                                          { label: "India", value: "in" },
                                          { label: "Canada", value: "ca" },
                                          { label: "Germany", value: "de" }
                                        ]}
                                      />
                                      <GlassSelect 
                                        label="Time Zone"
                                        placeholder="Select timezone"
                                        icon={Clock}
                                        value={formData.timezone}
                                        onChange={(v) => updateFormData("timezone", v)}
                                        options={[
                                          { label: "UTC-5 (EST)", value: "utc-5" },
                                          { label: "UTC+0 (GMT)", value: "utc-0" },
                                          { label: "UTC+5:30 (IST)", value: "utc+5.5" },
                                          { label: "UTC+1 (CET)", value: "utc+1" }
                                        ]}
                                      />
                                    </div>
                                  </div>
                                </>
                              )}

                              {signupStep === "professional-identity" && (
                                <>
                                  {renderStepHeader("Professional Identity", "Help us understand your background")}
                                  <div className="space-y-6 w-full max-w-2xl mx-auto">
                                    {selectedRole === "idea-holder" && (
                                      <>
                                        <TagInput 
                                          label="Primary interest areas"
                                          placeholder="interest"
                                          options={DOMAINS}
                                          values={formData.interests || []}
                                          onChange={(vals) => updateFormData("interests", vals)}
                                        />
                                        <TagInput 
                                          label="Problem domains you care about"
                                          placeholder="domain"
                                          options={["Sustainable energy", "Education access", "Healthcare", "Financial Inclusion"]}
                                          values={formData.problemDomains || []}
                                          onChange={(vals) => updateFormData("problemDomains", vals)}
                                        />
                                        <div className="space-y-3">
                                          <Label>Have you previously worked on ideas?</Label>
                                          <RadioGroup onValueChange={(v) => updateFormData("prevIdeas", v)} value={formData.prevIdeas} className="flex gap-6">
                                            <div className="flex items-center space-x-2">
                                              <RadioGroupItem value="yes" id="yes" />
                                              <Label htmlFor="yes" className="cursor-pointer">Yes</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <RadioGroupItem value="no" id="no" />
                                              <Label htmlFor="no" className="cursor-pointer">No</Label>
                                            </div>
                                          </RadioGroup>
                                        </div>
                                      </>
                                    )}
                                    {selectedRole === "developer" && (
                                      <>
                                        <TagInput 
                                          label="Technical domains"
                                          placeholder="domain"
                                          options={DOMAINS}
                                          values={formData.interests || []}
                                          onChange={(vals) => updateFormData("interests", vals)}
                                        />
                                        <TagInput 
                                          label="Tech Stack / Skills"
                                          placeholder="skill"
                                          options={TECH_STACK}
                                          values={formData.skills || []}
                                          onChange={(vals) => updateFormData("skills", vals)}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Current Status</Label>
                                        <GlassSelect 
                                          label=""
                                          placeholder="Select status"
                                          value={formData.status}
                                          onChange={(v) => updateFormData("status", v)}
                                          options={STATUS_OPTIONS.map(opt => ({
                                            label: opt,
                                            value: opt.toLowerCase().replace(/ /g, "-")
                                          }))}
                                        />
                                      </div>
                                          <div className="space-y-2">
                                            <Label>Years of experience</Label>
                                            <Input 
                                              type="number" 
                                              className="bg-white/5 border-white/10 h-11 focus-visible:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                              placeholder="0"
                                              value={formData.experience || ""}
                                              onChange={(e) => updateFormData("experience", e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {selectedRole === "investor" && (
                                      <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Investor Category</Label>
                                        <GlassSelect 
                                          label=""
                                          placeholder="Select category"
                                          value={formData.investorCat}
                                          onChange={(v) => updateFormData("investorCat", v)}
                                          options={[
                                            { label: "Individual", value: "individual" },
                                            { label: "Angel", value: "angel" },
                                            { label: "Venture Capitalist", value: "vc" }
                                          ]}
                                        />
                                      </div>
                                          <div className="space-y-2">
                                            <Label>Investing experience (years)</Label>
                                            <Input 
                                              type="number" 
                                              className="bg-white/5 border-white/10 h-11" 
                                              placeholder="0"
                                              value={formData.experience || ""}
                                              onChange={(e) => updateFormData("experience", e.target.value)}
                                            />
                                          </div>
                                        </div>
                                        <TagInput 
                                          label="Investment focus sectors"
                                          placeholder="sector"
                                          options={DOMAINS}
                                          values={formData.interests || []}
                                          onChange={(vals) => updateFormData("interests", vals)}
                                        />
                                      </>
                                    )}
                                  </div>
                                </>
                              )}

                              {signupStep === "working-preferences" && (
                                <>
                                  {renderStepHeader("Working Preferences", "How do you want to engage?")}
                                  <div className="space-y-6 w-full max-w-2xl mx-auto">
                                    {selectedRole === "idea-holder" && (
                                      <>
                                        <div className="space-y-3">
                                          <Label>What are you looking for?</Label>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {["Funding", "Developers", "Advisors", "Selling idea"].map(item => (
                                              <div key={item} className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:border-primary/20 transition-all cursor-pointer">
                                                <Checkbox id={item} className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                                <label htmlFor={item} className="text-sm font-medium leading-none cursor-pointer">{item}</label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Collaboration Style</Label>
                                          <Textarea 
                                            className="bg-white/5 border-white/10 min-h-[120px] rounded-xl focus:border-primary/50 custom-scrollbar" 
                                            placeholder="How do you like to work?"
                                            value={formData.workPref || ""}
                                            onChange={(e) => updateFormData("workPref", e.target.value)}
                                          />
                                        </div>
                                      </>
                                    )}
                                    {selectedRole === "developer" && (
                                      <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Work preference</Label>
                                        <GlassSelect 
                                          label=""
                                          placeholder="Select preference"
                                          value={formData.workPref}
                                          onChange={(v) => updateFormData("workPref", v)}
                                          options={[
                                            { label: "Full-time", value: "fulltime" },
                                            { label: "Part-time", value: "parttime" },
                                            { label: "Contract", value: "contract" }
                                          ]}
                                        />
                                      </div>
                                          <div className="space-y-2">
                                            <Label>Availability (hours/week)</Label>
                                            <Input 
                                              type="number" 
                                              className="bg-white/5 border-white/10 h-11" 
                                              placeholder="0"
                                              value={formData.availability || ""}
                                              onChange={(e) => updateFormData("availability", e.target.value)}
                                            />
                                          </div>
                                        </div>
                                        <div className="space-y-3 pt-2">
                                          <Label>Interested in equity-based work?</Label>
                                          <RadioGroup onValueChange={(v) => updateFormData("equityInterest", v)} value={formData.equityInterest} className="flex gap-6">
                                            <div className="flex items-center space-x-2">
                                              <RadioGroupItem value="yes" id="e-yes" />
                                              <Label htmlFor="e-yes" className="cursor-pointer">Yes</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <RadioGroupItem value="no" id="e-no" />
                                              <Label htmlFor="e-no" className="cursor-pointer">No</Label>
                                            </div>
                                          </RadioGroup>
                                        </div>
                                      </>
                                    )}
                                    {selectedRole === "investor" && (
                                      <>
                                    <div className="space-y-2">
                                      <Label>Preferred involvement</Label>
                                      <GlassSelect 
                                        label=""
                                        placeholder="Select involvement"
                                        value={formData.involvement}
                                        onChange={(v) => updateFormData("involvement", v)}
                                        options={[
                                          { label: "Passive", value: "passive" },
                                          { label: "Advisory", value: "advisory" },
                                          { label: "Active", value: "active" }
                                        ]}
                                      />
                                    </div>
                                        <div className="space-y-3">
                                          <Label>Investment stage preference</Label>
                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {["Idea", "MVP", "Scaling"].map(stage => (
                                              <div 
                                                key={stage} 
                                                onClick={() => {
                                                  const current = [...(formData.investmentStage || [])];
                                                  const newVal = current.includes(stage) ? current.filter(s => s !== stage) : [...current, stage];
                                                  updateFormData("investmentStage", newVal);
                                                }}
                                                className={cn(
                                                  "flex items-center justify-center h-11 rounded-xl border transition-all cursor-pointer font-medium text-xs",
                                                  formData.investmentStage?.includes(stage) 
                                                    ? "bg-primary/20 border-primary/50 text-primary" 
                                                    : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"
                                                )}
                                              >
                                                {stage}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </>
                              )}

                              {signupStep === "org-affiliation" && (
                                <>
                                  {renderStepHeader("Organization & Affiliation", "Professional associations")}
                                  <div className="space-y-6 w-full max-w-2xl mx-auto">
                                    <div className="space-y-2">
                                      <Label>Current / Previous company</Label>
                                      <div className="relative group">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input 
                                          className="pl-10 bg-white/5 border-white/10 h-11 focus:border-primary/50" 
                                          placeholder="Company name" 
                                          value={formData.orgName || ""}
                                          onChange={(e) => updateFormData("orgName", e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    {selectedRole === "developer" && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label>Portfolio Link</Label>
                                          <div className="relative group">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input className="pl-10 bg-white/5 border-white/10 h-11 focus:border-primary/50" placeholder="https://..." />
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>GitHub Profile</Label>
                                          <div className="relative group">
                                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input className="pl-10 bg-white/5 border-white/10 h-11 focus:border-primary/50" placeholder="github.com/username" />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <div className="space-y-3">
                                      <Label>Do you represent an organization?</Label>
                                      <RadioGroup onValueChange={(v) => updateFormData("isOrg", v)} value={formData.isOrg || "no"} className="flex gap-6">
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="yes" id="org-yes" />
                                          <Label htmlFor="org-yes" className="cursor-pointer">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="no" id="org-no" />
                                          <Label htmlFor="org-no" className="cursor-pointer">No</Label>
                                        </div>
                                      </RadioGroup>
                                    </div>
                                    <AnimatePresence>
                                      {formData.isOrg === "yes" && (
                                        <motion.div 
                                          initial={{ opacity: 0, height: 0 }} 
                                          animate={{ opacity: 1, height: "auto" }} 
                                          exit={{ opacity: 0, height: 0 }}
                                          className="space-y-4 pt-2 overflow-hidden"
                                        >
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                              <Label>Your Role</Label>
                                              <Input 
                                                className="bg-white/5 border-white/10 h-11 focus:border-primary/50" 
                                                placeholder="Partner, Associate, etc." 
                                                value={formData.orgRole || ""}
                                                onChange={(e) => updateFormData("orgRole", e.target.value)}
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>Organization Type</Label>
                                              <Input 
                                                className="bg-white/5 border-white/10 h-11 focus:border-primary/50" 
                                                placeholder="e.g. VC Firm, Angel Group" 
                                                value={formData.orgType || ""}
                                                onChange={(e) => updateFormData("orgType", e.target.value)}
                                              />
                                            </div>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </>
                              )}

                              {signupStep === "interests-goals" && (
                                <>
                                  {renderStepHeader("Interests & Goals", "What are you aiming to achieve?")}
                                  <div className="space-y-6 w-full max-w-2xl mx-auto">
                                    <div className="space-y-2">
                                      <Label>Primary Objectives (Max 100 words)</Label>
                                      <div className="relative group">
                                        <Target className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Textarea 
                                          className="w-full pl-10 bg-white/5 border-white/10 min-h-[120px] rounded-xl focus:border-primary/50 custom-scrollbar" 
                                          placeholder="What are your main goals here?" 
                                          value={formData.objectives || ""}
                                          onChange={(e) => {
                                            const words = e.target.value.trim().split(/\s+/).filter(Boolean).length;
                                            if (words <= 100 || e.target.value.length < (formData.objectives || "").length) {
                                              updateFormData("objectives", e.target.value);
                                            }
                                          }}
                                        />
                                        <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground bg-background/80 px-2 py-1 rounded-md backdrop-blur-sm">
                                          {formData.objectives?.trim().split(/\s+/).filter(Boolean).length || 0} / 100 words
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Definition of Success</Label>
                                      <div className="relative group">
                                        <Trophy className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Textarea 
                                          className="w-full pl-10 bg-white/5 border-white/10 min-h-[120px] rounded-xl focus:border-primary/50" 
                                          placeholder="Describe what success looks like..." 
                                          value={formData.successDefinition || ""}
                                          onChange={(e) => updateFormData("successDefinition", e.target.value)}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}

                              {signupStep === "about-you" && (
                                <>
                                  {renderStepHeader("About You", "Introduce yourself to the community")}
                                  <div className="space-y-6 w-full max-w-2xl mx-auto">
                                    <div className="space-y-2">
                                      <Label>Short Bio (Max 150 words)</Label>
                                      <div className="relative">
                                        <Textarea 
                                          className="w-full bg-white/5 border-white/10 min-h-[180px] rounded-xl focus:border-primary/50 custom-scrollbar" 
                                          placeholder="A bit about your background and experience..." 
                                          value={formData.bio || ""}
                                          onChange={(e) => {
                                            const words = e.target.value.trim().split(/\s+/).filter(Boolean).length;
                                            if (words <= 150 || e.target.value.length < (formData.bio || "").length) {
                                              updateFormData("bio", e.target.value);
                                            }
                                          }}
                                        />
                                        <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground bg-background/80 px-2 py-1 rounded-md backdrop-blur-sm">
                                          {formData.bio?.trim().split(/\s+/).filter(Boolean).length || 0} / 150 words
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Optional Tagline (Max 20 words)</Label>
                                      <div className="relative">
                                        <Input 
                                          className="bg-white/5 border-white/10 h-11 focus:border-primary/50" 
                                          placeholder="One sentence that defines you" 
                                          value={formData.tagline || ""}
                                          onChange={(e) => {
                                            const words = e.target.value.trim().split(/\s+/).filter(Boolean).length;
                                            if (words <= 20 || e.target.value.length < (formData.tagline || "").length) {
                                              updateFormData("tagline", e.target.value);
                                            }
                                          }}
                                        />
                                        <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground bg-background/80 px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">
                                          {formData.tagline?.trim().split(/\s+/).filter(Boolean).length || 0} / 20 words
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}

                              {signupStep === "summary" && (
                                <>
                                  {renderStepHeader("Summary Preview", "Review your details before joining")}
                                  <div className="w-full max-w-4xl mx-auto flex-1 overflow-hidden flex flex-col h-full">
                                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                                      {/* Summary Box */}
                                      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8 shadow-sm min-h-[450px]">
                                <div className="flex justify-between items-start pb-4 border-b border-white/10">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                                      <User className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-lg">{formData.fullName || "N/A"}</h4>
                                      <p className="text-xs text-muted-foreground">{formData.email || "N/A"}</p>
                                    </div>
                                  </div>
                                  <Badge className="bg-primary/20 text-primary border-primary/20 uppercase text-[10px] font-bold h-6 px-3">
                                    {selectedRole?.replace("-", " ")}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <SummaryField label="Location" value={formData.location} />
                                  <SummaryField label="Timezone" value={formData.timezone} />
                                </div>

                                  <div className="space-y-6 pt-2 border-t border-white/5 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                    <div className="space-y-6">
                                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 shadow-sm">
                                        <div className="flex justify-between items-start pb-4 border-b border-white/10">
                                          <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                                              <User className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                              <h4 className="font-bold text-lg">{formData.fullName || "N/A"}</h4>
                                              <p className="text-xs text-muted-foreground">{formData.email || "N/A"}</p>
                                            </div>
                                          </div>
                                          <Badge className="bg-primary/20 text-primary border-primary/20 uppercase text-[10px] font-bold h-6 px-3">
                                            {selectedRole?.replace("-", " ")}
                                          </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-4 pt-2">
                                          <SummaryField label="Location" value={formData.location} />
                                          <SummaryField label="Timezone" value={formData.timezone} />
                                        </div>
                                      </div>

                                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 shadow-sm">
                                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest border-b border-white/5 pb-2">Professional Identity</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {selectedRole === "idea-holder" && (
                                            <>
                                              <SummaryField label="Interests" value={formData.interests} />
                                              <SummaryField label="Problem Domains" value={formData.problemDomains} />
                                              <SummaryField label="Worked on ideas" value={formData.prevIdeas} />
                                            </>
                                          )}
                                          {selectedRole === "developer" && (
                                            <>
                                              <SummaryField label="Tech Domains" value={formData.interests} />
                                              <SummaryField label="Tech Stack" value={formData.skills} />
                                              <SummaryField label="Status" value={formData.status} />
                                              <SummaryField label="Experience" value={formData.experience ? `${formData.experience} years` : null} />
                                            </>
                                          )}
                                          {selectedRole === "investor" && (
                                            <>
                                              <SummaryField label="Category" value={formData.investorCat} />
                                              <SummaryField label="Experience" value={formData.experience ? `${formData.experience} years` : null} />
                                              <SummaryField label="Focus Sectors" value={formData.interests} />
                                              <SummaryField label="Investment Stages" value={formData.investmentStage} />
                                            </>
                                          )}
                                        </div>
                                      </div>

                                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 shadow-sm">
                                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest border-b border-white/5 pb-2">Preferences & Goals</h4>
                                        <div className="space-y-4">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <SummaryField label="Work Preference" value={formData.workPref} />
                                            <SummaryField label="Availability" value={formData.availability ? `${formData.availability}h/week` : null} />
                                          </div>
                                          <SummaryField label="Tagline" value={formData.tagline} />
                                          <SummaryField label="Bio" value={formData.bio} />
                                          <SummaryField label="Objectives" value={formData.objectives} />
                                          <SummaryField label="Success Definition" value={formData.successDefinition} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                              </div>
                            </div>
                                  </div>
                                </>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </div>

                          {/* Footer - Always Fixed within Card */}
                        <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between bg-background/50 backdrop-blur-sm px-6 md:px-8 pb-4 shrink-0">
                          <Button variant="ghost" onClick={prevStep} className="text-muted-foreground hover:text-white h-11 px-6 transition-all">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back
                          </Button>
                          <div className="hidden md:flex gap-2">
                            {steps.map((s, idx) => (
                              <div 
                                key={s} 
                                className={cn(
                                  "h-1.5 rounded-full transition-all duration-300",
                                  steps.indexOf(signupStep) > idx ? "w-6 bg-primary/40" : 
                                  steps.indexOf(signupStep) === idx ? "w-10 bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]" : "w-2 bg-white/10"
                                )} 
                              />
                            ))}
                          </div>
                          {signupStep === "summary" ? (
                            <Button className="font-bold h-11 px-8 shadow-lg shadow-primary/20 animate-in fade-in slide-in-from-right-2">
                              Create Account as {roles.find(r => r.id === selectedRole)?.title}
                              <Check className="w-4 h-4 ml-2" />
                            </Button>
                          ) : (
                            <Button onClick={nextStep} className="font-bold h-11 px-8 group transition-all">
                              Next
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          )}
                        </div>
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
