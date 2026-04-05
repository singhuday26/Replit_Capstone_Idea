import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  generateIdeasRequestSchema,
  generateIdeasResponseSchema,
} from "@shared/idea-contract";
import { fromError } from "zod-validation-error";
import { generateDeterministicIdeas } from "./idea-engine/mock-generator";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.post("/api/ideas/generate", (req, res) => {
    const parsedInput = generateIdeasRequestSchema.safeParse(req.body);

    if (!parsedInput.success) {
      return res.status(400).json({
        message: fromError(parsedInput.error).toString(),
        issues: parsedInput.error.issues,
      });
    }

    const generatedIdeas = generateDeterministicIdeas(parsedInput.data);
    const parsedOutput = generateIdeasResponseSchema.safeParse({
      ideas: generatedIdeas,
    });

    if (!parsedOutput.success) {
      return res.status(500).json({
        message: "Failed to generate valid idea response.",
      });
    }

    return res.status(200).json(parsedOutput.data);
  });

  // Keep a reference to storage for upcoming steps where generation
  // results will be persisted using storage-backed implementations.
  void storage;

  return httpServer;
}
