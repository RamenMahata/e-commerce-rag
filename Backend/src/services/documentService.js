import fs from "node:fs/promises";
import { PDFParse } from "pdf-parse";


// Extracts text from a PDF file located at the given file path.
export async function extractPdfText(filePath) {
    const fileBuffer = await fs.readFile(filePath); // The pdf is read as binary data (Buffer) from the file system.

    const parser = new PDFParse({
        data: fileBuffer,
    }); // An instance of the pdf-parse library is created to handle the PDF parsing.

    const result = await parser.getText(); // The text extraction is performed asynchronously.

    await parser.destroy(); // The parser instance is destroyed to free up resources.

    return cleanText(result.text); // The extracted text is returned as a string.
}

export function cleanText(text) {
    return text
        .replace(/\s+/g, " ")
        .trim();
}