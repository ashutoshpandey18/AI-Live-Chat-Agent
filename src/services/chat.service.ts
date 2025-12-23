import {
  createConversation,
  getConversation,
  saveMessage,
  getMessages,
} from '../db/chat.repository';
import { generateReply } from './llm.service';

interface ChatResponse {
  reply: string;
  sessionId: string;
}

export async function processMessage(
  message: string,
  sessionId?: string
): Promise<ChatResponse> {
  let conversationId: number;

  if (sessionId) {
    const parsedId = parseInt(sessionId, 10);
    if (isNaN(parsedId)) {
      conversationId = createConversation();
    } else {
      const existing = getConversation(parsedId);
      if (existing) {
        conversationId = parsedId;
      } else {
        conversationId = createConversation();
      }
    }
  } else {
    conversationId = createConversation();
  }

  saveMessage(conversationId, 'user', message);

  const history = getMessages(conversationId);
  const aiReply = await generateReply(message, history);

  saveMessage(conversationId, 'ai', aiReply);

  return {
    reply: aiReply,
    sessionId: conversationId.toString(),
  };
}
