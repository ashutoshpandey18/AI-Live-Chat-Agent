import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import type { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
}

function ChatWindow({ messages }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <div className="empty-state">
          <p>Start a conversation with our AI support agent</p>
        </div>
      ) : (
        messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatWindow;
