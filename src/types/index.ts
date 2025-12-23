export interface Conversation {
  id: number;
  created_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender: 'user' | 'ai';
  content: string;
  created_at: string;
}
