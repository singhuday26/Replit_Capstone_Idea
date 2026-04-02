import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, BrainCircuit, Sparkles, Target, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/40 via-background to-background" />

      {/* Navigation */}
      <header className="relative z-10 py-6 px-8 max-w-7xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-lg border border-primary/30 border-glow">
            <BrainCircuit className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-wider">CAPSTONE<span className="text-primary">.AI</span></span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <Link href="/plan">
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              Start Planning
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto mt-12 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>For 4th Year B.Tech Students</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          Discover your perfect <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 text-glow">
            Final Year Project
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
        >
          Stop scrolling through generic lists. Our interactive advisor analyzes your skills, constraints, and goals to engineer bespoke capstone ideas that stand out.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/plan">
            <Button size="lg" className="h-14 px-8 text-lg group bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
              Initialize Advisor
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-6 rounded-2xl flex flex-col gap-4"
        >
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold">Structured Planning</h3>
          <p className="text-muted-foreground">Answer a guided questionnaire about your stack, timeline, and goals before generating ideas.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card p-6 rounded-2xl flex flex-col gap-4"
        >
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold">Curated Architectures</h3>
          <p className="text-muted-foreground">Get complete project specs including novelty angles, required datasets, and technical milestones.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-card p-6 rounded-2xl flex flex-col gap-4"
        >
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Zap className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold">Milestone Generation</h3>
          <p className="text-muted-foreground">Convert your favorite idea into a concrete action plan from literature review to final demo.</p>
        </motion.div>
      </section>
    </div>
  );
}