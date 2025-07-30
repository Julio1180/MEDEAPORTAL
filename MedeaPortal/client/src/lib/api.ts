import { apiRequest } from "./queryClient";

export interface ChatResponse {
  message: string;
  conversationId: string;
  conversation: {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  specialty?: string;
}

export async function sendChatMessage(message: string, conversationId?: string): Promise<ChatResponse> {
  const response = await apiRequest("POST", "/api/chat", {
    message,
    conversationId
  });
  return response.json();
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await apiRequest("GET", "/api/conversations");
  return response.json();
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const response = await apiRequest("GET", `/api/conversations/${conversationId}/messages`);
  return response.json();
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiRequest("GET", "/api/user");
  return response.json();
}
