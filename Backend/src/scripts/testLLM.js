import { generateAnswer } from "../services/llmService.js";

const question = "Can I return a product after 10 days?";

const context = `
Most products may be returned within 30 calendar days from the date of delivery.

The item should be unused, undamaged, and returned with its original packaging, accessories, manuals, and tags.
`;

const answer = await generateAnswer(question, context);

console.log(answer);