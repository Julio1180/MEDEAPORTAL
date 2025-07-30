import { useState } from "react";
import { Send, Paperclip, Stethoscope, Brain, ClipboardList, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const templates = {
  diagnosis: "Necesito ayuda con un diagnóstico diferencial. El paciente presenta los siguientes síntomas: ",
  therapy: "¿Qué estrategias terapéuticas recomendarías para un paciente con ",
  assessment: "¿Qué instrumentos de evaluación psicológica serían apropiados para ",
  crisis: "Tengo un paciente en situación de crisis que presenta "
};

export function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const useTemplate = (templateKey: keyof typeof templates) => {
    setMessage(templates[templateKey]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu consulta clínica aquí..."
              className="resize-none min-h-[80px] pr-12 focus:ring-medea-blue focus:border-medea-blue"
              maxLength={2000}
            />
            
            <div className="absolute bottom-2 right-12 text-xs text-gray-400">
              {message.length}/2000
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute bottom-3 right-3 h-6 w-6 p-0 text-gray-400 hover:text-medea-blue"
              title="Adjuntar archivo"
            >
              <Paperclip size={14} />
            </Button>
          </div>
          
          <Button 
            type="submit" 
            disabled={!message.trim() || isLoading}
            className="bg-medea-blue text-white hover:bg-medea-blue-dark disabled:opacity-50"
          >
            <Send className="mr-2" size={16} />
            Enviar
          </Button>
        </form>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => useTemplate('diagnosis')}
            className="text-xs hover:bg-gray-50"
          >
            <Stethoscope className="mr-1" size={12} />
            Diagnóstico diferencial
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => useTemplate('therapy')}
            className="text-xs hover:bg-gray-50"
          >
            <Brain className="mr-1" size={12} />
            Estrategias terapéuticas
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => useTemplate('assessment')}
            className="text-xs hover:bg-gray-50"
          >
            <ClipboardList className="mr-1" size={12} />
            Evaluación psicológica
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => useTemplate('crisis')}
            className="text-xs hover:bg-gray-50"
          >
            <AlertTriangle className="mr-1" size={12} />
            Intervención en crisis
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          Esta herramienta es un asistente de apoyo. Siempre aplica tu criterio clínico profesional en las decisiones terapéuticas.
        </p>
      </div>
    </div>
  );
}
