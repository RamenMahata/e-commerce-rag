import { getEncoding } from "js-tiktoken";

const tokenizer = getEncoding("cl100k_base");

export function splitIntoTokenChunks(
    text,
    source,
    chunkSize = 100
) {
    const tokens = tokenizer.encode(text);

    const chunks = [];

    for (let start = 0; start < tokens.length; start += chunkSize) {
        const chunk = tokenizer
            .decode(tokens.slice(start, start + chunkSize))
            .trim();

        if (chunk) {
            chunks.push({
                text: chunk,
                metadata: {
                    source,
                    chunk: chunks.length
                }
            });
        }
    }

    return chunks;
}