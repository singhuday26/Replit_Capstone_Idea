import { z } from "zod";

export const experienceOptions = ["none", "hackathon", "research"] as const;
export const teamSizeOptions = ["1", "2-3", "4+"] as const;
export const timeframeOptions = ["3 months", "6 months", "1 year"] as const;
export const hardwareOptions = ["yes", "no"] as const;
export const impactOptions = [
  "grade",
  "research",
  "startup",
  "social",
] as const;
export const difficultyOptions = [
  "medium",
  "moderate",
  "challenging",
  "bleeding edge",
] as const;

export const questionnaireInputSchema = z.object({
  branch: z.string().trim().min(2, "Engineering branch is required"),
  skills: z.string().trim().min(5, "Please enter at least one core skill"),
  experience: z.enum(experienceOptions),
  interests: z.array(z.string().trim().min(2)).max(12),
  customInterest: z.string().trim().max(120),
  problemSpace: z.string().trim().max(300),
  teamSize: z.enum(teamSizeOptions),
  timeframe: z.enum(timeframeOptions),
  hardware: z.enum(hardwareOptions),
  impact: z.enum(impactOptions),
  difficulty: z.enum(difficultyOptions),
});

export const generatedIdeaSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  tagline: z.string().min(8),
  difficulty: z.enum(["Moderate", "Challenging", "Bleeding Edge"]),
  impact: z.string().min(3),
  feasibilityScore: z.number().min(0).max(100),
  innovationScore: z.number().min(0).max(100),
  demoImpact: z.number().min(0).max(100),
  tags: z.array(z.string().min(2)).min(1),
  problem: z.string().min(10),
  novelty: z.string().min(10),
  architecture: z.array(z.string().min(8)).min(1),
  datasets: z.string().min(5),
  deliverables: z.array(z.string().min(5)).min(1),
  extensions: z.string().min(8),
});

export const generateIdeasRequestSchema = questionnaireInputSchema;

export const generateIdeasResponseSchema = z.object({
  ideas: z.array(generatedIdeaSchema).min(1).max(6),
});

export type QuestionnaireInput = z.infer<typeof questionnaireInputSchema>;
export type GeneratedIdea = z.infer<typeof generatedIdeaSchema>;
export type GenerateIdeasRequest = z.infer<typeof generateIdeasRequestSchema>;
export type GenerateIdeasResponse = z.infer<typeof generateIdeasResponseSchema>;
