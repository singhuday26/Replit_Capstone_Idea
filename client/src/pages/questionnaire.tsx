import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import type {
  GenerateIdeasResponse,
  QuestionnaireInput,
} from "@shared/idea-contract";

const STEPS = [
  {
    id: "academic",
    title: "Academic Background",
    description: "Your field of study and core strengths",
  },
  {
    id: "interests",
    title: "Technical Interests",
    description: "What you actually enjoy building",
  },
  {
    id: "constraints",
    title: "Project Constraints",
    description: "Time, team, and hardware limits",
  },
  {
    id: "goals",
    title: "Desired Impact",
    description: "What you want to achieve with this project",
  },
];

export default function Questionnaire() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuestionnaireInput>({
    branch: "",
    skills: "",
    experience: "none",
    interests: [],
    customInterest: "",
    problemSpace: "",
    teamSize: "1",
    timeframe: "6 months",
    hardware: "no",
    impact: "grade",
    difficulty: "moderate",
  });

  const updateForm = <K extends keyof QuestionnaireInput>(
    key: K,
    value: QuestionnaireInput[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const generationMutation = useMutation({
    mutationFn: async (payload: QuestionnaireInput) => {
      const response = await apiRequest("POST", "/api/ideas/generate", payload);
      return response.json() as Promise<GenerateIdeasResponse>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["generatedIdeas"], data);
      setLocation("/ideas");
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected error while generating ideas.";
      toast({
        title: "Generation failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
      return;
    }

    if (!generationMutation.isPending) {
      generationMutation.mutate(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 md:px-8">
      {/* Progress Header */}
      <div className="w-full max-w-3xl mb-12">
        <div className="flex justify-between mb-4">
          {STEPS.map((step, idx) => (
            <div
              key={step.id}
              className={`flex flex-col items-center w-1/4 ${idx <= currentStep ? "opacity-100" : "opacity-40"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 transition-colors ${
                  idx < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : idx === currentStep
                      ? "border-primary text-primary border-glow"
                      : "border-muted text-muted-foreground"
                }`}
              >
                {idx < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span className="text-xs font-bold text-center hidden md:block">
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-2xl glass-card rounded-2xl p-6 md:p-10 border border-white/10 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-glow">
            {STEPS[currentStep].title}
          </h2>
          <p className="text-muted-foreground">
            {STEPS[currentStep].description}
          </p>
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {currentStep === 0 && (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="branch" className="text-base">
                      Engineering Branch
                    </Label>
                    <Input
                      id="branch"
                      placeholder="e.g. Computer Science, Electronics, Mechanical..."
                      className="bg-background/50 border-white/10 h-12"
                      value={formData.branch}
                      onChange={(e) => updateForm("branch", e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="skills" className="text-base">
                      Current Tech Stack & Skills
                    </Label>
                    <Textarea
                      id="skills"
                      placeholder="Languages, frameworks, tools you are comfortable with (e.g. Python, React, PyTorch, C++)"
                      className="bg-background/50 border-white/10 min-h-[100px]"
                      value={formData.skills}
                      onChange={(e) => updateForm("skills", e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Prior Experience</Label>
                    <RadioGroup
                      value={formData.experience}
                      onValueChange={(v) =>
                        updateForm(
                          "experience",
                          v as QuestionnaireInput["experience"],
                        )
                      }
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      {[
                        { id: "none", label: "Mostly Coursework" },
                        { id: "hackathon", label: "Hackathons/Side Projects" },
                        { id: "research", label: "Research/Internships" },
                      ].map((opt) => (
                        <div key={opt.id} className="relative">
                          <RadioGroupItem
                            value={opt.id}
                            id={opt.id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={opt.id}
                            className="flex flex-col items-center justify-center p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 transition-all text-center h-full"
                          >
                            {opt.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div className="space-y-3">
                    <Label className="text-base">
                      Areas of Interest (Select multiple)
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        "AI / Machine Learning",
                        "Web Development",
                        "Mobile Apps",
                        "Internet of Things (IoT)",
                        "Cybersecurity",
                        "Blockchain / Web3",
                        "Data Science",
                        "Computer Vision",
                        "Cloud Computing",
                      ].map((interest) => (
                        <div
                          key={interest}
                          className="flex items-start space-x-2 p-3 rounded-lg border border-white/5 hover:border-white/20 transition-colors"
                        >
                          <Checkbox
                            id={`int-${interest}`}
                            checked={formData.interests.includes(
                              interest as never,
                            )}
                            onCheckedChange={() =>
                              handleInterestToggle(interest)
                            }
                            className="mt-1"
                          />
                          <Label
                            htmlFor={`int-${interest}`}
                            className="cursor-pointer leading-snug font-normal"
                          >
                            {interest}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="custom-interest" className="text-base">
                      Other Interests?
                    </Label>
                    <Input
                      id="custom-interest"
                      placeholder="e.g. Quantum Computing, Bioinformatics..."
                      className="bg-background/50 border-white/10 h-12"
                      value={formData.customInterest}
                      onChange={(e) =>
                        updateForm("customInterest", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="problem" className="text-base">
                      Is there a specific problem space you care about?
                    </Label>
                    <Textarea
                      id="problem"
                      placeholder="e.g. Healthcare accessibility, climate change, education tools..."
                      className="bg-background/50 border-white/10"
                      value={formData.problemSpace}
                      onChange={(e) =>
                        updateForm("problemSpace", e.target.value)
                      }
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-base">Team Size</Label>
                      <RadioGroup
                        value={formData.teamSize}
                        onValueChange={(v) =>
                          updateForm(
                            "teamSize",
                            v as QuestionnaireInput["teamSize"],
                          )
                        }
                        className="flex flex-col space-y-2"
                      >
                        {[
                          { id: "1", label: "Solo Project" },
                          { id: "2-3", label: "Small Team (2-3 members)" },
                          { id: "4+", label: "Large Team (4+ members)" },
                        ].map((opt) => (
                          <div
                            key={opt.id}
                            className="flex items-center space-x-2 bg-background/30 p-3 rounded-lg border border-white/5"
                          >
                            <RadioGroupItem
                              value={opt.id}
                              id={`team-${opt.id}`}
                            />
                            <Label
                              htmlFor={`team-${opt.id}`}
                              className="cursor-pointer"
                            >
                              {opt.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base">Time Available</Label>
                      <RadioGroup
                        value={formData.timeframe}
                        onValueChange={(v) =>
                          updateForm(
                            "timeframe",
                            v as QuestionnaireInput["timeframe"],
                          )
                        }
                        className="flex flex-col space-y-2"
                      >
                        {[
                          { id: "3 months", label: "Short (1-3 months)" },
                          { id: "6 months", label: "Standard (1 semester)" },
                          { id: "1 year", label: "Long (Full academic year)" },
                        ].map((opt) => (
                          <div
                            key={opt.id}
                            className="flex items-center space-x-2 bg-background/30 p-3 rounded-lg border border-white/5"
                          >
                            <RadioGroupItem
                              value={opt.id}
                              id={`time-${opt.id}`}
                            />
                            <Label
                              htmlFor={`time-${opt.id}`}
                              className="cursor-pointer"
                            >
                              {opt.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Label className="text-base">Hardware Constraints</Label>
                    <RadioGroup
                      value={formData.hardware}
                      onValueChange={(v) =>
                        updateForm(
                          "hardware",
                          v as QuestionnaireInput["hardware"],
                        )
                      }
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="relative">
                        <RadioGroupItem
                          value="no"
                          id="hw-no"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="hw-no"
                          className="flex flex-col p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 transition-all"
                        >
                          <span className="font-bold mb-1">Software Only</span>
                          <span className="text-sm text-muted-foreground font-normal">
                            Standard laptop/cloud is sufficient
                          </span>
                        </Label>
                      </div>
                      <div className="relative">
                        <RadioGroupItem
                          value="yes"
                          id="hw-yes"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="hw-yes"
                          className="flex flex-col p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 transition-all"
                        >
                          <span className="font-bold mb-1">
                            Hardware Included
                          </span>
                          <span className="text-sm text-muted-foreground font-normal">
                            Have budget/access to sensors, GPUs,
                            microcontrollers
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="space-y-3">
                    <Label className="text-base">
                      Primary Goal / Desired Impact
                    </Label>
                    <RadioGroup
                      value={formData.impact}
                      onValueChange={(v) =>
                        updateForm("impact", v as QuestionnaireInput["impact"])
                      }
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {[
                        {
                          id: "grade",
                          title: "Solid Grade & Resume",
                          desc: "Well-executed, practical, demonstrates competence.",
                        },
                        {
                          id: "research",
                          title: "Research Paper",
                          desc: "Novel approach, academic focus, experimental.",
                        },
                        {
                          id: "startup",
                          title: "Startup Potential",
                          desc: "Market need, product-oriented, scalable.",
                        },
                        {
                          id: "social",
                          title: "Social Impact",
                          desc: "Solves a real community problem, open-source.",
                        },
                      ].map((opt) => (
                        <div key={opt.id} className="relative">
                          <RadioGroupItem
                            value={opt.id}
                            id={`impact-${opt.id}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`impact-${opt.id}`}
                            className="flex flex-col p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 transition-all"
                          >
                            <span className="font-bold mb-1">{opt.title}</span>
                            <span className="text-sm text-muted-foreground font-normal">
                              {opt.desc}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Label className="text-base">
                      Preferred Technical Difficulty
                    </Label>
                    <RadioGroup
                      value={formData.difficulty}
                      onValueChange={(v) =>
                        updateForm(
                          "difficulty",
                          v as QuestionnaireInput["difficulty"],
                        )
                      }
                      className="flex space-x-6"
                    >
                      {["Moderate", "Challenging", "Bleeding Edge"].map(
                        (diff) => (
                          <div
                            key={diff}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={diff.toLowerCase()}
                              id={`diff-${diff}`}
                            />
                            <Label
                              htmlFor={`diff-${diff}`}
                              className="cursor-pointer"
                            >
                              {diff}
                            </Label>
                          </div>
                        ),
                      )}
                    </RadioGroup>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mt-8 flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-primary mb-1">
                        Ready to Synthesize
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI will process your profile to generate 3 distinct,
                        highly-tailored capstone project architectures.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Form Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0 || generationMutation.isPending}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={generationMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px] shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
          >
            {currentStep === STEPS.length - 1 &&
            generationMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : currentStep === STEPS.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Ideas
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
