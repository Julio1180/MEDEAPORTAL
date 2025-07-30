import { useState } from "react";
import { Header } from "@/components/layout/header";
import { ConversationSidebar } from "@/components/chat/conversation-sidebar";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useQueryClient } from "@tanstack/react-query";

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const queryClient = useQueryClient();

  const handleNewConversation = () => {
    setSelectedConversationId(undefined);
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <ConversationSidebar
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
        />
        
        <ChatInterface conversationId={selectedConversationId} />
      </div>
    </div>
  );
}
