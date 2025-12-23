import db from './init';
import { Conversation, Message } from '../types';

export function createConversation(): number {
  const result = db.prepare('INSERT INTO conversations DEFAULT VALUES').run();
  return result.lastInsertRowid as number;
}

export function getConversation(id: number): Conversation | null {
  const row = db
    .prepare('SELECT id, created_at FROM conversations WHERE id = ?')
    .get(id) as Conversation | undefined;
  return row || null;
}

export function saveMessage(
  conversationId: number,
  sender: 'user' | 'ai',
  content: string
): number {
  const result = db
    .prepare(
      'INSERT INTO messages (conversation_id, sender, content) VALUES (?, ?, ?)'
    )
    .run(conversationId, sender, content);
  return result.lastInsertRowid as number;
}

export function getMessages(
  conversationId: number,
  limit?: number
): Message[] {
  let query = `
    SELECT id, conversation_id, sender, content, created_at
    FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
  `;

  if (limit) {
    query = `
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

  return db.prepare(query).all(conversationId) as Message[];
}
