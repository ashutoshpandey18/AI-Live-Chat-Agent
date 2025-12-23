import express, { Request, Response } from 'express';
import cors from 'cors';
import chatRouter from './routes/chat';
import { errorHandler } from './middleware/error';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/chat', chatRouter);

app.use(errorHandler);

export default app;
