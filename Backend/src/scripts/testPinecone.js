import "dotenv/config";
import { pineconeIndex } from "../services/pineconeService.js";

const stats = await pineconeIndex.describeIndexStats();

console.log(JSON.stringify(stats, null, 2));