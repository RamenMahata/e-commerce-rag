export function buildContext(chunks) {
    return chunks
        .map((chunk) => chunk.text)
        .join("\n\n");
}