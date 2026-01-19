import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Code2, 
  Lightbulb, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Briefcase,
  Zap,
  Lock,
  MessageSquare,
  Fingerprint,
  Rocket
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/30 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section id="about" className="relative pt-32 pb-20 md:pt-48 md:pb-32 container mx-auto px-4 md:px-6">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none opacity-50" />
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-sm font-medium text-primary-foreground/80">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Join the future of innovation
          </motion.div>
          
          <motion.h1 variants={item} className="text-4xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-[1.1]">
            Turn Ideas Into <br />
            <span className="text-gradient-primary">DevConnect</span>
          </motion.h1>
          
          <motion.p variants={item} className="text-base md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Where Ideas Meet Code and Capital. Connect with visionaries, builders, and investors in an all-in-one ecosystem.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full px-8 py-3 md:py-4 rounded-xl bg-primary text-white font-bold text-base md:text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating elements decoration */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-[10%] hidden lg:block p-4 glass rounded-2xl border-white/10 rotate-12"
        >
          <Code2 className="w-8 h-8 text-blue-400" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-[10%] hidden lg:block p-4 glass rounded-2xl border-white/10 -rotate-6"
        >
          <Lightbulb className="w-8 h-8 text-yellow-400" />
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-primary/20 blur-[80px] -z-10 rounded-full" />
              {/* Unsplash image for visual context - abstract digital network */}
              {/* startup team collaboration visual */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 aspect-square md:aspect-auto h-[400px]">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1632&ixlib=rb-4.0.3" 
                  alt="Team collaboration" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="glass p-4 rounded-xl border border-white/10 flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg text-primary">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Projects Launched</div>
                      <div className="text-2xl font-bold font-display">1,240+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Not just a platform, <br />
                <span className="text-primary">an ecosystem.</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                We bridge the gap between brilliant ideas and successful execution. Whether you have the concept, the capital, or the code – this is where it comes together.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Validated Concepts", desc: "Test ideas with real feedback before building." },
                  { title: "Secure Collaboration", desc: "Built-in NDAs and IP protection protocols." },
                  { title: "Rapid Scaling", desc: "Access to mentors, investors, and top talent." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{feature.title}</h4>
                      <p className="text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-24 container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Find Your Role</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everyone has a part to play in the innovation economy. Where do you fit in?
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              title: "The Innovator", 
              icon: Lightbulb, 
              desc: "You have the vision. Post your ideas securely, validate demand, and find the team to build it.",
              color: "text-yellow-400",
              bg: "bg-yellow-400/10"
            },
            { 
              title: "The Builder", 
              icon: Code2, 
              desc: "You have the skills. Join promising projects as a developer, designer, or marketer in exchange for equity.",
              color: "text-blue-400",
              bg: "bg-blue-400/10"
            },
            { 
              title: "The Investor", 
              icon: Briefcase, 
              desc: "You have the resources. Discover vetted startups early and fuel the next generation of unicorns.",
              color: "text-green-400",
              bg: "bg-green-400/10"
            }
          ].map((role, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-2xl group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-xl ${role.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <role.icon className={`w-7 h-7 ${role.color}`} />
              </div>
              <h3 className="text-2xl font-bold font-display mb-3 group-hover:text-primary transition-colors">{role.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{role.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="working" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-left" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">From concept to launch in four simple steps.</p>
          </div>

          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Join", desc: "Create your secure profile based on your role." },
                { step: "02", title: "Connect", desc: "Match with complementary talent and ideas." },
                { step: "03", title: "Build", desc: "Collaborate in private workspaces with built-in tools." },
                { step: "04", title: "Launch", desc: "Release to the market and scale with support." }
              ].map((item, i) => (
                <div key={i} className="relative z-10 bg-background/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 text-center group hover:bg-card transition-colors">
                  <div className="w-12 h-12 rounded-full bg-card border border-white/10 flex items-center justify-center mx-auto mb-4 text-primary font-bold font-mono shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="py-24 container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Security First. <br />Always.</h2>
            <p className="text-muted-foreground text-lg mb-8">
              We understand that your intellectual property is your most valuable asset. Our platform is built with enterprise-grade security to protect your vision.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">
                Read Security Whitepaper
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: ShieldCheck, title: "Role-Based Access", desc: "Granular control over who sees your sensitive data." },
              { icon: Lock, title: "IP Protection", desc: "Automated NDA generation and timestamped records." },
              { icon: MessageSquare, title: "Encrypted Chat", desc: "End-to-end encryption for all team communications." },
              { icon: Fingerprint, title: "Ownership Control", desc: "Smart contracts to manage equity and ownership." }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 bg-card/50 hover:bg-card transition-colors">
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] z-0" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">Ready to build the future?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of founders, creators, and investors turning dreams into reality.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-10 py-5 rounded-xl bg-primary text-white font-bold text-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-white/80">
              <Rocket className="w-5 h-5" />
              <span className="font-display font-bold">DevConnect</span>
            </div>
            <div className="text-muted-foreground text-sm">
              © 2024 StartupPlatform Inc. All rights reserved.
            </div>
            <div className="flex gap-6">
              {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
                <a key={social} href="#" className="text-muted-foreground hover:text-white transition-colors text-sm">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
