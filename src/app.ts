import express, { Request, Response } from 'express';
import cors from 'cors';
import chatRouter from './routes/chat';
import { errorHandler } from './middleware/error';
import { config } from './config';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  config.frontendUrl,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log('CORS Request from origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/chat', chatRouter);

app.use(errorHandler);

export default app;
