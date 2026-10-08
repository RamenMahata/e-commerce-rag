import "dotenv/config";
import { Pinecone } from "@pinecone-database/pinecone";
import { createChunkId } from "../utils/id.js";

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const indexName = process.env.PINECONE_INDEX_NAME;
const namespaceName = process.env.PINECONE_NAMESPACE ?? "policies";

export const pineconeNamespace =
    pinecone.index(indexName).namespace(namespaceName);

export const pineconeIndex = pinecone.index(indexName);

export async function ensureIndex() {
    const indexes = await pinecone.listIndexes();

    const exists = indexes.indexes?.some(
        index => index.name === indexName
    );

    if (exists) {
        console.log(`Pinecone index "${indexName}" already exists.`);
        return;
    }

    await pinecone.createIndex({
        name: indexName,
        dimension: 1024,
        metric: "cosine",
        spec: {
            serverless: {
                cloud: "aws",
                region: "us-east-1"
            }
        }
    });

    console.log(`Created Pinecone index "${indexName}".`);
}

export async function upsertChunks(chunks) {
    console.log("Chunks received:", chunks.length);
    console.log("First chunk:", chunks[0]);

    const records = chunks.map(chunk => ({
        id: createChunkId(chunk),
        values: chunk.embedding,
        metadata: {
            ...chunk.metadata,
            text: chunk.text
        }
    }));

    console.log("Records created:", records.length);
    console.log("First record:", records[0]);

    await pineconeNamespace.upsert({
        records
    });

    console.log(`Upserted ${records.length} vectors.`);
}