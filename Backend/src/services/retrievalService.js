import { createEmbedding } from "./embeddingService.js";
import { pineconeNamespace } from "./pineconeService.js";

const TOP_K = 3;

export async function retrieveRelevantChunks(question) {
    const queryEmbedding = await createEmbedding(question);

    const searchResult = await pineconeNamespace.query({
        vector: queryEmbedding,
        topK: TOP_K,
        includeMetadata: true
    });

    return searchResult.matches.map((match) => ({
        text: match.metadata?.text,
        score: match.score,
        source: match.metadata?.source,
        chunk: match.metadata?.chunk
    }));
}