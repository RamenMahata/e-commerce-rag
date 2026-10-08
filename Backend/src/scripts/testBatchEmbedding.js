import { createEmbeddings } from "../services/embeddingService.js";

const texts = [
    "Most products may be returned within 30 calendar days.",
    "Customers must provide a valid ShopSphere order number.",
    "Final Sale products cannot be returned."
];

const embeddings = await createEmbeddings(texts);

console.log("Embeddings generated:", embeddings.length);

embeddings.forEach((embedding, index) => {
    console.log(
        `Embedding ${index}: ${embedding.length} dimensions`
    );
});