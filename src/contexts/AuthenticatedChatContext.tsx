import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { aiChatService } from '../services/aiChatService';
import type { ChatHistory, ChatMessage, ChatResponse, ChatState } from '../types';

interface AuthenticatedChatContextType extends ChatState {
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  loadChatHistory: () => Promise<void>;
  currentUser: any | null;
  setCurrentUser: (user: any | null) => void;
}

const AuthenticatedChatContext = createContext<AuthenticatedChatContextType | undefined>(undefined);

export const useAuthenticatedChat = (): AuthenticatedChatContextType => {
  const context = useContext(AuthenticatedChatContext);
  if (!context) {
    throw new Error('useAuthenticatedChat must be used within an AuthenticatedChatProvider');
  }
  return context;
};

interface AuthenticatedChatProviderProps {
  children: ReactNode;
}

export const AuthenticatedChatProvider: React.FC<AuthenticatedChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatHistory[]>([]);
  const [currentConversation, setCurrentConversationState] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('user_data');
        const authToken = localStorage.getItem('auth_token');
        
        if (userData && authToken) {
          const user = JSON.parse(userData);
          setCurrentUser(user);
          // Load chat history for the user
          loadChatHistory();
        } else {
          // Check for guest user
          const guestHistory = localStorage.getItem('chat_history_guest');
          if (guestHistory) {
            const history = JSON.parse(guestHistory);
            setMessages(history.chats || []);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUser();
  }, []);

  const loadChatHistory = useCallback(async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const response = await aiChatService.getChatHistory(currentUser.id);
      
      // Convert to ChatHistory format
      const chatHistory: ChatHistory[] = response.chats.map((chat: any) => ({
        id: chat.id || Date.now(),
        user_message: chat.user_message || chat.message,
        ai_response: chat.ai_response || chat.response,
        conversation_id: chat.conversation_id || '',
        context_type: chat.context_type || 'general',
        created_at: chat.created_at || new Date().toISOString(),
        response_time: chat.response_time || chat.created_at || new Date().toISOString(),
        has_rag_context: chat.has_rag_context || false,
        sources: chat.sources
      }));

      setMessages(chatHistory);
      
      // Set the latest conversation ID
      if (chatHistory.length > 0) {
        const latestConversation = chatHistory[chatHistory.length - 1].conversation_id;
        setCurrentConversationState(latestConversation);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    try {
      const userId = currentUser?.id || 1; // Default to 1 for demo users
      
      const chatMessage: ChatMessage = {
        message,
        user_id: userId,
        conversation_id: currentConversation,
      };

      const response: ChatResponse = await aiChatService.sendMessage(chatMessage);
      
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
        id: Date.now(),
        user_message: message,
        ai_response: response.response,
        conversation_id: response.conversation_id || currentConversation || '',
        context_type: response.sources && response.sources.length > 0 ? 'rag' : 'general',
        created_at: new Date().toISOString(),
        response_time: new Date().toISOString(),
        has_rag_context: (response.sources && response.sources.length > 0) || false,
        sources: response.sources
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
  }, [currentUser, currentConversation]);

  const clearChat = useCallback(async () => {
    try {
      // Clear from backend and localStorage
      await aiChatService.clearChatHistory(currentUser?.id);
      
      // Clear local state
      setMessages([]);
      setSources([]);
      setCurrentConversationState(undefined);
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  }, [currentUser]);

  const handleSetCurrentUser = useCallback((user: any | null) => {
    setCurrentUser(user);
    
    if (user) {
      // Load chat history for the new user
      loadChatHistory();
    } else {
      // Clear messages when user logs out
      setMessages([]);
      setSources([]);
      setCurrentConversationState(undefined);
    }
  }, [loadChatHistory]);

  const value: AuthenticatedChatContextType = {
    messages,
    currentConversation,
    isLoading,
    sources,
    sendMessage,
    clearChat,
    loadChatHistory,
    currentUser,
    setCurrentUser: handleSetCurrentUser,
  };

  return (
    <AuthenticatedChatContext.Provider value={value}>
      {children}
    </AuthenticatedChatContext.Provider>
  );
};
