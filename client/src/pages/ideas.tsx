import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronLeft, Bookmark, BrainCircuit, Target, Code2, 
  Database, Network, ListChecks, ArrowRight, Share2, 
  Lightbulb, ShieldAlert, Cpu
} from "lucide-react";
import emptyIdeas from "@/assets/empty-ideas.png";

// Mock data based on the questionnaire
const MOCK_IDEAS = [
  {
    id: "idea-1",
    title: "NeuroGuardian: Federated Learning for Edge IoT Security",
    tagline: "Detecting zero-day anomalies on microcontrollers without exposing raw telemetry.",
    difficulty: "Bleeding Edge",
    impact: "Research Paper",
    feasibilityScore: 85,
    innovationScore: 95,
    demoImpact: 90,
    tags: ["AI/ML", "IoT", "Cybersecurity", "Federated Learning"],
    problem: "IoT devices are increasingly targeted by botnets, but running traditional IDS on edge devices drains battery and sending raw data to the cloud compromises privacy.",
    novelty: "Implementing a lightweight federated learning model directly on ESP32/Raspberry Pi hardware, allowing devices to collaboratively learn anomaly patterns without sharing raw network traffic.",
    architecture: [
      "Edge Node: C++ firmware running TensorFlow Lite for Microcontrollers.",
      "Aggregator: Python/FastAPI server managing model weight updates.",
      "Dashboard: React/Vite UI visualizing anomaly detection confidence across the fleet.",
      "Communication: MQTT over TLS for lightweight, secure weight transmission."
    ],
    datasets: "KDD Cup 1999 (subsampled for edge) or TON_IoT dataset.",
    deliverables: [
      "Working prototype on 3+ ESP32 nodes",
      "Centralized aggregation server",
      "Benchmark report comparing edge vs cloud detection latency",
      "Research paper draft"
    ],
    extensions: "Implement differential privacy during weight aggregation to prevent membership inference attacks."
  },
  {
    id: "idea-2",
    title: "EchoScript: LLM-Assisted Legacy Code Translation Engine",
    tagline: "Automating the migration of COBOL/Fortran systems to modern microservices.",
    difficulty: "Challenging",
    impact: "Startup Potential",
    feasibilityScore: 92,
    innovationScore: 88,
    demoImpact: 95,
    tags: ["LLMs", "Compilers", "Web Dev", "DevTools"],
    problem: "Financial and government institutions rely on decades-old legacy code that no one understands how to maintain, creating massive technical debt.",
    novelty: "A developer tool that doesn't just translate syntax, but uses RAG (Retrieval-Augmented Generation) against modern design patterns to suggest microservice boundaries and automatically generate unit tests for the new code.",
    architecture: [
      "Frontend: Next.js/React side-by-side code editor with diff highlighting.",
      "Backend API: Node.js server orchestrating LLM calls.",
      "AI Engine: LangChain + OpenAI/Anthropic API with custom prompt chaining.",
      "AST Parser: Tree-sitter for validating structural integrity of generated code."
    ],
    datasets: "Open-source COBOL repositories on GitHub for few-shot prompting examples.",
    deliverables: [
      "Interactive web IDE for code translation",
      "CLI tool for bulk file processing",
      "Automated test generation module",
      "Demo showcasing a specific banking algorithm migration"
    ],
    extensions: "Integrate static analysis tools to verify the generated code doesn't introduce OWASP Top 10 vulnerabilities."
  },
  {
    id: "idea-3",
    title: "OmniSight: Accessible Spatial Awareness Wearable",
    tagline: "Low-cost haptic feedback system for visually impaired navigation using depth cameras.",
    difficulty: "Moderate",
    impact: "Social Impact",
    feasibilityScore: 78,
    innovationScore: 82,
    demoImpact: 100,
    tags: ["Computer Vision", "Hardware", "Accessibility", "Haptics"],
    problem: "Current assistive navigation technologies for the visually impaired are either too expensive (smart glasses) or lack detailed spatial awareness (white canes).",
    novelty: "Using cheap off-the-shelf depth cameras (like Intel RealSense or OAK-D) paired with a belt of vibration motors to translate 3D spatial mapping into intuitive tactile feedback.",
    architecture: [
      "Hardware: Depth camera + Raspberry Pi + custom vibration motor array.",
      "Vision Pipeline: OpenCV Python script processing depth maps into obstacle vectors.",
      "Haptic Controller: Arduino translating vectors into PWM signals for motors.",
      "Companion App: React Native mobile app for configuration and emergency sharing."
    ],
    datasets: "NYU Depth Dataset V2 for testing algorithms before hardware integration.",
    deliverables: [
      "Wearable hardware prototype",
      "Real-time object detection and haptic translation pipeline",
      "Companion mobile app",
      "User testing documentation with simulated impairment"
    ],
    extensions: "Add a lightweight object classification model (YOLOv8-nano) to distinguish between static obstacles and moving people/vehicles."
  }
];

export default function Ideas() {
  const [selectedIdea, setSelectedIdea] = useState(MOCK_IDEAS[0]);
  const [savedIdeas, setSavedIdeas] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"explore" | "plan">("explore");

  const toggleSave = (id: string) => {
    setSavedIdeas(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff.toLowerCase()) {
      case 'moderate': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'challenging': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'bleeding edge': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-white/10 bg-background/80 backdrop-blur-md px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <Link href="/plan">
            <Button variant="ghost" size="icon" className="hover:bg-white/5">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-display font-bold">Synthesized Ideas</h1>
            <p className="text-xs text-muted-foreground hidden md:block">Based on your profile: AI/ML, IoT, 6 Months, Research Focus</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 hidden sm:flex">
            <Share2 className="w-4 h-4 mr-2" />
            Export List
          </Button>
          <Button className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
            <Bookmark className="w-4 h-4 mr-2" />
            Saved ({savedIdeas.length})
          </Button>
        </div>
      </header>

      {/* Main Content Area - Split View */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Idea List */}
        <div className="w-full md:w-[380px] lg:w-[450px] shrink-0 border-r border-white/10 bg-background/50 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-white/10 shrink-0">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Top Matches</h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Highest Feasibility</Badge>
              <Badge variant="outline" className="bg-purple-500/5 text-purple-400 border-purple-500/20">Most Innovative</Badge>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {MOCK_IDEAS.map((idea) => (
                <div 
                  key={idea.id}
                  onClick={() => setSelectedIdea(idea)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedIdea.id === idea.id 
                      ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(37,99,235,0.15)]' 
                      : 'bg-card border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-white/5">{idea.impact}</Badge>
                      <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 h-5 border ${getDifficultyColor(idea.difficulty)}`}>
                        {idea.difficulty}
                      </Badge>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleSave(idea.id); }}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Bookmark className={`w-4 h-4 ${savedIdeas.includes(idea.id) ? 'fill-primary text-primary' : ''}`} />
                    </button>
                  </div>
                  <h3 className="font-bold text-base leading-tight mb-2 group-hover:text-primary transition-colors">{idea.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{idea.tagline}</p>
                </div>
              ))}

              <div className="mt-8 p-6 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                <img src={emptyIdeas} alt="No more ideas" className="w-24 h-24 mx-auto mb-4 opacity-50 grayscale" />
                <h4 className="text-sm font-bold mb-1">Want different options?</h4>
                <p className="text-xs text-muted-foreground mb-4">Adjust your questionnaire answers to generate a new batch.</p>
                <Link href="/plan">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">
                    Tweak Parameters
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right Detail View */}
        <div className="hidden md:flex flex-col flex-1 bg-background h-full overflow-hidden relative">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
          
          {viewMode === "explore" ? (
            <ScrollArea className="flex-1 px-8 lg:px-12 py-8">
              <div className="max-w-4xl mx-auto pb-20">
                <motion.div 
                  key={selectedIdea.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header Section */}
                  <div className="mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedIdea.tags.map(t => (
                        <Badge key={t} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">{t}</Badge>
                      ))}
                    </div>
                    <h2 className="text-4xl font-display font-bold mb-4 tracking-tight leading-tight">{selectedIdea.title}</h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">{selectedIdea.tagline}</p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="glass-card p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-display font-bold text-blue-400 mb-1">{selectedIdea.feasibilityScore}</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Feasibility</span>
                    </div>
                    <div className="glass-card p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-display font-bold text-purple-400 mb-1">{selectedIdea.innovationScore}</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Innovation</span>
                    </div>
                    <div className="glass-card p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-display font-bold text-emerald-400 mb-1">{selectedIdea.demoImpact}</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Demo Impact</span>
                    </div>
                  </div>

                  {/* Content Tabs */}
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 mb-8 p-1 h-12">
                      <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
                      <TabsTrigger value="architecture" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Architecture</TabsTrigger>
                      <TabsTrigger value="execution" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Execution</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-8 mt-0 focus-visible:outline-none focus-visible:ring-0">
                      <section>
                        <h3 className="flex items-center text-lg font-bold mb-3 text-glow">
                          <Target className="w-5 h-5 mr-2 text-primary" /> The Problem
                        </h3>
                        <p className="text-muted-foreground leading-relaxed p-4 bg-white/5 rounded-xl border border-white/5">{selectedIdea.problem}</p>
                      </section>
                      
                      <section>
                        <h3 className="flex items-center text-lg font-bold mb-3 text-glow">
                          <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" /> The Novelty Angle
                        </h3>
                        <p className="text-muted-foreground leading-relaxed p-4 bg-yellow-400/5 rounded-xl border border-yellow-400/10">{selectedIdea.novelty}</p>
                      </section>
                    </TabsContent>

                    <TabsContent value="architecture" className="space-y-8 mt-0 focus-visible:outline-none focus-visible:ring-0">
                      <section>
                        <h3 className="flex items-center text-lg font-bold mb-4 text-glow">
                          <Network className="w-5 h-5 mr-2 text-primary" /> System Architecture
                        </h3>
                        <div className="grid gap-3">
                          {selectedIdea.architecture.map((item, i) => {
                            const [component, desc] = item.split(': ');
                            return (
                              <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-4">
                                <div className="mt-1"><Cpu className="w-5 h-5 text-muted-foreground" /></div>
                                <div>
                                  <span className="font-bold text-foreground block mb-1">{component}</span>
                                  <span className="text-sm text-muted-foreground leading-relaxed">{desc}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>

                      <section>
                        <h3 className="flex items-center text-lg font-bold mb-3 text-glow">
                          <Database className="w-5 h-5 mr-2 text-blue-400" /> Data Requirements
                        </h3>
                        <p className="text-muted-foreground p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">{selectedIdea.datasets}</p>
                      </section>
                    </TabsContent>

                    <TabsContent value="execution" className="space-y-8 mt-0 focus-visible:outline-none focus-visible:ring-0">
                      <section>
                        <h3 className="flex items-center text-lg font-bold mb-4 text-glow">
                          <ListChecks className="w-5 h-5 mr-2 text-emerald-400" /> Expected Deliverables
                        </h3>
                        <ul className="space-y-3">
                          {selectedIdea.deliverables.map((item, i) => (
                            <li key={i} className="flex items-center p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                              <div className="w-2 h-2 rounded-full bg-emerald-400 mr-3" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section>
                        <h3 className="flex items-center text-lg font-bold mb-3 text-glow">
                          <ShieldAlert className="w-5 h-5 mr-2 text-purple-400" /> Potential Extensions
                        </h3>
                        <p className="text-muted-foreground p-4 bg-purple-500/5 rounded-xl border border-purple-500/10">{selectedIdea.extensions}</p>
                      </section>
                    </TabsContent>
                  </Tabs>

                  {/* Action Footer */}
                  <div className="mt-12 flex justify-end">
                    <Button 
                      size="lg" 
                      onClick={() => setViewMode("plan")}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
                    >
                      <Code2 className="w-5 h-5 mr-2" />
                      Convert to Project Plan
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              </div>
            </ScrollArea>
          ) : (
            /* Planning View (Generated Milestones) */
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-xl font-bold mb-1">Project Milestone Plan</h2>
                  <p className="text-sm text-muted-foreground">Generated for: {selectedIdea.title}</p>
                </div>
                <Button variant="ghost" onClick={() => setViewMode("explore")}>
                  Cancel
                </Button>
              </div>
              
              <ScrollArea className="flex-1 p-8">
                <div className="max-w-3xl mx-auto space-y-6 pb-20">
                  
                  {/* Timeline */}
                  <div className="relative border-l-2 border-white/10 ml-4 pl-8 space-y-12">
                    
                    <div className="relative">
                      <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary" />
                      <h3 className="text-lg font-bold text-primary mb-2">Phase 1: Research & Setup (Weeks 1-3)</h3>
                      <div className="glass-card p-4 rounded-xl space-y-2">
                        <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground mt-1" /><span className="text-sm">Conduct literature review on {selectedIdea.tags[0]} techniques.</span></div>
                        <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground mt-1" /><span className="text-sm">Acquire and clean {selectedIdea.datasets}.</span></div>
                        <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground mt-1" /><span className="text-sm">Set up Git repository, CI/CD, and development environment.</span></div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-2 border-blue-400" />
                      <h3 className="text-lg font-bold text-blue-400 mb-2">Phase 2: Core Prototype (Weeks 4-8)</h3>
                      <div className="glass-card p-4 rounded-xl space-y-2">
                        <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground mt-1" /><span className="text-sm">Develop baseline model/backend API.</span></div>
                        <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground mt-1" /><span className="text-sm">Implement core logic: {selectedIdea.architecture[0].split(':')[1]}</span></div>
                        <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground mt-1" /><span className="text-sm">Draft initial internal documentation.</span></div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-2 border-purple-400" />
                      <h3 className="text-lg font-bold text-purple-400 mb-2">Phase 3: Integration & UI (Weeks 9-12)</h3>
                      <div className="glass-card p-4 rounded-xl space-y-2">
                        <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground mt-1" /><span className="text-sm">Build frontend interface and connect to backend.</span></div>
                        <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground mt-1" /><span className="text-sm">Handle edge cases and error states.</span></div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-2 border-emerald-400" />
                      <h3 className="text-lg font-bold text-emerald-400 mb-2">Phase 4: Evaluation & Demo (Weeks 13-15)</h3>
                      <div className="glass-card p-4 rounded-xl space-y-2">
                        <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground mt-1" /><span className="text-sm">Run performance benchmarks and gather metrics.</span></div>
                        <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground mt-1" /><span className="text-sm">Finalize project report/thesis document.</span></div>
                        <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground mt-1" /><span className="text-sm">Prepare presentation slides and live demo script.</span></div>
                      </div>
                    </div>

                  </div>

                  <div className="mt-8 flex justify-center gap-4">
                    <Button variant="outline" className="border-white/20">Download PDF</Button>
                    <Button className="bg-primary text-primary-foreground">Save Plan to Dashboard</Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}