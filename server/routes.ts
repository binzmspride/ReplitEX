import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertDrawingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API routes
  // Drawings endpoints
  app.get("/api/drawings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const drawings = await storage.getDrawingsByUserId(req.user.id);
      res.json(drawings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get drawings" });
    }
  });

  app.post("/api/drawings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const parsed = insertDrawingSchema.parse({
        userId: req.user.id,
        imageData: req.body.imageData,
      });

      const drawing = await storage.createDrawing(parsed);
      res.status(201).json(drawing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid drawing data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save drawing" });
    }
  });

  app.delete("/api/drawings/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const drawingId = parseInt(req.params.id);
      if (isNaN(drawingId)) {
        return res.status(400).json({ message: "Invalid drawing ID" });
      }

      const drawing = await storage.getDrawing(drawingId);
      if (!drawing) {
        return res.status(404).json({ message: "Drawing not found" });
      }

      if (drawing.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to delete this drawing" });
      }

      await storage.deleteDrawing(drawingId);
      res.status(200).json({ message: "Drawing deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete drawing" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
