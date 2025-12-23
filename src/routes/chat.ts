import { Router, Request, Response } from 'express';
import { processMessage } from '../services/chat.service';

const router = Router();

const MAX_MESSAGE_LENGTH = 2000;

router.post('/message', async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      res.status(400).json({ error: 'Message cannot be empty' });
      return;
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({
        error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`
      });
      return;
    }

    const result = await processMessage(trimmedMessage, sessionId);
    res.json(result);
  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
