import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateClinicalResponse, generateConversationTitle } from "./services/openai";
import { chatRequestSchema, insertConversationSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationId } = chatRequestSchema.parse(req.body);
      
      // For demo purposes, use the first user. In a real app, this would come from authentication
      const users = await storage.getConversationsByUser("dummy"); // This will be empty initially
      const demoUser = await storage.getUserByUsername("dr.garcia");
      if (!demoUser) {
        return res.status(500).json({ error: "Usuario demo no encontrado" });
      }

      let conversation;
      let conversationHistory: { role: string; content: string }[] = [];

      // Get or create conversation
      if (conversationId) {
        conversation = await storage.getConversation(conversationId);
        if (!conversation) {
          return res.status(404).json({ error: "Conversación no encontrada" });
        }
        
        // Get conversation history
        const messages = await storage.getMessagesByConversation(conversationId);
        conversationHistory = messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      } else {
        // Create new conversation
        const title = await generateConversationTitle(message);
        conversation = await storage.createConversation({
          userId: demoUser.id,
          title
        });
      }

      // Save user message
      await storage.createMessage({
        conversationId: conversation.id,
        content: message,
        role: "user"
      });

      // Generate AI response
      const aiResponse = await generateClinicalResponse(message, conversationHistory);

      // Save AI message
      await storage.createMessage({
        conversationId: conversation.id,
        content: aiResponse,
        role: "assistant"
      });

      // Update conversation timestamp
      await storage.updateConversation(conversation.id, { updatedAt: new Date() });

      res.json({
        message: aiResponse,
        conversationId: conversation.id,
        conversation: conversation
      });

    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Error interno del servidor" 
      });
    }
  });

  // Get conversations for current user
  app.get("/api/conversations", async (req, res) => {
    try {
      const demoUser = await storage.getUserByUsername("dr.garcia");
      if (!demoUser) {
        return res.status(500).json({ error: "Usuario demo no encontrado" });
      }

      const conversations = await storage.getConversationsByUser(demoUser.id);
      res.json(conversations);
    } catch (error) {
      console.error("Get conversations error:", error);
      res.status(500).json({ 
        error: "Error al obtener las conversaciones" 
      });
    }
  });

  // Get messages for a conversation
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ error: "Conversación no encontrada" });
      }

      const messages = await storage.getMessagesByConversation(id);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ 
        error: "Error al obtener los mensajes" 
      });
    }
  });

  // Get current user info
  app.get("/api/user", async (req, res) => {
    try {
      const demoUser = await storage.getUserByUsername("dr.garcia");
      if (!demoUser) {
        return res.status(500).json({ error: "Usuario demo no encontrado" });
      }

      res.json({
        id: demoUser.id,
        name: demoUser.name,
        specialty: demoUser.specialty
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ 
        error: "Error al obtener la información del usuario" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
