# ShopSphere AI Support

ShopSphere AI Support is an e-commerce customer-support assistant powered by retrieval-augmented generation (RAG). It answers customer questions using information retrieved from the ShopSphere knowledge base.

## Features

- React and Vite customer-support chat interface
- Express API for health checks and chat requests
- OpenRouter embeddings and chat completion
- Pinecone vector storage and similarity search
- PDF knowledge-base ingestion
- Markdown-formatted assistant responses

## Project structure

```text
Backend/
├── knowledge/       # Source documents for the knowledge base
└── src/
    ├── controllers/
    ├── routes/
    ├── services/    # RAG, embeddings, retrieval, and LLM integrations
    └── scripts/     # Knowledge-base ingestion and test scripts
Frontend/
├── src/              # React application
└── vite.config.js    # Development server and API proxy
```

## Prerequisites

- Node.js 18 or later
- An [OpenRouter](https://openrouter.ai/) API key
- A [Pinecone](https://www.pinecone.io/) API key and index

## Configuration

Create the backend environment file:

```bash
cd Backend
cp .env.example .env
```

Update `Backend/.env` with:

```env
PORT=5001
OPENROUTER_API_KEY=your_openrouter_api_key
CHAT_MODEL=your_openrouter_chat_model
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
PINECONE_NAMESPACE=policies
```

The frontend development server proxies `/api` requests to `http://localhost:5001`.

## Installation

Install dependencies in both applications:

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

## Ingest the knowledge base

From the backend directory, load the documents in `Backend/knowledge` into Pinecone:

```bash
cd Backend
node src/scripts/ingestKnowledgeBase.js
```

The default knowledge base includes `knowledge/return-policy.pdf`.

## Run locally

Start the backend in one terminal:

```bash
cd Backend
npm start
```

Start the frontend in another terminal:

```bash
cd Frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API endpoints

### Health check

```http
GET /api/health
```

### Chat

```http
POST /api/chat
Content-Type: application/json

{
  "question": "What is your return policy?"
}
```

## Production build

Build the frontend:

```bash
cd Frontend
npm run build
```

The generated files are written to `Frontend/dist`.

## Security

Never commit `Backend/.env` or API keys. Use `Backend/.env.example` as a template for local configuration.
