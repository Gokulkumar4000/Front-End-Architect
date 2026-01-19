import { useState } from "react";
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
  Users,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Fingerprint,
  ChevronDown,
  MapPin,
  Check
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";
type AuthStep = "role-selection" | "roadmap" | "form";
type UserRole = "idea-holder" | "developer" | "investor";

const roadmapContent = {
  developer: {
    title: "DEVELOPER",
    steps: [
      { 
        number: "01", 
        title: "Explore Ideas", 
        desc: "Discover innovative startup ideas and problem statements waiting for a technical partner.",
        bullets: [
          "Browse a curated list of verified ideas",
          "Filter by industry, tech stack, or complexity",
          "View market necessity and demand data",
          "Save promising ideas to your dashboard"
        ],
        icon: Lightbulb 
      },
      { 
        number: "02", 
        title: "Collaborate", 
        desc: "Connect with idea holders and other developers to form high-impact teams.",
        bullets: [
          "Directly message idea owners",
          "Join existing developer groups",
          "Share your portfolio and skills",
          "Form legal and technical agreements"
        ],
        icon: Users 
      },
      { 
        number: "03", 
        title: "Apply for Roles", 
        desc: "Find full-time or part-time opportunities in emerging startup projects.",
        bullets: [
          "Apply to projects seeking your stack",
          "Receive invitations from investors",
          "Showcase your contributions in-app",
          "Track your application status"
        ],
        icon: Briefcase 
      },
      { 
        number: "04", 
        title: "Build MVPs", 
        desc: "Turn concepts into reality by developing Minimum Viable Products.",
        bullets: [
          "Access shared development resources",
          "Use integrated project management tools",
          "Securely share code and progress",
          "Gather early user feedback"
        ],
        icon: Code2 
      },
      { 
        number: "05", 
        title: "Raise Funds", 
        desc: "Leverage your built products to attract serious investment and scale.",
        bullets: [
          "Pitch your MVP to verified investors",
          "Demonstrate technical feasibility",
          "Discuss equity and milestones",
          "Transition from project to startup"
        ],
        icon: Rocket 
      }
    ]
  },
  "idea-holder": {
    title: "IDEA HOLDER",
    steps: [
      { 
        number: "01", 
        title: "Post Your Idea", 
        desc: "Share your idea or problem statement securely with the DevConnect community.",
        bullets: [
          "Choose category and visibility levels",
          "Protect idea ownership through timestamps",
          "Define the specific problem you're solving",
          "Allow limited detail previews for safety"
        ],
        icon: Lightbulb 
      },
      { 
        number: "02", 
        title: "Measure Necessity", 
        desc: "Track real-world demand and interest from potential users and partners.",
        bullets: [
          "View engagement and 'need' metrics",
          "Get feedback from industry experts",
          "See interest from developers and investors",
          "Increase idea value through validation"
        ],
        icon: TrendingUp 
      },
      { 
        number: "03", 
        title: "Collaborate", 
        desc: "Attract and accept collaboration requests from skilled developers.",
        bullets: [
          "Review developer profiles and portfolios",
          "Select the right technical partners",
          "Discuss implementation strategies",
          "Convert your idea into an active project"
        ],
        icon: Users 
      },
      { 
        number: "04", 
        title: "Attract Funding", 
        desc: "Present your validated idea to investors looking for the next big thing.",
        bullets: [
          "Showcase market demand data",
          "Pitch to interested venture capitalists",
          "Negotiate seed funding or grants",
          "Receive guidance from financial mentors"
        ],
        icon: Briefcase 
      },
      { 
        number: "05", 
        title: "Build or Transfer", 
        desc: "Bring the product to market or sell the validated concept to others.",
        bullets: [
          "Lead your new team to launch",
          "Or sell ownership to interested buyers",
          "Scale based on validated necessity",
          "Complete your startup journey"
        ],
        icon: Rocket 
      }
    ]
  },
  investor: {
    title: "INVESTOR",
    steps: [
      { 
        number: "01", 
        title: "Discover Ideas", 
        desc: "Browse a stream of high-potential ideas backed by real market necessity.",
        bullets: [
          "Access early-stage innovation",
          "Filter by validation score and sector",
          "Monitor trending problem statements",
          "Follow interesting idea holders"
        ],
        icon: Lightbulb 
      },
      { 
        number: "02", 
        title: "Analyze Demand", 
        desc: "Use built-in analytics to understand the real-world demand for any project.",
        bullets: [
          "Review community 'necessity' votes",
          "Analyze developer interest metrics",
          "Examine competitive landscape data",
          "Assess project growth potential"
        ],
        icon: TrendingUp 
      },
      { 
        number: "03", 
        title: "Fund Projects", 
        desc: "Directly support promising projects with capital and strategic resources.",
        bullets: [
          "Initiate funding discussions",
          "Set performance-based milestones",
          "Secure equity or profit-sharing",
          "Manage investments from one portal"
        ],
        icon: Briefcase 
      },
      { 
        number: "04", 
        title: "Recruit Talent", 
        desc: "Help your funded projects scale by recruiting the best technical talent.",
        bullets: [
          "Browse top developer portfolios",
          "Send invitations to skilled coders",
          "Assist in forming core teams",
          "Ensure technical success of assets"
        ],
        icon: UserPlus 
      },
      { 
        number: "05", 
        title: "Manage Portfolio", 
        desc: "Track the growth and success of your entire startup portfolio.",
        bullets: [
          "Monitor project launch timelines",
          "Track ROI and valuation growth",
          "Facilitate exit opportunities",
          "Build a legacy of successful ventures"
        ],
        icon: Fingerprint 
      }
    ]
  }
};

const roles = [
  {
    id: "idea-holder" as UserRole,
    title: "IDEA HOLDER",
    icon: Lightbulb,
    bullets: [
      "Post ideas or problem statements securely",
      "Measure real-world necessity and demand",
      "Attract investors based on interest",
      "Collaborate with skilled developers",
      "Build, sell, or fundraise for ideas"
    ]
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
    ]
  },
  {
    id: "investor" as UserRole,
    title: "INVESTOR",
    icon: Briefcase,
    bullets: [
      "Discover high-potential ideas",
      "Analyze necessity and market demand",
      "Fund promising projects",
      "Recruit skilled developers",
      "Build and manage a startup portfolio"
    ]
  }
];

export default function Auth() {
  const [location] = useLocation();
  const initialMode: AuthMode = location.includes("register") ? "signup" : "login";
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [step, setStep] = useState<AuthStep>(initialMode === "login" ? "form" : "role-selection");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [roadmapStep, setRoadmapStep] = useState(0);
  const [isOrg, setIsOrg] = useState("no");

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const handleModeToggle = (newMode: AuthMode) => {
    setMode(newMode);
    if (newMode === "login") {
      setStep("form");
      setSelectedRole(null);
    } else {
      setStep("role-selection");
    }
  };

  const handleRoleSelect = (roleId: UserRole) => {
    setSelectedRole(roleId);
    setStep("roadmap");
    setRoadmapStep(0);
  };

  const handleNextRoadmap = () => {
    const roleRoadmap = roadmapContent[selectedRole!];
    if (roadmapStep < roleRoadmap.steps.length - 1) {
      setRoadmapStep(roadmapStep + 1);
    } else {
      setStep("form");
    }
  };

  const handleBackRoadmap = () => {
    if (roadmapStep > 0) {
      setRoadmapStep(roadmapStep - 1);
    } else {
      setStep("role-selection");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <Link href="/">
            <div className="inline-flex items-center gap-2 cursor-pointer group">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <ChevronLeft className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-display font-bold text-gradient-primary">DevConnect</span>
            </div>
          </Link>
        </div>

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
          {mode === "login" && step === "form" && (
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
          )}

          {mode === "signup" && step === "role-selection" && (
            <motion.div key="role-selection" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-display font-bold">Choose Your Path</h2>
                <p className="text-muted-foreground">Select your role to start your journey on DevConnect.</p>
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <Card key={role.id} className="glass-card hover-elevate border-white/5 flex flex-col h-full overflow-hidden">
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
                      <Button onClick={() => handleRoleSelect(role.id)} className="w-full">Continue</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {mode === "signup" && step === "roadmap" && selectedRole && (
            <motion.div key="roadmap" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="grid lg:grid-cols-[0.8fr_1.2fr] gap-4 items-start max-h-[85vh]">
              <Card className="glass-card border-primary/20 p-5 rounded-2xl hidden lg:block">
                {(() => {
                  const roleData = roles.find(r => r.id === selectedRole)!;
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <roleData.icon className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-display font-bold uppercase tracking-tight">{roleData.title}</h2>
                      </div>
                      
                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <ul className="space-y-3">
                          {roleData.bullets.map((b, i) => (
                            <li key={i} className="text-xs flex items-start gap-2 leading-relaxed text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setStep("role-selection")} 
                        className="w-full text-xs font-bold border-primary/20 hover:bg-primary/5"
                      >
                        Change Role
                      </Button>
                    </div>
                  );
                })()}
              </Card>

              <Card className="glass-card border-white/5 overflow-hidden flex flex-col max-h-full">
                <CardContent className="p-5 md:p-6 flex flex-col h-full overflow-hidden">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-display font-bold">Your Journey</h2>
                      <p className="text-muted-foreground text-xs">How it works as a <span className="text-primary font-bold">{roadmapContent[selectedRole].title}</span></p>
                    </div>
                    <div className="lg:hidden">
                      <Button variant="ghost" size="sm" onClick={() => setStep("role-selection")} className="text-primary text-xs font-bold">
                        Change Role
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[300px]">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={roadmapStep} 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10 }} 
                        className="space-y-4"
                      >
                        {(() => {
                          const stepData = (roadmapContent[selectedRole] as any).steps[roadmapStep];
                          return (
                            <div className="space-y-4">
                              <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                  <stepData.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Step {stepData.number}</div>
                                  <h3 className="text-lg font-display font-bold">{stepData.title}</h3>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <p className="text-muted-foreground text-sm leading-relaxed">{stepData.desc}</p>
                                
                                <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/5">
                                  <h4 className="text-xs font-bold uppercase text-white/50 tracking-wider">What happens:</h4>
                                  <ul className="grid gap-2">
                                    {stepData.bullets.map((bullet: string, idx: number) => (
                                      <li key={idx} className="flex gap-2 text-xs text-muted-foreground leading-snug">
                                        <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                        <span>{bullet}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-2 justify-center">
                      {roadmapContent[selectedRole].steps.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === roadmapStep ? "w-8 bg-primary" : "w-1.5 bg-white/10"}`} />
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleBackRoadmap} 
                        className="text-muted-foreground hover:text-white px-2"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" /> {roadmapStep === 0 ? "Roles" : "Back"}
                      </Button>
                      
                      <Button onClick={handleNextRoadmap} className="px-8 shadow-lg shadow-primary/20 font-bold">
                        {roadmapStep < roadmapContent[selectedRole].steps.length - 1 ? "Next Step" : "Get Started"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {mode === "signup" && step === "form" && selectedRole && (
            <motion.div key="form" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="max-w-2xl mx-auto w-full">
              <Card className="glass-card border-white/5 overflow-hidden">
                <CardContent className="p-8 space-y-8">
                  <div className="text-center space-y-2 mb-4">
                    <h2 className="text-3xl font-display font-bold">Registration</h2>
                    <p className="text-muted-foreground">Joining as a <span className="text-primary font-bold">{selectedRole.replace("-", " ").toUpperCase()}</span></p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Common Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                        <Input id="name" placeholder="John Doe" className="bg-white/5 border-white/10 focus:border-primary/50 transition-all h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                        <Input id="email" type="email" placeholder="john@example.com" className="bg-white/5 border-white/10 focus:border-primary/50 transition-all h-12 rounded-xl" />
                      </div>
                    </div>

                    {/* Role Specific Fields */}
                    {selectedRole === "idea-holder" && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">Country / Location</Label>
                            <Select>
                              <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary/20">
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                                {["United States", "United Kingdom", "India", "Germany", "Canada", "Other"].map(opt => (
                                  <SelectItem key={opt} value={opt.toLowerCase()} className="hover:bg-primary/20 focus:bg-primary/20 cursor-pointer">
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">Area of Interest</Label>
                            <Select>
                              <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary/20">
                                <SelectValue placeholder="Select area" />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                                {["Fintech", "Healthtech", "AI & ML", "E-commerce", "SaaS", "Clean Energy"].map(opt => (
                                  <SelectItem key={opt} value={opt.toLowerCase()} className="hover:bg-primary/20 focus:bg-primary/20 cursor-pointer">
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="desc" className="text-sm font-semibold">Short Description of your Vision</Label>
                          <Textarea id="desc" placeholder="Tell us what you want to build..." className="bg-white/5 border-white/10 focus:border-primary/50 transition-all rounded-xl min-h-[120px]" />
                        </div>
                      </div>
                    )}

                    {selectedRole === "developer" && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">Primary Domain</Label>
                            <Select>
                              <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary/20">
                                <SelectValue placeholder="Select domain" />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                                {["Frontend", "Backend", "Fullstack", "Mobile", "DevOps", "Web3"].map(opt => (
                                  <SelectItem key={opt} value={opt.toLowerCase()} className="hover:bg-primary/20 focus:bg-primary/20 cursor-pointer">
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">Years of Experience</Label>
                            <Select>
                              <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary/20">
                                <SelectValue placeholder="Select years" />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                                {["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"].map(opt => (
                                  <SelectItem key={opt} value={opt.replace(/\s/g, "-").toLowerCase()} className="hover:bg-primary/20 focus:bg-primary/20 cursor-pointer">
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-semibold">Current Status</Label>
                          <RadioGroup defaultValue="freelance" className="flex flex-wrap gap-4">
                            {[
                              { label: "Freelance", value: "freelance" },
                              { label: "Full-time", value: "fulltime" },
                              { label: "Student", value: "student" }
                            ].map((item) => (
                              <div key={item.value} className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                                <RadioGroupItem value={item.value} id={item.value} className="border-primary text-primary focus:ring-primary" />
                                <Label htmlFor={item.value} className="cursor-pointer text-sm">{item.label}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-semibold">Work Preference</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { label: "Remote", value: "remote" },
                              { label: "On-site", value: "onsite" },
                              { label: "Hybrid", value: "hybrid" },
                              { label: "Contract", value: "contract" }
                            ].map((item) => (
                              <div key={item.value} className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                                <Checkbox id={item.value} className="border-primary data-[state=checked]:bg-primary rounded" />
                                <Label htmlFor={item.value} className="cursor-pointer text-sm">{item.label}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="skills" className="text-sm font-semibold">Skills & Technologies</Label>
                          <Input id="skills" placeholder="React, Node.js, Python..." className="bg-white/5 border-white/10 focus:border-primary/50 transition-all h-12 rounded-xl" />
                        </div>
                      </div>
                    )}

                    {selectedRole === "investor" && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold">Investor Type</Label>
                          <RadioGroup defaultValue="angel" className="flex flex-wrap gap-4">
                            {[
                              { label: "Angel Investor", value: "angel" },
                              { label: "Venture Capital", value: "vc" },
                              { label: "Institutional", value: "institutional" }
                            ].map((item) => (
                              <div key={item.value} className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                                <RadioGroupItem value={item.value} id={item.value} className="border-primary text-primary focus:ring-primary" />
                                <Label htmlFor={item.value} className="cursor-pointer text-sm">{item.label}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-semibold">Represent an Organization?</Label>
                          <div className="space-y-4">
                            <RadioGroup value={isOrg} onValueChange={setIsOrg} className="flex gap-4">
                              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                                <RadioGroupItem value="yes" id="org-yes" className="border-primary" />
                                <Label htmlFor="org-yes" className="cursor-pointer">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                                <RadioGroupItem value="no" id="org-no" className="border-primary" />
                                <Label htmlFor="org-no" className="cursor-pointer">No</Label>
                              </div>
                            </RadioGroup>

                            <AnimatePresence>
                              {isOrg === "yes" && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }} 
                                  animate={{ height: "auto", opacity: 1 }} 
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden space-y-4"
                                >
                                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-2">
                                      <Label htmlFor="org-name" className="text-xs font-bold text-white/50">Organization Name</Label>
                                      <Input id="org-name" placeholder="Venture Co." className="bg-white/5 border-white/10 h-11 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="org-role" className="text-xs font-bold text-white/50">Your Role</Label>
                                      <Input id="org-role" placeholder="Partner" className="bg-white/5 border-white/10 h-11 rounded-xl" />
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">Preferred Domains</Label>
                            <Select>
                              <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary/20">
                                <SelectValue placeholder="Multi-select domains" />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                                {["Web3", "SaaS", "AI", "Fintech", "Consumer"].map(opt => (
                                  <SelectItem key={opt} value={opt.toLowerCase()} className="hover:bg-primary/20 focus:bg-primary/20 cursor-pointer">
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">Investment Range</Label>
                            <Select>
                              <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary/20">
                                <SelectValue placeholder="Select range" />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                                {["$10k - $50k", "$50k - $250k", "$250k - $1M", "$1M+"].map(opt => (
                                  <SelectItem key={opt} value={opt.replace(/\s/g, "-").toLowerCase()} className="hover:bg-primary/20 focus:bg-primary/20 cursor-pointer">
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <Button className="w-full py-7 font-bold text-xl rounded-2xl bg-gradient-to-r from-primary to-purple-600 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                      Create Account
                    </Button>
                    <Button variant="ghost" onClick={() => setStep("role-selection")} className="w-full text-muted-foreground hover:text-white transition-colors">
                      <ChevronLeft className="w-4 h-4 mr-2" /> Change Role
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
