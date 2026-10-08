import { retrieveRelevantChunks } from "../services/retrievalService.js";

const question = "How long after receiving an item can I send it back?";

const chunks = await retrieveRelevantChunks(question);

console.log(JSON.stringify(chunks, null, 2));