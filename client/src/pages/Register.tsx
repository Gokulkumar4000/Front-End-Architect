import { Link } from "wouter";
import { ArrowLeft, Lightbulb, Code2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "innovator", title: "Innovator", icon: Lightbulb },
  { id: "builder", title: "Builder", icon: Code2 },
  { id: "investor", title: "Investor", icon: Briefcase },
];

export default function Register() {
  const [selectedRole, setSelectedRole] = useState("innovator");

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex relative bg-secondary/30 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 blur-[120px]" />
        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-display font-bold mb-6">Join the Revolution</h2>
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass border border-white/10">
              <div className="text-2xl font-bold mb-2">10k+</div>
              <div className="text-muted-foreground">Founders validated ideas</div>
            </div>
            <div className="p-6 rounded-2xl glass border border-white/10 ml-12">
              <div className="text-2xl font-bold mb-2">$50M+</div>
              <div className="text-muted-foreground">Funding secured</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-col justify-center p-6 md:p-12 lg:p-20 relative">
        <Link href="/">
          <a className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </a>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto mt-12 md:mt-0"
        >
          <div className="mb-10">
            <h1 className="text-3xl font-display font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">Start your journey today</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">I am primarily a...</label>
              <div className="grid grid-cols-3 gap-3">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200",
                      selectedRole === role.id
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                    )}
                  >
                    <role.icon className="w-5 h-5" />
                    <span className="text-xs font-bold">{role.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Create a strong password"
              />
            </div>

            <button className="w-full py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200">
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-primary font-bold cursor-pointer hover:underline">Log in</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
