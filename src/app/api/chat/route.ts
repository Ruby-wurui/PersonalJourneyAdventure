import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const prompt = messages[messages.length - 1].text;

        // Read resume content
        const resumePath = path.join(process.cwd(), "src/assets/resume.txt");
        let resumeContent = "";
        try {
            resumeContent = fs.readFileSync(resumePath, "utf-8");
            console.log("Resume content loaded, length:", resumeContent.length);
        } catch (err) {
            console.error("Error reading resume file:", err);
        }

        // Use the gemini-2.0-flash model
        // We inject the resume into the prompt directly to ensure it's attended to,
        // as system instructions can sometimes be weaker in certain model versions.
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const finalPrompt = `
Context (Resume of Ruby Wu):
${resumeContent}

Instructions:
You are an AI assistant for Ruby Wu. Answer the user's question based strictly on the resume context provided above.
If the answer cannot be found in the resume, state that you don't have that information. Do not hallucinate or make up facts.
Keep answers professional and concise.

User Question:
${prompt}
`;

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error) {
        console.error("Error generating content:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to generate response" },
            { status: 500 }
        );
    }
}
