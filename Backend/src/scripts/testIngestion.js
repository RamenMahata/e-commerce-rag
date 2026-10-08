import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadKnowledgeBase } from "../services/ingestionService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const knowledgeDir = path.resolve(
    __dirname,
    "../../knowledge"
);

const chunks = await loadKnowledgeBase(knowledgeDir);

console.log(`Total chunks: ${chunks.length}`);

chunks.forEach((chunk, index) => {
    console.log(`\n--- Chunk ${index} ---`);
    console.log("Metadata:", chunk.metadata);
    console.log("Text:", chunk.text);
    console.log("Embedding dimensions:", chunk.embedding.length);
});