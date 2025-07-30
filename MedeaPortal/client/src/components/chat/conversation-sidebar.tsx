import { Plus, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface ConversationSidebarProps {
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
}

export function ConversationSidebar({ 
  selectedConversationId, 
  onSelectConversation, 
  onNewConversation 
}: ConversationSidebarProps) {
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["/api/conversations"],
    queryFn: getConversations,
  });

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Button 
          onClick={onNewConversation}
          className="w-full bg-medea-blue text-white hover:bg-medea-blue-dark"
        >
          <Plus className="mr-2" size={16} />
          Nueva Consulta
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Conversaciones Recientes</h3>
          
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-3 rounded-lg bg-gray-100 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500">No hay conversaciones aún</p>
              <p className="text-xs text-gray-400 mt-1">Inicia una nueva consulta para comenzar</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedConversationId === conversation.id
                      ? "bg-medea-blue bg-opacity-5 border border-medea-blue border-opacity-20"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {conversation.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(conversation.updatedAt), { 
                      addSuffix: true, 
                      locale: es 
                    })}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Medea Mind v1.0</p>
          <p className="mt-1">Asistente clínico con IA</p>
        </div>
      </div>
    </div>
  );
}
