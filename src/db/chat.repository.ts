import db from './init';
import type { Conversation, Message } from '../types';

const createConversationStmt = db.prepare('INSERT INTO conversations DEFAULT VALUES');
const getConversationStmt = db.prepare('SELECT id, created_at FROM conversations WHERE id = ?');
const saveMessageStmt = db.prepare('INSERT INTO messages (conversation_id, sender, content) VALUES (?, ?, ?)');

export function createConversation(): number {
  const result = createConversationStmt.run();
  return result.lastInsertRowid as number;
}

export function getConversation(id: number): Conversation | null {
  const row = getConversationStmt.get(id) as Conversation | undefined;
  return row || null;
}

export function saveMessage(
  conversationId: number,
  sender: 'user' | 'ai',
  content: string
): number {
  const result = saveMessageStmt.run(conversationId, sender, content);
  return result.lastInsertRowid as number;
}

export function getMessages(
  conversationId: number,
  limit?: number
): Message[] {
  if (limit) {
    const query = `
      SELECT * FROM (
        SELECT id, conversation_id, sender, content, created_at
        FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      )
      ORDER BY created_at ASC
    `;
    return db.prepare(query).all(conversationId, limit) as Message[];
  }

  const query = `
    SELECT id, conversation_id, sender, content, created_at
    FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
  `;
  return db.prepare(query).all(conversationId) as Message[];
}
