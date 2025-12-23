# AI Live Chat Agent

A production-ready AI-powered customer support chat application built with Node.js, TypeScript, Express, React, and OpenRouter LLM integration.

🔗 **Live Demo:** [https://ai-live-chat-agent-eight.vercel.app/](https://ai-live-chat-agent-eight.vercel.app/)

## Overview

This project demonstrates a minimal yet production-grade implementation of an AI chat agent for e-commerce customer support. It features real-time AI responses, persistent conversation history, and a clean, responsive UI.

**Key Features:**
- 💬 Real-time AI chat responses using OpenRouter API
- 📊 SQLite database for conversation persistence
- 🔄 Session-based conversation continuity
- 🎨 Clean, responsive React UI
- 🚀 Deployed on Render (backend) and Vercel (frontend)
- 🔒 Production-grade CORS and error handling

## Architecture

![Architecture Diagram](https://github.com/ashutoshpandey18/AI-Live-Chat-Agent/blob/master/architecture.png?raw=true)

The application follows a three-tier architecture:
- **Frontend Layer**: React components (ChatWindow, ChatInput, ChatMessage) communicate with the backend via REST API
- **Backend Layer**: Express server with Chat Service orchestrating business logic, LLM Service for AI integration, and Chat Repository for database operations
- **Data Layer**: SQLite database with Conversations and Messages tables for persistent storage
- **External Service**: OpenRouter API for LLM-powered responses

## Tech Stack

**Backend:**
- Node.js 20.x + TypeScript
- Express.js
- SQLite (better-sqlite3)
- OpenRouter API (Mistral 7B Instruct)
- CORS for cross-origin requests

**Frontend:**
- React + TypeScript
- Vite
- CSS Modules
- Fetch API for HTTP requests

**Deployment:**
- Backend: Render.com
- Frontend: Vercel
- Database: SQLite with WAL mode

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- OpenRouter API key ([sign up here](https://openrouter.ai/))

### Local Development

#### 1. Clone the Repository

```bash
git clone https://github.com/ashutoshpandey18/AI-Live-Chat-Agent.git
cd AI-Live-Chat-Agent
```

#### 2. Backend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
PORT=3000
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=mistralai/mistral-7b-instruct
DATABASE_PATH=./data/chat.db
FRONTEND_URL=http://localhost:5173
```

```bash
# Run in development mode
npm run dev

# Or build and run production mode
npm run build
npm start
```

Backend runs on `http://localhost:3000`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

```bash
# Run development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### Production Deployment

#### Backend (Render.com)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODEL=mistralai/mistral-7b-instruct`
   - `FRONTEND_URL=https://your-frontend.vercel.app`
   - `DATABASE_PATH=./data/chat.db`

#### Frontend (Vercel)

1. Import your GitHub repository
2. Set framework preset to **Vite**
3. Set root directory to `frontend`
4. Add environment variable:
   - `VITE_API_BASE_URL=https://your-backend.onrender.com`
5. Deploy

**Important:** After frontend deployment, update `FRONTEND_URL` on Render with your Vercel URL and redeploy the backend.

## Database

SQLite database is automatically initialized on first run at `data/chat.db`.

**Schema:**

```sql
-- Conversations
CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Messages
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL,
  sender TEXT NOT NULL CHECK(sender IN ('user', 'ai')),
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
```

No migrations needed. Schema is applied automatically via `src/db/init.ts`.

## Environment Variables

### Backend

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Backend server port | No | 3000 |
| `OPENROUTER_API_KEY` | OpenRouter API key | Yes | - |
| `OPENROUTER_MODEL` | LLM model to use | No | mistralai/mistral-7b-instruct |
| `DATABASE_PATH` | SQLite database file path | No | ./data/chat.db |
| `FRONTEND_URL` | Frontend URL for CORS | No | - |

### Frontend

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API URL | Yes |

## API Endpoints

### POST /chat/message

Send a user message and receive an AI reply.

**Request:**
```json
{
  "message": "What's your return policy?",
  "sessionId": "123"  // optional, for continuing conversations
}
```

**Response:**
```json
{
  "reply": "Our return policy allows...",
  "sessionId": "123"
}
```

**Validation:**
- Message required and non-empty
- Max 2000 characters

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Project Structure

```
AI-Live-Chat-Agent/
├── src/                      # Backend source code
│   ├── routes/               # API endpoints
│   │   └── chat.ts           # Chat message endpoint
│   ├── services/             # Business logic
│   │   ├── chat.service.ts   # Chat orchestration
│   │   └── llm.service.ts    # OpenRouter integration
│   ├── db/                   # Database layer
│   │   ├── init.ts           # Schema initialization
│   │   └── chat.repository.ts # Data access layer
│   ├── middleware/           # Express middleware
│   │   └── error.ts          # Error handler
│   ├── types/                # TypeScript interfaces
│   │   └── index.ts          # Shared types
│   ├── config/               # Configuration
│   │   └── index.ts          # Environment config
│   ├── app.ts                # Express app setup
│   └── server.ts             # Entry point
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ChatInput.tsx
│   │   ├── services/         # API client
│   │   │   └── api.ts
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx           # Main component
│   ├── public/               # Static assets
│   └── index.html            # Entry HTML
├── data/                     # SQLite database (gitignored)
│   └── chat.db
├── .env.example              # Backend env template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## LLM Integration

**Provider:** OpenRouter
**Default Model:** `mistralai/mistral-7b-instruct` (free tier)

The application uses OpenRouter as the LLM provider, which offers access to multiple AI models including Claude, GPT-4, Mistral, and more. The model can be configured via the `OPENROUTER_MODEL` environment variable.

**Implementation Details:**
- System prompt includes e-commerce store policies (shipping, returns, support hours)
- Conversation history limited to last 10 messages to control token usage
- 30-second timeout on LLM requests
- Comprehensive error handling with user-friendly fallback messages
- Rate limit and quota error detection

**Store Policies (hardcoded in system prompt):**
- Free shipping on orders over $50
- Standard shipping: 5-7 business days
- Express shipping: 2-3 days ($15)
- 30-day return policy
- Support hours: Monday-Friday 9 AM - 6 PM EST

**Error Handling:**
- API failures return safe fallback message
- Rate limit errors (429) are gracefully handled
- Payment errors (402) prompt users to check OpenRouter credits
- All errors logged server-side for monitoring

## Key Design Decisions

**SQLite over Postgres:**
- Zero configuration, no external dependencies
- Sufficient for demo and small-scale production
- WAL mode enabled for better concurrency
- Easy database inspection with sqlite3 CLI
- Trade-off: Not horizontally scalable

**No ORM:**
- Raw SQL with prepared statements is explicit and performant
- No hidden N+1 queries or magic
- Better performance for simple operations
- Trade-off: More verbose, manual type mapping

**Session-Based Conversations:**
- Simple integer ID system
- Frontend manages session persistence
- No authentication required for demo
- Trade-off: Sessions are not tied to users

**Synchronous LLM Calls:**
- Simple request/response flow
- Easy to debug and reason about
- Trade-off: No streaming (could be added later)

**Production CORS Configuration:**
- Origin whitelist with environment-based URLs
- Logs blocked origins for debugging
- Credentials support enabled
- Trade-off: Requires manual URL configuration

**Environment-Driven Configuration:**
- All secrets in environment variables
- Different configs for dev/prod
- `.env.example` files as documentation
- Trade-off: Requires proper env var management in deployment

**Stateless Backend:**
- Each request is independent
- Easy to scale horizontally on Render
- Session state in database only
- Trade-off: Slightly higher database load

## Future Enhancements

**High Priority:**
- [ ] Streaming responses via Server-Sent Events
- [ ] LocalStorage persistence for session IDs
- [ ] Loading states with animated indicators
- [ ] Conversation history endpoint (GET /chat/:sessionId)
- [ ] Rate limiting per session/IP
- [ ] Docker support for easier deployment

**Medium Priority:**
- [ ] PostgreSQL support for production scale
- [ ] User authentication (JWT or session-based)
- [ ] Admin dashboard for conversation monitoring
- [ ] Structured logging (Winston/Pino)
- [ ] Conversation search and filtering
- [ ] Export conversations as JSON/CSV

**Long-Term:**
- [ ] RAG integration for dynamic knowledge base
- [ ] Multi-channel support (WhatsApp, Slack, etc.)
- [ ] Agent handoff to human support
- [ ] Analytics dashboard with insights
- [ ] A/B testing for prompts
- [ ] Fine-tuning on real support data
- [ ] Multi-tenancy support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC

## Author

**Ashutosh Pandey**
- GitHub: [@ashutoshpandey18](https://github.com/ashutoshpandey18)
- Live Demo: [https://ai-live-chat-agent-eight.vercel.app/](https://ai-live-chat-agent-eight.vercel.app/)

---

Built with ❤️ using Node.js, TypeScript, React, and OpenRouter
