import "dotenv/config";
import OpenAI from "openai";

const openrouter = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});

const EMBEDDING_MODEL = "openai/text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1024;

// For query embeddings
export async function createEmbedding(text) {
    const response = await openrouter.embeddings.create({
        model: EMBEDDING_MODEL,
        input: text,
        dimensions: EMBEDDING_DIMENSIONS
    });

    return response.data[0].embedding;
}

// For batch embeddings , chunk embeddings
export async function createEmbeddings(texts) {
    const response = await openrouter.embeddings.create({
        model: EMBEDDING_MODEL,
        input: texts,
        dimensions: EMBEDDING_DIMENSIONS
    });

    return response.data.map(item => item.embedding);
}