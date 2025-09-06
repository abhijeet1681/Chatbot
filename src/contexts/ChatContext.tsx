import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { mockChatService } from '../services/mockChat';
import type { ChatHistory, ChatMessage, ChatResponse, ChatState } from '../types';

interface ChatContextType extends ChatState {
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatHistory[]>([]);
  const [currentConversation, setCurrentConversationState] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<string[]>([]);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    try {
      const chatMessage: ChatMessage = {
        message,
        user_id: 1, // Default user ID for demo
        conversation_id: currentConversation,
      };

      const response: ChatResponse = await mockChatService.sendMessage(chatMessage);
      
      // Update current conversation ID if we got a new one
      if (response.conversation_id) {
        setCurrentConversationState(response.conversation_id);
      }

      // Update sources if available
      if (response.sources) {
        setSources(response.sources);
      }

      // Add the new message exchange to the messages array
      const newChatEntry: ChatHistory = {
        id: Date.now(), // Temporary ID
        user_message: message,
        ai_response: response.response,
        conversation_id: response.conversation_id || currentConversation || '',
        context_type: response.sources && response.sources.length > 0 ? 'rag' : 'general',
        created_at: new Date().toISOString(),
        response_time: new Date().toISOString(),
        has_rag_context: (response.sources && response.sources.length > 0) || false,
      };

      setMessages(prev => [...prev, newChatEntry]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message to chat
      const errorEntry: ChatHistory = {
        id: Date.now(),
        user_message: message,
        ai_response: 'Sorry, I encountered an error. Please try again.',
        conversation_id: currentConversation || '',
        context_type: 'general',
        created_at: new Date().toISOString(),
        response_time: new Date().toISOString(),
        has_rag_context: false,
      };
      setMessages(prev => [...prev, errorEntry]);
    } finally {
      setIsLoading(false);
    }
  }, [currentConversation]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSources([]);
    setCurrentConversationState(undefined);
  }, []);

  const value: ChatContextType = {
    messages,
    currentConversation,
    isLoading,
    sources,
    sendMessage,
    clearChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};