import { retrieveRelevantChunks } from "./retrievalService.js";
import { buildContext } from "./contextService.js";
import { generateAnswer } from "./llmService.js";

export async function answerQuestion(question) {
    const chunks = await retrieveRelevantChunks(question);

    const context = buildContext(chunks);

    const answer = await generateAnswer(question, context);

    return answer;
}