import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Trash2 } from "lucide-react";
import { sendChatMessage, getMessages, Message } from "@/lib/api";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  conversationId?: string;
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get messages for current conversation
  const { data: fetchedMessages, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/conversations", conversationId, "messages"],
    queryFn: () => conversationId ? getMessages(conversationId) : Promise.resolve([]),
    enabled: !!conversationId,
  });

  // Update local messages when fetched messages change
  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    } else if (!conversationId) {
      setMessages([]);
    }
  }, [fetchedMessages, conversationId]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => sendChatMessage(message, conversationId),
    onMutate: async (message) => {
      // Optimistically add user message
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId: conversationId || '',
        content: message,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, optimisticMessage]);
    },
    onSuccess: (response) => {
      // Remove optimistic message and add real messages
      setMessages(prev => {
        const withoutOptimistic = prev.filter(msg => !msg.id.startsWith('temp-'));
        return [
          ...withoutOptimistic,
          {
            id: `user-${Date.now()}`,
            conversationId: response.conversationId,
            content: prev[prev.length - 1].content,
            role: 'user' as const,
            createdAt: new Date().toISOString(),
          },
          {
            id: `assistant-${Date.now()}`,
            conversationId: response.conversationId,
            content: response.message,
            role: 'assistant' as const,
            createdAt: new Date().toISOString(),
          }
        ];
      });
      
      // Invalidate queries to refresh sidebar
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      if (response.conversationId !== conversationId) {
        queryClient.invalidateQueries({ 
          queryKey: ["/api/conversations", response.conversationId, "messages"] 
        });
      }
    },
    onError: (error) => {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al enviar el mensaje",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMessageMutation.isPending]);

  const handleSendMessage = (message: string) => {
    sendMessageMutation.mutate(message);
  };

  const exportConversation = () => {
    if (messages.length === 0) return;
    
    const content = messages.map(msg => 
      `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversacion-${new Date().toLocaleDateString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearConversation = () => {
    if (confirm('¿Estás seguro de que quieres limpiar esta conversación?')) {
      setMessages([]);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Consulta Clínica</h2>
            <p className="text-sm text-gray-500">Asistente especializado en psicología clínica</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-medea-success">
              <div className="w-2 h-2 bg-medea-success rounded-full animate-pulse"></div>
              <span>IA Activa</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={exportConversation}
              disabled={messages.length === 0}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Exportar conversación"
            >
              <Download size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearConversation}
              disabled={messages.length === 0}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Limpiar conversación"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <MessageList 
            messages={messages} 
            isLoading={sendMessageMutation.isPending}
          />
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <MessageInput 
        onSendMessage={handleSendMessage}
        isLoading={sendMessageMutation.isPending}
      />
    </div>
  );
}
