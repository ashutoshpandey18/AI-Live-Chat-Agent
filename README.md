# AI Live Chat Agent

A minimal AI-powered customer support chat application built with Node.js, TypeScript, Express, React, and Claude Sonnet via OpenRouter.

## Tech Stack

**Backend:**
- Node.js + TypeScript
- Express
- SQLite (better-sqlite3)
- OpenRouter API (Claude Sonnet 3.5)
- axios for HTTP requests

**Frontend:**
- React + TypeScript
- Vite
- Native fetch API

## Quick Start

### Prerequisites

- Node.js 20.x
- npm
- OpenRouter API key ([get one here](https://openrouter.ai/))

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env .env.local  # or create .env file
```

Add your OpenRouter API key to `.env`:
```
PORT=3000
OPENROUTER_API_KEY=your_actual_api_key_here
```

3. Run the backend:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Backend runs on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

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

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Backend server port | No (default: 3000) |
| `OPENROUTER_API_KEY` | OpenRouter API key | Yes |

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

## Architecture

```
src/
├── routes/          # API endpoints (Express routers)
├── services/        # Business logic
│   ├── chat.service.ts    # Orchestrates chat flow
│   └── llm.service.ts     # OpenRouter/Claude integration
├── db/              # Database layer
│   ├── init.ts            # Schema initialization
│   └── chat.repository.ts # Data access functions
├── middleware/      # Express middleware (error handling)
├── types/           # TypeScript interfaces
├── config/          # Environment configuration
├── app.ts           # Express app setup
└── server.ts        # Entry point
```

**Separation of Concerns:**
- Routes handle HTTP concerns only
- Services contain business logic
- Repository handles all SQL
- LLM service is isolated and swappable

## LLM Integration

**Provider:** OpenRouter
**Model:** `anthropic/claude-3.5-sonnet`

**Implementation Details:**
- System prompt includes hardcoded store policies (shipping, returns, support hours)
- Conversation history limited to last 10 messages to control token usage
- 30-second timeout on LLM requests
- Graceful error handling with fallback responses
- No streaming (future enhancement)

**Token Management:**
- History cap prevents unbounded context growth
- Max message length: 2000 characters
- Estimated max tokens per request: ~4000

**Error Handling:**
- API failures return safe fallback message
- Errors logged server-side
- User sees: "I'm sorry, I'm having trouble responding right now."

## Key Design Decisions

**SQLite over Postgres:**
- Simpler setup, no external dependencies
- Sufficient for demo/small-scale usage
- Easy to inspect with sqlite3 CLI
- Trade-off: Not production-ready for scale

**No ORM:**
- Raw SQL is explicit and debuggable
- No magic, no N+1 queries
- Better performance for simple queries
- Trade-off: More verbose, manual type mapping

**Session ID as Conversation ID:**
- Simple integer ID
- Frontend manages persistence
- No auth required for demo
- Trade-off: No user identity, sessions can be guessed

**Synchronous LLM Calls:**
- Simple request/response flow
- Easy to reason about
- Trade-off: No streaming, slower UX

**No WebSockets:**
- Standard HTTP is simpler
- Sufficient for request/response pattern
- Trade-off: Can't push updates, no real-time feel

**Hardcoded System Prompt:**
- Prompt is part of the codebase
- Easy to version and review
- Trade-off: Requires redeploy to change

**CORS Wide Open:**
- `cors()` with no restrictions
- Fine for local dev
- Trade-off: Must restrict in production

## If I Had More Time

**Short-term:**
- Add streaming responses via Server-Sent Events
- Persist sessionId to localStorage in frontend
- Add loading indicators with animated dots
- Better error messages with retry logic
- Add conversation history endpoint (GET /chat/history/:sessionId)
- Rate limiting per session

**Medium-term:**
- Move to PostgreSQL for production
- Add authentication (session-based or JWT)
- Implement RAG for dynamic knowledge base
- Add admin dashboard to view conversations
- Structured logging (pino or winston)
- Proper production CORS configuration
- Conversation titles/summaries

**Long-term:**
- Multi-channel support (WhatsApp, Instagram DM)
- Agent handoff (escalate to human)
- Analytics and conversation insights
- A/B testing different prompts
- Fine-tuning on actual support conversations
- Multi-tenancy for different stores

## Testing

Currently no tests. For production, add:
- Unit tests for services and repository
- Integration tests for API endpoints
- E2E tests for critical user flows

## License

ISC
