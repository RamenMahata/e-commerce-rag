import { retrieveRelevantChunks } from "../services/retrievalService.js";

const question = "Can I return a product after 10 days?";

const result = await retrieveRelevantChunks(question);

console.log(JSON.stringify(result, null, 2));