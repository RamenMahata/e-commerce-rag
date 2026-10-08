import { createEmbedding } from "../services/embeddingService.js";

const text = "Most products may be returned within 30 calendar days.";

const embedding = await createEmbedding(text);

console.log("Embedding generated.");
console.log("Dimensions:", embedding.length);
console.log("First 5 values:", embedding.slice(0, 5));