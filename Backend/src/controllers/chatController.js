import { answerQuestion } from "../services/ragService.js";

export async function chat(req, res, next) {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Question is required"
            });
        }

        const answer = await answerQuestion(question);

        res.json({
            answer
        });
    } catch (error) {
        next(error);
    }
}