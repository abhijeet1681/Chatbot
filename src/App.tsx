import React from 'react';
import { AuthenticatedChatProvider } from './contexts/AuthenticatedChatContext';
import { AIChatPage } from './pages/AIChatPage';

function App() {
  return (
    <AuthenticatedChatProvider>
      <AIChatPage />
    </AuthenticatedChatProvider>
  );
}

export default App;