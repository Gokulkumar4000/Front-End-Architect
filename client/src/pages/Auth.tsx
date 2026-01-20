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
      { title: "Post Your Idea", desc: "Share ideas or problem statements securely without exposing full details." },
      { title: "Measure Real-World Necessity", desc: "Track interest from users, developers, and investors." },
      { title: "Attract Collaboration", desc: "Allow developers to approach you to build solutions." },
      { title: "Secure Funding", desc: "Pitch your idea to investors or raise funds." },
      { title: "Build or Transfer Ownership", desc: "Build the idea yourself or sell it to others." }
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
      { title: "Discover Ideas & Projects", desc: "Explore startup ideas and open projects on the platform." },
      { title: "Collaborate with Teams", desc: "Join teams or work with other developers." },
      { title: "Apply for Opportunities", desc: "Apply for full-time, part-time, or contract roles." },
      { title: "Build MVPs & Products", desc: "Work on real-world products and startups." },
      { title: "Launch or Fundraise", desc: "Raise funds for your own ideas and scale projects." }
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
      { title: "Explore Ideas", desc: "Browse innovative ideas and problem statements." },
      { title: "Analyze Market Need", desc: "Evaluate necessity, traction, and interest." },
      { title: "Fund Projects", desc: "Invest in promising ideas and startups." },
      { title: "Recruit Developers", desc: "Build teams to execute funded ideas." },
      { title: "Grow Portfolio", desc: "Track and manage your startup investments." }
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

const DOMAINS = ["FinTech", "SaaS", "AI/ML", "HealthTech", "Web3", "E-commerce", "CleanTech", "EdTech"];
const TECH_STACK = ["React", "Node.js", "Python", "Rust", "Go", "AWS", "Firebase", "PostgreSQL", "TailwindCSS"];

interface SearchableInputProps {
  label: string;
  placeholder: string;
  options: string[];
  onSelect: (val: string) => void;
  onClose: () => void;
}

function SearchableInputOverlay({ placeholder, options, onSelect, onClose }: SearchableInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById('search-input-focus')?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options, searchTerm]);

  return (
    <div className="absolute inset-0 z-[100] bg-background/95 backdrop-blur-md p-4 rounded-xl border border-primary/20 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Select {placeholder}</h4>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 rounded-full">
          <X className="w-3 h-3" />
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          id="search-input-focus"
          className="pl-10 bg-white/5 border-white/10 h-11"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-wrap gap-2 content-start">
        {filteredOptions.length > 0 ? (
          filteredOptions.map(opt => (
            <Button 
              key={opt} 
              variant="outline" 
              size="sm"
              onClick={() => {
                onSelect(opt);
                onClose();
              }}
              className="bg-white/5 border-white/10 hover:border-primary/50 text-xs"
            >
              {opt}
            </Button>
          ))
        ) : (
          <div className="text-[10px] text-muted-foreground w-full text-center py-4">No results found</div>
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
          label={label}
          placeholder={placeholder}
          options={options}
          onSelect={addTag}
          onClose={() => setIsSearching(false)}
        />
      )}
    </div>
  );
}

export default function Auth() {
  const [location] = useLocation();
  const initialMode: AuthMode = location.includes("register") ? "signup" : "login";
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("role-selection");
  const [signupStep, setSignupStep] = useState<SignupStep>("basic-profile");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState<any>({
    interests: [],
    problemDomains: [],
    skills: []
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
    <div className="text-center space-y-2 mb-8">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-gradient-primary">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      {/* DevConnect Header - Always Fixed */}
      <div className="w-full max-w-6xl mb-8 text-center">
        <Link href="/">
          <div className="inline-flex items-center gap-2 cursor-pointer group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <ChevronLeft className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-display font-bold text-gradient-primary">DevConnect</span>
          </div>
        </Link>
      </div>

      <div className="w-full max-w-6xl">
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
                  <Card className="glass-card border-white/5 overflow-hidden">
                    <CardContent className="p-8 space-y-8 min-h-[550px] flex flex-col">
                      {(() => {
                        const role = roles.find(r => r.id === selectedRole)!;
                        return (
                          <>
                            <div className="space-y-2">
                              <h2 className="text-2xl font-display font-bold text-gradient-primary">Your Journey as a {role.title}</h2>
                              <p className="text-muted-foreground text-sm">Here's how DevConnect works for you.</p>
                            </div>
                            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                              {role.overviewSteps.map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 font-bold text-primary text-xs">
                                    {idx + 1}
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="font-bold text-sm">{step.title}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <Button onClick={handleStartRegistration} className="w-full py-6 font-bold shadow-lg shadow-primary/20 mt-4">
                              Continue as {role.title}
                            </Button>
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
                  <div className="lg:hidden w-full mb-4">
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
                  <div className="w-full relative z-0">
                    <Card className="glass-card border-white/5 overflow-hidden h-[600px] flex flex-col">
                      <CardContent className="p-6 md:p-8 relative flex-1 overflow-hidden flex flex-col">
                        {/* Tooltip Fix: High z-index and explicit provider */}
                        <div className="absolute right-4 top-4 z-[50]">
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full bg-primary/10 hover:bg-primary/20 cursor-pointer">
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
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                          <AnimatePresence mode="wait">
                            <motion.div 
                              key={signupStep}
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="h-full"
                            >
                              {signupStep === "basic-profile" && (
                                <>
                                  {renderStepHeader("Basic Profile Details", "Tell us who you are")}
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <div className="relative">
                                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                          <Input 
                                            className="pl-10 bg-white/5 border-white/10 h-11" 
                                            placeholder="Enter your full name" 
                                            value={formData.fullName || ""}
                                            onChange={(e) => updateFormData("fullName", e.target.value)}
                                          />
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <Input 
                                          className="bg-white/5 border-white/10 h-11" 
                                          placeholder="john@example.com" 
                                          type="email"
                                          value={formData.email || ""}
                                          onChange={(e) => updateFormData("email", e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Country / Location</Label>
                                        <Select onValueChange={(v) => updateFormData("location", v)} value={formData.location}>
                                          <SelectTrigger className="bg-white/5 border-white/10 h-11">
                                            <div className="flex items-center gap-2">
                                              <Globe className="w-4 h-4 text-muted-foreground" />
                                              <SelectValue placeholder="Select location" />
                                            </div>
                                          </SelectTrigger>
                                          <SelectContent className="z-[70]">
                                            <SelectItem value="us">United States</SelectItem>
                                            <SelectItem value="uk">United Kingdom</SelectItem>
                                            <SelectItem value="in">India</SelectItem>
                                            <SelectItem value="ca">Canada</SelectItem>
                                            <SelectItem value="de">Germany</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Time Zone</Label>
                                        <Select onValueChange={(v) => updateFormData("timezone", v)} value={formData.timezone}>
                                          <SelectTrigger className="bg-white/5 border-white/10 h-11">
                                            <div className="flex items-center gap-2">
                                              <Clock className="w-4 h-4 text-muted-foreground" />
                                              <SelectValue placeholder="Select timezone" />
                                            </div>
                                          </SelectTrigger>
                                          <SelectContent className="z-[70]">
                                            <SelectItem value="utc-5">UTC-5 (EST)</SelectItem>
                                            <SelectItem value="utc-0">UTC+0 (GMT)</SelectItem>
                                            <SelectItem value="utc+5.5">UTC+5:30 (IST)</SelectItem>
                                            <SelectItem value="utc+1">UTC+1 (CET)</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}

                              {signupStep === "professional-identity" && (
                                <>
                                  {renderStepHeader("Professional Identity", "Help us understand your background")}
                                  <div className="space-y-6">
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
                                        <div className="space-y-2">
                                          <Label>Current Status</Label>
                                          <Select onValueChange={(v) => updateFormData("status", v)} value={formData.status}>
                                            <SelectTrigger className="bg-white/5 border-white/10 h-11">
                                              <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[70]">
                                              <SelectItem value="student">Student</SelectItem>
                                              <SelectItem value="professional">Working Professional</SelectItem>
                                              <SelectItem value="freelancer">Freelancer</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </>
                                    )}
                                    {selectedRole === "investor" && (
                                      <>
                                        <div className="space-y-2">
                                          <Label>Investor Category</Label>
                                          <Select onValueChange={(v) => updateFormData("investorCat", v)} value={formData.investorCat}>
                                            <SelectTrigger className="bg-white/5 border-white/10 h-11">
                                              <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[70]">
                                              <SelectItem value="individual">Individual</SelectItem>
                                              <SelectItem value="angel">Angel</SelectItem>
                                              <SelectItem value="vc">Venture Capitalist</SelectItem>
                                            </SelectContent>
                                          </Select>
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
                                  <div className="space-y-6">
                                    {selectedRole === "idea-holder" && (
                                      <>
                                        <div className="space-y-3">
                                          <Label>What are you looking for?</Label>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {["Funding", "Developers", "Advisors", "Selling idea"].map(item => (
                                              <div key={item} className="flex items-center space-x-2 bg-white/5 p-4 rounded-xl border border-white/10 hover:border-primary/20 transition-colors cursor-pointer">
                                                <Checkbox id={item} className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                                <label htmlFor={item} className="text-sm font-medium leading-none cursor-pointer">{item}</label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Collaboration Style</Label>
                                          <Textarea className="bg-white/5 border-white/10 min-h-[120px] rounded-xl" placeholder="How do you like to work?" />
                                        </div>
                                      </>
                                    )}
                                    {selectedRole === "developer" && (
                                      <>
                                        <div className="space-y-2">
                                          <Label>Work preference</Label>
                                          <Select onValueChange={(v) => updateFormData("workPref", v)} value={formData.workPref}>
                                            <SelectTrigger className="bg-white/5 border-white/10 h-11">
                                              <SelectValue placeholder="Select preference" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[70]">
                                              <SelectItem value="fulltime">Full-time</SelectItem>
                                              <SelectItem value="parttime">Part-time</SelectItem>
                                              <SelectItem value="contract">Contract</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-3 pt-2">
                                          <Label>Interested in equity-based work?</Label>
                                          <RadioGroup defaultValue="no" className="flex gap-6">
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
                                          <Select onValueChange={(v) => updateFormData("involvement", v)} value={formData.involvement}>
                                            <SelectTrigger className="bg-white/5 border-white/10 h-11">
                                              <SelectValue placeholder="Select involvement" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[70]">
                                              <SelectItem value="passive">Passive</SelectItem>
                                              <SelectItem value="advisory">Advisory</SelectItem>
                                              <SelectItem value="active">Active</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Investment stage preference</Label>
                                          <div className="flex flex-wrap gap-2">
                                            {["Idea", "MVP", "Scaling"].map(stage => (
                                              <Badge key={stage} className="bg-white/5 hover:bg-white/10 cursor-pointer h-8 px-4 text-xs font-medium text-muted-foreground">{stage}</Badge>
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
                                  <div className="space-y-6">
                                    <div className="space-y-2">
                                      <Label>Current / Previous company</Label>
                                      <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input className="pl-10 bg-white/5 border-white/10 h-11" placeholder="Company name" />
                                      </div>
                                    </div>
                                    {selectedRole === "developer" && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label>Portfolio Link</Label>
                                          <div className="relative">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input className="pl-10 bg-white/5 border-white/10 h-11" placeholder="https://..." />
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>GitHub Profile</Label>
                                          <div className="relative">
                                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input className="pl-10 bg-white/5 border-white/10 h-11" placeholder="github.com/username" />
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
                                  </div>
                                </>
                              )}

                              {signupStep === "interests-goals" && (
                                <>
                                  {renderStepHeader("Interests & Goals", "What are you aiming to achieve?")}
                                  <div className="space-y-6">
                                    <div className="space-y-2">
                                      <Label>Primary Objectives</Label>
                                      <div className="relative">
                                        <Target className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                        <Textarea className="pl-10 bg-white/5 border-white/10 min-h-[120px] rounded-xl" placeholder="What are your main goals here?" />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Definition of Success</Label>
                                      <div className="relative">
                                        <Trophy className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                        <Textarea className="pl-10 bg-white/5 border-white/10 min-h-[120px] rounded-xl" placeholder="Describe what success looks like..." />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}

                              {signupStep === "about-you" && (
                                <>
                                  {renderStepHeader("About You", "Introduce yourself to the community")}
                                  <div className="space-y-6">
                                    <div className="space-y-2">
                                      <Label>Short Bio</Label>
                                      <Textarea className="bg-white/5 border-white/10 min-h-[180px] rounded-xl" placeholder="A bit about your background and experience..." />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Optional Tagline</Label>
                                      <Input className="bg-white/5 border-white/10 h-11" placeholder="One sentence that defines you" />
                                    </div>
                                  </div>
                                </>
                              )}

                              {signupStep === "summary" && (
                                <>
                                  {renderStepHeader("Summary Preview", "Review your details")}
                                  <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                                      <div className="flex justify-between items-start pb-4 border-b border-white/10">
                                        <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                            <User className="w-6 h-6 text-primary" />
                                          </div>
                                          <div>
                                            <h4 className="font-bold text-lg">{formData.fullName || "John Doe"}</h4>
                                            <p className="text-xs text-muted-foreground">{formData.email || "john@example.com"}</p>
                                          </div>
                                        </div>
                                        <Badge className="bg-primary/20 text-primary border-primary/20 uppercase text-[10px] font-bold h-6 px-3">
                                          {selectedRole?.replace("-", " ")}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                                        <div>
                                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Location</p>
                                          <p className="text-sm font-medium">{formData.location?.toUpperCase() || "N/A"}</p>
                                        </div>
                                        <div>
                                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Timezone</p>
                                          <p className="text-sm font-medium">{formData.timezone || "N/A"}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <Button className="w-full py-7 font-bold text-lg shadow-lg shadow-primary/20 rounded-xl">
                                      Create Account
                                    </Button>
                                  </div>
                                </>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* Footer - Always Fixed within Card */}
                        <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between bg-background/50 backdrop-blur-sm -mx-8 px-8 pb-4">
                          <Button variant="ghost" onClick={prevStep} className="text-muted-foreground hover:text-white h-11 px-6">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back
                          </Button>
                          <div className="flex gap-2">
                            {steps.map((s, idx) => (
                              <div 
                                key={s} 
                                className={cn(
                                  "h-1.5 rounded-full transition-all duration-300",
                                  steps.indexOf(signupStep) > idx ? "w-6 bg-primary/40" : 
                                  steps.indexOf(signupStep) === idx ? "w-10 bg-primary" : "w-2 bg-white/10"
                                )} 
                              />
                            ))}
                          </div>
                          {signupStep !== "summary" && (
                            <Button onClick={nextStep} className="font-bold h-11 px-8 group">
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
