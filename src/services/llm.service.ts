import axios from 'axios';
import { config } from '../config';
import { Message } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MAX_HISTORY_MESSAGES = 10;

const SYSTEM_PROMPT = `You are a helpful customer support agent for an e-commerce store.

Store Policies:
- Shipping: Free shipping on orders over $50. Standard shipping takes 5-7 business days. Express shipping (2-3 days) costs $15.
- Returns: 30-day return policy. Items must be unused with original tags. Refunds processed within 5-7 business days.
- Support Hours: Monday-Friday 9 AM - 6 PM EST. Weekend support available via email only.

Be friendly, concise, and helpful. If you don't know something, admit it and offer to escalate.`;

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateReply(
  userMessage: string,
  conversationHistory: Message[]
): Promise<string> {
  if (!config.openRouterApiKey) {
    return "I'm having trouble connecting right now. Please try again later.";
  }

  try {
    const messages: OpenRouterMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    const recentHistory = conversationHistory.slice(-MAX_HISTORY_MESSAGES);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    }

    messages.push({ role: 'user', content: userMessage });

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: config.openRouterModel,
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${config.openRouterApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const reply = response.data.choices?.[0]?.message?.content;
    if (!reply) {
      throw new Error('No response from LLM');
    }

    return reply;
  } catch (error) {
    console.error('LLM error:', error);
    return "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";
  }
}
