import { Bot, User, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { Message } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const { toast } = useToast();

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Mensaje copiado",
      description: "El mensaje ha sido copiado al portapapeles",
    });
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-medea-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot className="text-medea-blue" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Bienvenido al Asistente Clínico IA</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Estoy aquí para ayudarte con consultas clínicas, análisis de casos y orientación terapéutica. 
          ¿En qué puedo asistirte hoy?
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex space-x-3 ${message.role === 'user' ? 'justify-end' : ''}`}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-medea-blue rounded-full flex items-center justify-center">
                <Bot className="text-white" size={16} />
              </div>
            </div>
          )}
          
          <div className={`flex-1 ${message.role === 'user' ? 'ml-12' : ''}`}>
            <div className={`rounded-lg shadow-sm p-4 ${
              message.role === 'user' 
                ? 'bg-medea-blue text-white' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="prose prose-sm max-w-none">
                <p className={`leading-relaxed whitespace-pre-line ${
                  message.role === 'user' ? 'text-white' : 'text-gray-800'
                }`}>
                  {message.content}
                </p>
              </div>
              
              <div className={`flex items-center justify-between mt-3 pt-3 border-t ${
                message.role === 'user' 
                  ? 'border-medea-blue-dark border-opacity-20' 
                  : 'border-gray-100'
              }`}>
                <span className={`text-xs ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatDistanceToNow(new Date(message.createdAt), { 
                    addSuffix: true, 
                    locale: es 
                  })}
                </span>
                
                {message.role === 'assistant' && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-medea-blue"
                      title="Útil"
                    >
                      <ThumbsUp size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      title="No útil"
                    >
                      <ThumbsDown size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      onClick={() => copyMessage(message.content)}
                      title="Copiar"
                    >
                      <Copy size={12} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {message.role === 'user' && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-medea-gray rounded-full flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-medea-blue rounded-full flex items-center justify-center">
              <Bot className="text-white" size={16} />
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-medea-blue rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-medea-blue rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-medea-blue rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-500">El asistente está escribiendo...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
