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
  Fingerprint
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "login" | "signup";
type AuthStep = "role-selection" | "roadmap" | "form";
type UserRole = "idea-holder" | "developer" | "investor";

const roadmapContent = {
  developer: {
    title: "DEVELOPER",
    steps: [
      { number: "01", title: "Profile", desc: "Create your dev profile", icon: UserPlus },
      { number: "02", title: "Explore", desc: "Find projects", icon: Code2 },
      { number: "03", title: "Connect", desc: "Join teams", icon: Users },
      { number: "04", title: "Build", desc: "Create products", icon: Rocket },
      { number: "05", title: "Scale", desc: "Grow startup", icon: TrendingUp }
    ]
  },
  "idea-holder": {
    title: "IDEA HOLDER",
    steps: [
      { number: "01", title: "Post", desc: "Securely post ideas", icon: Lightbulb },
      { number: "02", title: "Validate", desc: "Check demand", icon: ShieldCheck },
      { number: "03", title: "Funding", desc: "Attract investors", icon: Briefcase },
      { number: "04", title: "Team", desc: "Find developers", icon: Users },
      { number: "05", title: "Launch", desc: "Build & launch", icon: Rocket }
    ]
  },
  investor: {
    title: "INVESTOR",
    steps: [
      { number: "01", title: "Browse", desc: "Discover ideas", icon: Briefcase },
      { number: "02", title: "Analyze", desc: "Analyze demand", icon: TrendingUp },
      { number: "03", title: "Deploy", desc: "Fund projects", icon: ShieldCheck },
      { number: "04", title: "Hiring", desc: "Recruit talent", icon: Code2 },
      { number: "05", title: "Portfolio", desc: "Build portfolio", icon: Fingerprint }
    ]
  }
};

const roles = [
  {
    id: "idea-holder" as UserRole,
    title: "IDEA HOLDER",
    icon: Lightbulb,
    bullets: [
      "Post ideas or problem statements",
      "Measure real-world necessity",
      "Get funding or sell ideas",
      "No technical knowledge required"
    ]
  },
  {
    id: "developer" as UserRole,
    title: "DEVELOPER",
    icon: Code2,
    bullets: [
      "Discover startup ideas",
      "Collaborate with other developers",
      "Apply for jobs or projects",
      "Build real products"
    ]
  },
  {
    id: "investor" as UserRole,
    title: "INVESTOR",
    icon: Briefcase,
    bullets: [
      "Explore high-potential ideas",
      "Fund promising projects",
      "Recruit skilled developers",
      "Build a startup portfolio"
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
            <motion.div key="roadmap" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="grid lg:grid-cols-[1fr_1.5fr] gap-6 items-start max-h-[80vh]">
              <Card className="glass-card border-primary/20 p-6 rounded-2xl hidden lg:block">
                {(() => {
                  const roleData = roles.find(r => r.id === selectedRole)!;
                  return (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <roleData.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-xl font-display font-bold mb-2">{roleData.title}</h2>
                      <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                        <ul className="space-y-2">
                          {roleData.bullets.slice(0, 2).map((b, i) => (
                            <li key={i} className="text-xs flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-primary" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  );
                })()}
              </Card>

              <Card className="glass-card border-white/5 overflow-hidden h-full">
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-display font-bold">Your Journey</h2>
                    <p className="text-muted-foreground text-sm">How it works as a <span className="text-primary">{roadmapContent[selectedRole].title}</span></p>
                  </div>
                  <div className="flex-1 relative flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div key={roadmapStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 w-full">
                        {(() => {
                          const stepData = roadmapContent[selectedRole].steps[roadmapStep];
                          return (
                            <div className="flex gap-6 items-start">
                              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                <stepData.icon className="w-8 h-8 text-primary" />
                              </div>
                              <div className="space-y-2">
                                <div className="text-xs font-bold text-primary uppercase tracking-widest">Step {stepData.number}</div>
                                <h3 className="text-xl font-display font-bold">{stepData.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{stepData.desc}</p>
                              </div>
                            </div>
                          );
                        })()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-white/5">
                    <div className="flex gap-4">
                      <Button variant="ghost" size="sm" onClick={handleBackRoadmap} className="text-muted-foreground">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setStep("role-selection")} className="text-primary font-bold">
                        Change Role
                      </Button>
                      <Button onClick={handleNextRoadmap} className="ml-auto">
                        {roadmapStep < roadmapContent[selectedRole].steps.length - 1 ? "Next Step" : "Continue"}
                      </Button>
                    </div>
                    <div className="flex justify-center gap-2">
                      {roadmapContent[selectedRole].steps.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all ${i === roadmapStep ? "w-6 bg-primary" : "w-1 bg-white/10"}`} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {mode === "signup" && step === "form" && selectedRole && (
            <motion.div key="form" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="max-w-md mx-auto w-full">
              <Card className="glass-card border-white/5 overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center space-y-2 mb-4">
                    <h2 className="text-2xl font-display font-bold">Final Step</h2>
                    <p className="text-muted-foreground">Registering as a <span className="text-primary font-bold">{selectedRole.toUpperCase()}</span></p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" className="bg-white/5 border-white/10" />
                    </div>
                    {selectedRole === "developer" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="skills">Skills</Label>
                          <Input id="skills" placeholder="React, Node.js, Python..." className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="exp">Experience</Label>
                          <Input id="exp" placeholder="Years of experience" className="bg-white/5 border-white/10" />
                        </div>
                      </>
                    )}
                    {selectedRole === "idea-holder" && (
                      <div className="space-y-2">
                        <Label htmlFor="interest">Interest Area</Label>
                        <Input id="interest" placeholder="Fintech, AI, E-commerce..." className="bg-white/5 border-white/10" />
                      </div>
                    )}
                    {selectedRole === "investor" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="org">Organization</Label>
                          <Input id="org" placeholder="Venture Capital Co." className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="invest">Investment Interest</Label>
                          <Input id="invest" placeholder="SaaS, Web3, Biotech..." className="bg-white/5 border-white/10" />
                        </div>
                      </>
                    )}
                  </div>
                  <Button className="w-full py-6 font-bold text-lg mt-4 shadow-lg shadow-primary/20">Create Account</Button>
                  <Button variant="ghost" onClick={() => setStep("role-selection")} className="w-full text-muted-foreground">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Change Role
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
