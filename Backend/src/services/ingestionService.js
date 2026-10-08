import { readdir } from "node:fs/promises";
import path from "node:path";

import { extractPdfText } from "./documentService.js";
import { splitIntoTokenChunks } from "./chunkingService.js";
import { createEmbeddings } from "./embeddingService.js";

export async function loadKnowledgeBase(knowledgeDir) {
    const fileNames = (await readdir(knowledgeDir))
        .filter((name) => name.toLowerCase().endsWith(".pdf"))
        .sort(); // Find PDFs
    /*
    this gives:
        [
        "refund-policy.pdf",
        "return-policy.pdf",
        "shipping-policy.pdf"
        ]
    */

    const chunks = [];

    for (const fileName of fileNames) {
        const filePath = path.join(knowledgeDir, fileName);

        const text = await extractPdfText(filePath);

        const fileChunks = splitIntoTokenChunks(
            text,
            fileName
        );

        chunks.push(...fileChunks); // All PDFs one collection of chunks
    } // Process each document: PDF -> extractPDFText() + clean text + chunking

    const batchSize = 100;
    const embeddedChunks = [];

    for (let start = 0; start < chunks.length; start += batchSize) {
        const batch = chunks.slice(start, start + batchSize);

        const embeddings = await createEmbeddings(
            batch.map(chunk => chunk.text)
        );

        batch.forEach((chunk, index) => {
            embeddedChunks.push({
                ...chunk,
                embedding: embeddings[index]
            });
        });
    }

    return embeddedChunks;

}