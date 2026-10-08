import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadKnowledgeBase } from "../services/ingestionService.js";
import { upsertChunks } from "../services/pineconeService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const knowledgeDir = path.resolve(
    __dirname,
    "../../knowledge"
);

const chunks = await loadKnowledgeBase(knowledgeDir);

console.log(`Prepared ${chunks.length} chunks.`);

await upsertChunks(chunks);

console.log("Knowledge base ingestion complete.");