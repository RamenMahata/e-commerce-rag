import { createHash } from "node:crypto";

export function createChunkId(chunk) {
    return createHash("sha256")
        .update(
            `${chunk.metadata.source}:${chunk.metadata.chunk}:${chunk.text}`
        )
        .digest("hex");
}