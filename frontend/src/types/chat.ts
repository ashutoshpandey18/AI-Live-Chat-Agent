export interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
}
