import path from "node:path";
import { fileURLToPath } from "node:url";

import { extractPdfText } from "../services/documentService.js";
import { splitIntoTokenChunks } from "../services/chunkingService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.resolve(
    __dirname,
    "../../knowledge/return-policy.pdf"
);

const text = await extractPdfText(pdfPath);
const chunks = splitIntoTokenChunks(
    text,
    "return-policy.pdf"
);

console.log(`Total chunks: ${chunks.length}`);

chunks.forEach((chunk, index) => {
    console.log(`\n--- Chunk ${index} ---`);
    console.log(chunk);
});
