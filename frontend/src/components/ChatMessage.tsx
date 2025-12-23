import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`message ${message.sender}`}>
      <div className="message-content">{message.content}</div>
    </div>
  );
}

export default ChatMessage;
