import { Link } from "wouter";
import { ArrowLeft, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex relative bg-primary/5 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 blur-[120px]" />
        <div className="relative z-10 max-w-lg text-center">
          <div className="inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 mb-8 backdrop-blur-xl shadow-2xl">
            <Rocket className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-4xl font-display font-bold mb-4">Welcome Back</h2>
          <p className="text-xl text-muted-foreground">
            Continue your journey. Your next big opportunity is waiting.
          </p>
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
          className="max-w-md w-full mx-auto"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold mb-2">Sign In</h1>
            <p className="text-muted-foreground">Access your dashboard</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <a href="#" className="text-xs text-primary hover:text-primary/80">Forgot password?</a>
              </div>
              <input 
                type="password" 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button className="w-full py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200">
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register">
              <span className="text-primary font-bold cursor-pointer hover:underline">Sign up for free</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
