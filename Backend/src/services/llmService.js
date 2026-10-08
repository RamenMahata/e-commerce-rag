import "dotenv/config";
import OpenAI from "openai";

const openrouter = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});

const CHAT_MODEL = process.env.CHAT_MODEL;

export async function generateAnswer(question, context) {
    const instructions = `
You are an AI customer support assistant for ShopSphere.

Answer the customer's question using ONLY the company information provided below.

If the answer is not available in the company information, say exactly:

"I don't have that information in the company documents."

Format every answer for easy reading:
- Start with a short, direct answer.
- Use a clear heading when the answer has multiple parts.
- Use bullet points for rules, requirements, steps, or options.
- Keep paragraphs short and do not use tables.
- Use one blank line between sections, but do not add blank lines between individual bullet points.

COMPANY INFORMATION:
${context}
`;

    const response = await openrouter.responses.create({
        model: CHAT_MODEL,
        instructions,
        input: question
    });

    return response.output_text;
}